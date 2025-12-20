<?php

namespace App\Helpers;

use App\Models\Category;
use Illuminate\Support\Str;

class CategoryHelper
{
    /**
     * Get or create category by name
     *
     * @param string|null $categoryName
     * @return Category|null
     */
    public static function getOrCreate(?string $categoryName): ?Category
    {
        if (empty($categoryName)) {
            return null;
        }

        $slug = Str::slug($categoryName);

        return Category::firstOrCreate(
            ['slug' => $slug],
            ['name' => $categoryName]
        );
    }

    /**
     * Get category by ID
     *
     * @param int|null $categoryId
     * @return Category|null
     */
    public static function findById(?int $categoryId): ?Category
    {
        if (!$categoryId) {
            return null;
        }

        return Category::find($categoryId);
    }

    /**
     * Get category by slug
     *
     * @param string|null $slug
     * @return Category|null
     */
    public static function findBySlug(?string $slug): ?Category
    {
        if (empty($slug)) {
            return null;
        }

        return Category::where('slug', $slug)->first();
    }
}
