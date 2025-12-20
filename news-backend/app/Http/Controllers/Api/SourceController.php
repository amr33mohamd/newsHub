<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\SourceRepository;

class SourceController extends Controller
{
    /**
     * The SourceRepository instance
     *
     * @var SourceRepository
     */
    protected $sourceRepository;

    /**
     * SourceController constructor.
     *
     * @param SourceRepository $sourceRepository
     */
    public function __construct(SourceRepository $sourceRepository)
    {
        $this->sourceRepository = $sourceRepository;
    }

    /**
     * Get all active sources
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return response()->json($this->sourceRepository->getAllSources());
    }
}
