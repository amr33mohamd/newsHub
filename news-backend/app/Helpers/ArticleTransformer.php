<?php

namespace App\Helpers;

use Illuminate\Support\Arr;

class ArticleTransformer
{
    /**
     * Transform article data using field mapping
     *
     * @param array $articleData
     * @param array $fieldMapping
     * @param string|null $imagePrefix
     * @return array
     */
    public static function transform(array $articleData, array $fieldMapping, ?string $imagePrefix = null): array
    {
        $transformed = [];

        // Map each field using dot notation for nested data
        foreach ($fieldMapping as $ourField => $theirField) {
            if ($theirField === null) {
                $transformed[$ourField] = null;
                continue;
            }

            $value = Arr::get($articleData, $theirField);

            // Handle image prefix for relative image URLs
            if ($ourField === 'image_url' && $imagePrefix && $value) {
                $value = $imagePrefix . $value;
            }

            $transformed[$ourField] = $value;
        }

        // Extract category/section name if available
        if (!empty($fieldMapping['source_name'])) {
            $transformed['category_name'] = Arr::get($articleData, $fieldMapping['source_name']);
        }

        // Extract and clean author name if available
        if (!empty($fieldMapping['author'])) {
            $authorValue = Arr::get($articleData, $fieldMapping['author']);
            $transformed['author_name'] = self::cleanAuthorName($authorValue);
        }

        return $transformed;
    }

    /**
     * Clean author name from various formats
     *
     * @param string|null $author
     * @return string|null
     */
    public static function cleanAuthorName(?string $author): ?string
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

    /**
     * Validate that required fields are present
     *
     * @param array $transformed
     * @return bool
     */
    public static function isValid(array $transformed): bool
    {
        return !empty($transformed['title']) && !empty($transformed['url']);
    }

    /**
     * Generate URL hash for uniqueness
     *
     * @param string $url
     * @return string
     */
    public static function generateUrlHash(string $url): string
    {
        return hash('sha256', $url);
    }
}
