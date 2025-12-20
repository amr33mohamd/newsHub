<?php

namespace Tests\Unit\Models;

use App\Models\User;
use App\Models\UserPreference;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_hashes_password_on_creation()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $this->assertTrue(Hash::check('password123', $user->password));
    }

    /** @test */
    public function it_has_one_preference()
    {
        $user = User::factory()->create();
        $preference = UserPreference::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(UserPreference::class, $user->preferences);
        $this->assertEquals($preference->id, $user->preferences->id);
    }
}
