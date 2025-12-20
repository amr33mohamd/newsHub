<?php

namespace App\Repositories;

use App\Models\Article;
use App\Models\UserPreference;

class ArticleRepository
{
    /**
     * The Article model instance
     *
     * @var Article
     */
    protected $article;

    /**
     * ArticleRepository constructor.
     *
     * @param Article $article
     */
    public function __construct(Article $article)
    {
        $this->article = $article;
    }

    /**
     * Get all articles with pagination
     *
     * @param int $perPage
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAllArticles($perPage = 12, $filters = [])
    {
        $query = $this->article
            ->select(['id', 'source_id', 'category_id', 'author_id', 'title', 'description', 'url', 'image_url', 'published_at', 'created_at', 'updated_at'])
            ->with(['source', 'category', 'author']);

        // Apply source filter
        if (!empty($filters['source_id'])) {
            $query->where('source_id', $filters['source_id']);
        }

        // Apply category filter
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        // Apply date range filter
        if (!empty($filters['from_date'])) {
            $query->where('published_at', '>=', $filters['from_date']);
        }

        if (!empty($filters['to_date'])) {
            $query->where('published_at', '<=', $filters['to_date']);
        }

        return $query->orderBy('published_at', 'desc')->paginate($perPage);
    }

    /**
     * Get single article by ID
     *
     * @param int $id
     * @return Article
     */
    public function getArticleById($id)
    {
        return $this->article
            ->with(['source', 'category', 'author'])
            ->findOrFail($id);
    }

    /**
     * Search articles by keyword with filters
     *
     * @param string $keyword
     * @param array $filters
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function searchArticles($keyword, $filters = [], $perPage = 12)
    {
        $query = $this->article
            ->select(['id', 'source_id', 'category_id', 'author_id', 'title', 'description', 'url', 'image_url', 'published_at', 'created_at', 'updated_at'])
            ->with(['source', 'category', 'author'])
            ->where(function($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%")
                  ->orWhere('content', 'like', "%{$keyword}%");
            });

        // Apply source filter
        if (!empty($filters['source_id'])) {
            $query->where('source_id', $filters['source_id']);
        }

        // Apply category filter
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        // Apply date range filter
        if (!empty($filters['from_date'])) {
            $query->where('published_at', '>=', $filters['from_date']);
        }

        if (!empty($filters['to_date'])) {
            $query->where('published_at', '<=', $filters['to_date']);
        }

        return $query->orderBy('published_at', 'desc')->paginate($perPage);
    }

    /**
     * Get personalized articles based on user preferences
     *
     * @param int $userId
     * @param int $perPage
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPersonalizedFeed($userId, $perPage = 12, $filters = [])
    {
        $preferences = UserPreference::where('user_id', $userId)->first();

        if (!$preferences) {
            return $this->getAllArticles($perPage, $filters);
        }

        $query = $this->article
            ->select(['id', 'source_id', 'category_id', 'author_id', 'title', 'description', 'url', 'image_url', 'published_at', 'created_at', 'updated_at'])
            ->with(['source', 'category', 'author']);

        // Filter by user preferences - wrap in closure for proper OR logic
        $query->where(function($q) use ($preferences) {
            $firstCondition = true;

            if (!empty($preferences->preferred_sources)) {
                $q->whereIn('source_id', $preferences->preferred_sources);
                $firstCondition = false;
            }

            if (!empty($preferences->preferred_categories)) {
                if ($firstCondition) {
                    $q->whereIn('category_id', $preferences->preferred_categories);
                    $firstCondition = false;
                } else {
                    $q->orWhereIn('category_id', $preferences->preferred_categories);
                }
            }

            if (!empty($preferences->preferred_authors)) {
                if ($firstCondition) {
                    $q->whereIn('author_id', $preferences->preferred_authors);
                } else {
                    $q->orWhereIn('author_id', $preferences->preferred_authors);
                }
            }
        });

        // Apply additional filters
        if (!empty($filters['source_id'])) {
            $query->where('source_id', $filters['source_id']);
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['from_date'])) {
            $query->where('published_at', '>=', $filters['from_date']);
        }

        if (!empty($filters['to_date'])) {
            $query->where('published_at', '<=', $filters['to_date']);
        }

        return $query->orderBy('published_at', 'desc')->paginate($perPage);
    }
}
