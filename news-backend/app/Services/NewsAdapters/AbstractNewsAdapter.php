<?php

namespace App\Services\NewsAdapters;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

abstract class AbstractNewsAdapter
{
    /**
     * The news source profile configuration
     *
     * @var array
     */
    protected $profile;

    /**
     * AbstractNewsAdapter constructor.
     *
     * @param array $profile
     */
    public function __construct(array $profile)
    {
        $this->profile = $profile;
    }

    /**
     * Fetch articles from the news source
     *
     * @param array $params
     * @return array|null
     */
    public function fetchArticles(array $params = []): ?array
    {
        try {
            $response = $this->makeApiRequest($params);

            if (!$this->isValidResponse($response)) {
                Log::error("Invalid response from {$this->profile['name']}");
                return null;
            }

            $data = $response->json();
            return $this->extractArticles($data);

        } catch (\Exception $e) {
            Log::error("Failed to fetch from {$this->profile['name']}: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Make API request to news source
     *
     * @param array $params
     * @return \Illuminate\Http\Client\Response
     */
    protected function makeApiRequest(array $params = [])
    {
        $endpoint = $params['endpoint'] ?? array_key_first($this->profile['endpoints']);
        $url = $this->profile['base_url'] . $this->profile['endpoints'][$endpoint];

        // Build query parameters
        $apiKeyParam = $this->profile['api_key_param'] ?? 'apiKey';
        $queryParams = array_merge(
            $this->profile['default_params'] ?? [],
            $params['query_params'] ?? [],
            [$apiKeyParam => $this->profile['api_key']]
        );

        // Handle endpoint placeholders
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
    protected function isValidResponse($response): bool
    {
        if (!$response->successful()) {
            return false;
        }

        $data = $response->json();
        return !empty($data);
    }

    /**
     * Get the field mapping for this adapter
     *
     * @return array
     */
    public function getFieldMapping(): array
    {
        return $this->profile['field_mapping'];
    }

    /**
     * Get the image prefix if available
     *
     * @return string|null
     */
    public function getImagePrefix(): ?string
    {
        return $this->profile['image_prefix'] ?? null;
    }

    /**
     * Extract articles array from API response
     * Must be implemented by each concrete adapter
     *
     * @param array $data
     * @return array
     */
    abstract protected function extractArticles(array $data): array;

    /**
     * Get the adapter name
     *
     * @return string
     */
    abstract public function getName(): string;
}
