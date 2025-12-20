<?php

namespace App\Services;

use App\Repositories\ArticleRepository;

class ArticleService
{
    /**
     * @var ArticleRepository
     */
    protected $articleRepository;

    /**
     * ArticleService constructor.
     *
     * @param ArticleRepository $articleRepository
     */
    public function __construct(ArticleRepository $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    /**
     * Get all articles with pagination and optional filters
     *
     * @param int $perPage
     * @param array $filters
     * @return mixed
     */
    public function getAllArticles($perPage = 12, $filters = [])
    {
        return $this->articleRepository->getAllArticles($perPage, $filters);
    }

    /**
     * Get single article by ID
     *
     * @param int $id
     * @return mixed
     */
    public function getArticleById($id)
    {
        return $this->articleRepository->getArticleById($id);
    }

    /**
     * Search articles by keyword with optional filters
     *
     * @param string $keyword
     * @param array $filters
     * @param int $perPage
     * @return mixed
     */
    public function searchArticles($keyword, $filters = [], $perPage = 12)
    {
        return $this->articleRepository->searchArticles($keyword, $filters, $perPage);
    }

    /**
     * Get personalized feed for user based on preferences with optional filters
     *
     * @param int $userId
     * @param int $perPage
     * @param array $filters
     * @return mixed
     */
    public function getPersonalizedFeed($userId, $perPage = 12, $filters = [])
    {
        return $this->articleRepository->getPersonalizedFeed($userId, $perPage, $filters);
    }
}
