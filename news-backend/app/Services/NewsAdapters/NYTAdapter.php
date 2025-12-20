<?php

namespace App\Services\NewsAdapters;

class NYTAdapter extends AbstractNewsAdapter
{
    /**
     * Extract articles array from New York Times API response
     *
     * @param array $data
     * @return array
     */
    protected function extractArticles(array $data): array
    {
        return $data['results'] ?? $data['response']['docs'] ?? [];
    }

    /**
     * Get the adapter name
     *
     * @return string
     */
    public function getName(): string
    {
        return 'nyt';
    }
}
