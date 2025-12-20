<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ArticleFilterRequest;
use App\Http\Requests\SearchArticlesRequest;
use App\Http\Resources\ArticleResource;
use App\Services\ArticleService;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    /**
     * The ArticleService instance
     *
     * @var ArticleService
     */
    protected $articleService;

    /**
     * ArticleController constructor.
     *
     * @param ArticleService $articleService
     */
    public function __construct(ArticleService $articleService)
    {
        $this->articleService = $articleService;
    }

    /**
     * Get all articles with pagination
     * Returns personalized feed if user is authenticated, otherwise returns all articles
     *
     * @param ArticleFilterRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(ArticleFilterRequest $request)
    {
        $validated = $request->validated();
        $perPage = $validated['per_page'] ?? 12;
        $filters = array_intersect_key($validated, array_flip(['source_id', 'category_id', 'from_date', 'to_date']));

        // Try to authenticate via Sanctum token (optional authentication)
        $user = auth('sanctum')->user();

        // If user is authenticated, return personalized feed
        if ($user) {
            return ArticleResource::collection(
                $this->articleService->getPersonalizedFeed($user->id, $perPage, $filters)
            );
        }

        // Otherwise return all articles
        return ArticleResource::collection($this->articleService->getAllArticles($perPage, $filters));
    }

    /**
     * Get single article by ID
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        return new ArticleResource($this->articleService->getArticleById($id));
    }

    /**
     * Search articles with optional filters
     *
     * @param SearchArticlesRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(SearchArticlesRequest $request)
    {
        $validated = $request->validated();
        $keyword = $validated['keyword'] ?? '';
        $perPage = $validated['per_page'] ?? 12;
        $filters = array_intersect_key($validated, array_flip(['source_id', 'category_id', 'from_date', 'to_date']));

        return ArticleResource::collection(
            $this->articleService->searchArticles($keyword, $filters, $perPage)
        );
    }

    /**
     * Get personalized article feed for authenticated user
     *
     * @param ArticleFilterRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function personalized(ArticleFilterRequest $request)
    {
        $validated = $request->validated();
        $perPage = $validated['per_page'] ?? 12;
        $filters = array_intersect_key($validated, array_flip(['source_id', 'category_id', 'from_date', 'to_date']));

        return ArticleResource::collection(
            $this->articleService->getPersonalizedFeed($request->user()->id, $perPage, $filters)
        );
    }
}
