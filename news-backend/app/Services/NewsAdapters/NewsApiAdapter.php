<?php

namespace App\Services\NewsAdapters;

class NewsApiAdapter extends AbstractNewsAdapter
{
    /**
     * Extract articles array from NewsAPI response
     *
     * @param array $data
     * @return array
     */
    protected function extractArticles(array $data): array
    {
        return $data['articles'] ?? [];
    }

    /**
     * Get the adapter name
     *
     * @return string
     */
    public function getName(): string
    {
        return 'newsapi';
    }
}
