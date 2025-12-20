<?php

namespace App\Services\NewsAdapters;

class GuardianAdapter extends AbstractNewsAdapter
{
    /**
     * Extract articles array from Guardian API response
     *
     * @param array $data
     * @return array
     */
    protected function extractArticles(array $data): array
    {
        return $data['response']['results'] ?? [];
    }

    /**
     * Get the adapter name
     *
     * @return string
     */
    public function getName(): string
    {
        return 'guardian';
    }
}
