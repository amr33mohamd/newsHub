<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Source;
use App\Models\Category;
use App\Models\Author;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class NewsService
{
    /**
     * Fetch articles from a specific news source using its profile
     *
     * @param string $profileName The profile name from config (e.g., 'newsapi', 'guardian', 'nyt')
     * @param array $params Additional parameters (category, query, date range, etc.)
     * @return bool Success status
     */
    public function fetchArticles($profileName, $params = [])
    {
        try {
            // Get the news source profile from configuration
            $profile = config("news_sources.$profileName");

            if (!$profile) {
                Log::error("News source profile '$profileName' not found.");
                return false;
            }

            Log::info("Fetching articles from {$profile['name']}");

            // Make API request to the news source
            $response = $this->makeApiRequest($profile, $params);

            // Validate the API response
            if (!$this->isValidResponse($response)) {
                Log::error("Invalid response from {$profile['name']}");
                return false;
            }

            // Process and save articles to database
            return $this->processArticles($response, $profile, $profileName);

        } catch (\Exception $e) {
            Log::error("Failed to fetch from $profileName: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Make API request to news source
     *
     * @param array $profile
     * @param array $params
     * @return \Illuminate\Http\Client\Response
     */
    protected function makeApiRequest($profile, $params = [])
    {
        $endpoint = $params['endpoint'] ?? array_key_first($profile['endpoints']);
        $url = $profile['base_url'] . $profile['endpoints'][$endpoint];

        // Build query parameters with API key and custom params
        $apiKeyParam = $profile['api_key_param'] ?? 'apiKey';
        $queryParams = array_merge(
            $profile['default_params'] ?? [],
            $params['query_params'] ?? [],
            [$apiKeyParam => $profile['api_key']]
        );

        // Handle endpoint placeholders for dynamic URLs
        if (isset($params['path_params'])) {
            foreach ($params['path_params'] as $key => $value) {
                $url = str_replace("{{$key}}", $value, $url);
            }
        }

        Log::info("API Request: $url", ['params' => $queryParams]);

        $response = Http::timeout(30)
            ->retry(3, 100)
            ->get($url, $queryParams);

        Log::info("API Response Status: " . $response->status());

        return $response;
    }

    /**
     * Validate API response
     *
     * @param \Illuminate\Http\Client\Response $response
     * @return bool
     */
    protected function isValidResponse($response)
    {
        if (!$response->successful()) {
            return false;
        }

        $data = $response->json();

        // Ensure response contains data
        if (empty($data)) {
            return false;
        }

        return true;
    }

    /**
     * Process and save articles to database
     *
     * @param \Illuminate\Http\Client\Response $response
     * @param array $profile
     * @param string $profileName
     * @return bool
     */
    protected function processArticles($response, $profile, $profileName)
    {
        $data = $response->json();

        // Extract articles array based on source-specific response structure
        $articles = $this->extractArticlesArray($data, $profileName);

        if (empty($articles)) {
            Log::warning("No articles found in response from {$profile['name']}");
            return false;
        }

        $articlesProcessed = 0;
        $source = Source::where('api_identifier', $profileName)->first();

        foreach ($articles as $articleData) {
            try {
                // Transform API data to our schema using field mapping
                $transformed = $this->transformArticle($articleData, $profile);

                // Skip if required fields are missing
                if (empty($transformed['title']) || empty($transformed['url'])) {
                    continue;
                }

                // Get or create category from article data
                $category = null;
                if (!empty($transformed['category_name'])) {
                    $category = Category::firstOrCreate(
                        ['slug' => Str::slug($transformed['category_name'])],
                        ['name' => $transformed['category_name']]
                    );
                }

                // Get or create author from article data
                $author = null;
                if (!empty($transformed['author_name'])) {
                    $author = Author::firstOrCreate(
                        ['name' => $transformed['author_name'], 'source_id' => $source->id]
                    );
                }

                // Create or update article using URL hash as unique identifier
                $urlHash = hash('sha256', $transformed['url']);

                Article::updateOrCreate(
                    ['url_hash' => $urlHash],
                    [
                        'source_id' => $source->id,
                        'category_id' => $category?->id,
                        'author_id' => $author?->id,
                        'url' => $transformed['url'],
                        'url_hash' => $urlHash,
                        'title' => $transformed['title'],
                        'description' => $transformed['description'],
                        'content' => $transformed['content'],
                        'image_url' => $transformed['image_url'],
                        'published_at' => $transformed['published_at'],
                    ]
                );

                $articlesProcessed++;

            } catch (\Exception $e) {
                Log::warning("Error processing article: " . $e->getMessage());
            }
        }

        Log::info("Processed {$articlesProcessed} articles from {$profile['name']}");

        return $articlesProcessed > 0;
    }

    /**
     * Extract articles array from API response
     * Different APIs have different response structures
     *
     * @param array $data
     * @param string $profileName
     * @return array
     */
    protected function extractArticlesArray($data, $profileName)
    {
        return match($profileName) {
            'newsapi' => $data['articles'] ?? [],
            'guardian' => $data['response']['results'] ?? [],
            'nyt' => $data['results'] ?? $data['response']['docs'] ?? [],
            default => []
        };
    }

    /**
     * Transform article data using field mapping from profile configuration
     *
     * @param array $articleData
     * @param array $profile
     * @return array
     */
    protected function transformArticle($articleData, $profile)
    {
        $mapping = $profile['field_mapping'];
        $transformed = [];

        // Map each field using dot notation for nested data
        foreach ($mapping as $ourField => $theirField) {
            if ($theirField === null) {
                $transformed[$ourField] = null;
                continue;
            }

            $value = Arr::get($articleData, $theirField);

            // Handle image prefix for relative image URLs
            if ($ourField === 'image_url' && isset($profile['image_prefix'])) {
                $value = $profile['image_prefix'] . $value;
            }

            $transformed[$ourField] = $value;
        }

        // Extract category/section name if available
        if (!empty($mapping['source_name'])) {
            $transformed['category_name'] = Arr::get($articleData, $mapping['source_name']);
        }

        // Extract and clean author name if available
        if (!empty($mapping['author'])) {
            $authorValue = Arr::get($articleData, $mapping['author']);
            $transformed['author_name'] = $this->cleanAuthorName($authorValue);
        }

        return $transformed;
    }

    /**
     * Clean author name from various formats
     *
     * @param string|null $author
     * @return string|null
     */
    protected function cleanAuthorName($author)
    {
        if (empty($author)) {
            return null;
        }

        // Remove common prefixes like 'By' or 'by'
        $author = preg_replace('/^(By|by)\s+/i', '', $author);

        // Take first author if multiple authors listed
        $authors = preg_split('/\s+and\s+|,\s*/i', $author);

        return trim($authors[0]);
    }
}
