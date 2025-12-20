<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\UserPreferenceRepository;
use Illuminate\Http\Request;

class PreferenceController extends Controller
{
    /**
     * The UserPreferenceRepository instance
     *
     * @var UserPreferenceRepository
     */
    protected $preferenceRepository;

    /**
     * PreferenceController constructor.
     *
     * @param UserPreferenceRepository $preferenceRepository
     */
    public function __construct(UserPreferenceRepository $preferenceRepository)
    {
        $this->preferenceRepository = $preferenceRepository;
    }

    /**
     * Get user preferences
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request)
    {
        $preferences = $this->preferenceRepository->getUserPreferences($request->user()->id);

        if (!$preferences) {
            return response()->json([
                'user_id' => $request->user()->id,
                'preferred_sources' => [],
                'preferred_categories' => [],
                'preferred_authors' => [],
            ]);
        }

        return response()->json($preferences);
    }

    /**
     * Update user preferences
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        $request->validate([
            'preferred_sources' => 'nullable|array',
            'preferred_sources.*' => 'exists:sources,id',
            'preferred_categories' => 'nullable|array',
            'preferred_categories.*' => 'exists:categories,id',
            'preferred_authors' => 'nullable|array',
            'preferred_authors.*' => 'exists:authors,id',
        ]);

        $preferences = $this->preferenceRepository->updatePreferences(
            $request->user()->id,
            $request->only(['preferred_sources', 'preferred_categories', 'preferred_authors'])
        );

        return response()->json($preferences);
    }
}
