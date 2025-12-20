<?php

namespace App\Helpers;

use App\Models\Author;

class AuthorHelper
{
    /**
     * Get or create author by name and source
     *
     * @param string|null $authorName
     * @param int $sourceId
     * @return Author|null
     */
    public static function getOrCreate(?string $authorName, int $sourceId): ?Author
    {
        if (empty($authorName)) {
            return null;
        }

        return Author::firstOrCreate(
            [
                'name' => $authorName,
                'source_id' => $sourceId
            ]
        );
    }

    /**
     * Get author by ID
     *
     * @param int|null $authorId
     * @return Author|null
     */
    public static function findById(?int $authorId): ?Author
    {
        if (!$authorId) {
            return null;
        }

        return Author::find($authorId);
    }

    /**
     * Get authors by source
     *
     * @param int $sourceId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getBySource(int $sourceId)
    {
        return Author::where('source_id', $sourceId)->get();
    }
}
