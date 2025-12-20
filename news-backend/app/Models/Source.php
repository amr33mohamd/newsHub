<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Source extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'api_identifier',
        'website_url',
        'description',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get all articles from this source.
     */
    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    /**
     * Get all authors associated with this source.
     */
    public function authors()
    {
        return $this->hasMany(Author::class);
    }
}
