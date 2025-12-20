<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePreferenceRequest;
use App\Http\Resources\UserPreferenceResource;
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

        return new UserPreferenceResource($preferences);
    }

    /**
     * Update user preferences
     *
     * @param UpdatePreferenceRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdatePreferenceRequest $request)
    {
        $validated = $request->validated();

        $preferences = $this->preferenceRepository->updatePreferences(
            $request->user()->id,
            $validated
        );

        return new UserPreferenceResource($preferences);
    }
}
