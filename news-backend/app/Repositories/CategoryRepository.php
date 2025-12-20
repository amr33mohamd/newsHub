<?php

namespace App\Repositories;

use App\Models\Category;

class CategoryRepository
{
    /**
     * The Category model instance
     *
     * @var Category
     */
    protected $category;

    /**
     * CategoryRepository constructor.
     *
     * @param Category $category
     */
    public function __construct(Category $category)
    {
        $this->category = $category;
    }

    /**
     * Get all categories
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllCategories()
    {
        return $this->category->orderBy('name')->get();
    }

    /**
     * Get category by ID
     *
     * @param int $id
     * @return Category
     */
    public function getCategoryById($id)
    {
        return $this->category->findOrFail($id);
    }
}
