<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 12);
        $filters = $request->only(['source_id', 'category_id', 'from_date', 'to_date']);

        // Try to authenticate via Sanctum token (optional authentication)
        $user = auth('sanctum')->user();

        // If user is authenticated, return personalized feed
        if ($user) {
            return response()->json(
                $this->articleService->getPersonalizedFeed($user->id, $perPage, $filters)
            );
        }

        // Otherwise return all articles
        return response()->json($this->articleService->getAllArticles($perPage, $filters));
    }

    /**
     * Get single article by ID
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        return response()->json($this->articleService->getArticleById($id));
    }

    /**
     * Search articles with optional filters
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $keyword = $request->get('keyword', '');
        $filters = $request->only(['source_id', 'category_id', 'from_date', 'to_date']);
        $perPage = $request->get('per_page', 12);

        return response()->json(
            $this->articleService->searchArticles($keyword, $filters, $perPage)
        );
    }

    /**
     * Get personalized article feed for authenticated user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function personalized(Request $request)
    {
        $perPage = $request->get('per_page', 12);
        return response()->json(
            $this->articleService->getPersonalizedFeed($request->user()->id, $perPage)
        );
    }
}
