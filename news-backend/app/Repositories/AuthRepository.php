<?php

namespace App\Repositories;

use App\Models\User;

class AuthRepository
{
    /**
     * The User model instance
     *
     * @var User
     */
    protected $user;

    /**
     * AuthRepository constructor.
     *
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Find user by email
     *
     * @param string $email
     * @return User|null
     */
    public function findByEmail($email)
    {
        return $this->user->where('email', $email)->first();
    }

    /**
     * Create a new user
     *
     * @param array $data
     * @return User
     */
    public function createUser(array $data)
    {
        return $this->user->create($data);
    }

    /**
     * Get user by ID
     *
     * @param int $id
     * @return User
     */
    public function getUserById($id)
    {
        return $this->user->findOrFail($id);
    }
}
