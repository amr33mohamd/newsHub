<?php

namespace App\Services;

use App\Helpers\ArticleTransformer;
use App\Helpers\AuthorHelper;
use App\Helpers\CategoryHelper;
use App\Repositories\ArticleRepository;
use App\Repositories\SourceRepository;
use App\Services\NewsAdapters\AbstractNewsAdapter;
use App\Services\NewsAdapters\GuardianAdapter;
use App\Services\NewsAdapters\NewsApiAdapter;
use App\Services\NewsAdapters\NYTAdapter;
use Illuminate\Support\Facades\Log;

class NewsService
{
    /**
     * @var ArticleRepository
     */
    protected $articleRepository;

    /**
     * @var SourceRepository
     */
    protected $sourceRepository;

    /**
     * NewsService constructor.
     *
     * @param ArticleRepository $articleRepository
     * @param SourceRepository $sourceRepository
     */
    public function __construct(ArticleRepository $articleRepository, SourceRepository $sourceRepository)
    {
        $this->articleRepository = $articleRepository;
        $this->sourceRepository = $sourceRepository;
    }

    /**
     * Fetch articles from a specific news source using its profile
     *
     * @param string $profileName The profile name from config (e.g., 'newsapi', 'guardian', 'nyt')
     * @param array $params Additional parameters (category, query, date range, etc.)
     * @return bool Success status
     */
    public function fetchArticles(string $profileName, array $params = []): bool
    {
        try {
            // Get the news source profile from configuration
            $profile = config("news_sources.$profileName");

            if (!$profile) {
                Log::error("News source profile '$profileName' not found.");
                return false;
            }

            Log::info("Fetching articles from {$profile['name']}");

            // Create appropriate adapter for this news source
            $adapter = $this->createAdapter($profileName, $profile);

            if (!$adapter) {
                Log::error("No adapter found for profile '$profileName'");
                return false;
            }

            // Fetch articles using the adapter
            $articles = $adapter->fetchArticles($params);

            if (empty($articles)) {
                Log::warning("No articles found in response from {$profile['name']}");
                return false;
            }

            // Process and save articles to database
            return $this->processArticles($articles, $adapter, $profileName);

        } catch (\Exception $e) {
            Log::error("Failed to fetch from $profileName: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Create the appropriate adapter for the news source
     *
     * @param string $profileName
     * @param array $profile
     * @return AbstractNewsAdapter|null
     */
    protected function createAdapter(string $profileName, array $profile): ?AbstractNewsAdapter
    {
        return match($profileName) {
            'newsapi' => new NewsApiAdapter($profile),
            'guardian' => new GuardianAdapter($profile),
            'nyt' => new NYTAdapter($profile),
            default => null
        };
    }

    /**
     * Process and save articles to database
     *
     * @param array $articles
     * @param AbstractNewsAdapter $adapter
     * @param string $profileName
     * @return bool
     */
    protected function processArticles(array $articles, AbstractNewsAdapter $adapter, string $profileName): bool
    {
        $articlesProcessed = 0;

        // Use SourceRepository to get source by API identifier
        $source = $this->sourceRepository->findByApiIdentifier($profileName);

        if (!$source) {
            Log::error("Source not found for profile: $profileName");
            return false;
        }

        $fieldMapping = $adapter->getFieldMapping();
        $imagePrefix = $adapter->getImagePrefix();

        foreach ($articles as $articleData) {
            try {
                // Transform API data to our schema using ArticleTransformer helper
                $transformed = ArticleTransformer::transform($articleData, $fieldMapping, $imagePrefix);

                // Skip if required fields are missing
                if (!ArticleTransformer::isValid($transformed)) {
                    continue;
                }

                // Get or create category using CategoryHelper
                $category = CategoryHelper::getOrCreate($transformed['category_name'] ?? null);

                // Get or create author using AuthorHelper
                $author = AuthorHelper::getOrCreate($transformed['author_name'] ?? null, $source->id);

                // Generate URL hash for uniqueness
                $urlHash = ArticleTransformer::generateUrlHash($transformed['url']);

                // Use ArticleRepository to create or update article
                $this->articleRepository->createOrUpdateArticle(
                    $urlHash,
                    [
                        'source_id' => $source->id,
                        'category_id' => $category?->id,
                        'author_id' => $author?->id,
                        'url' => $transformed['url'],
                        'url_hash' => $urlHash,
                        'title' => $transformed['title'],
                        'description' => $transformed['description'] ?? null,
                        'content' => $transformed['content'] ?? null,
                        'image_url' => $transformed['image_url'] ?? null,
                        'published_at' => $transformed['published_at'] ?? null,
                    ]
                );

                $articlesProcessed++;

            } catch (\Exception $e) {
                Log::warning("Error processing article: " . $e->getMessage());
            }
        }

        Log::info("Processed {$articlesProcessed} articles from {$adapter->getName()}");

        return $articlesProcessed > 0;
    }
}
