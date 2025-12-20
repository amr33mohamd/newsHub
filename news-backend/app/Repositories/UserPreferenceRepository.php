<?php

namespace App\Repositories;

use App\Models\UserPreference;

class UserPreferenceRepository
{
    /**
     * The UserPreference model instance
     *
     * @var UserPreference
     */
    protected $userPreference;

    /**
     * UserPreferenceRepository constructor.
     *
     * @param UserPreference $userPreference
     */
    public function __construct(UserPreference $userPreference)
    {
        $this->userPreference = $userPreference;
    }

    /**
     * Get user preferences by user ID
     *
     * @param int $userId
     * @return UserPreference|null
     */
    public function getUserPreferences($userId)
    {
        return $this->userPreference->where('user_id', $userId)->first();
    }

    /**
     * Create or update user preferences
     *
     * @param int $userId
     * @param array $data
     * @return UserPreference
     */
    public function updatePreferences($userId, $data)
    {
        return $this->userPreference->updateOrCreate(
            ['user_id' => $userId],
            $data
        );
    }
}
