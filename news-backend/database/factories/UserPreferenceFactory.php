<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserPreference;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserPreferenceFactory extends Factory
{
    protected $model = UserPreference::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'preferred_sources' => [1, 2],
            'preferred_categories' => [1, 2, 3],
            'preferred_authors' => [1],
        ];
    }
}
