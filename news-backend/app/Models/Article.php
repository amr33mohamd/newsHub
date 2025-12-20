<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Article extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'source_id',
        'category_id',
        'author_id',
        'title',
        'description',
        'content',
        'url',
        'url_hash',
        'image_url',
        'published_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'published_at' => 'datetime',
    ];

    /**
     * Get the source that published this article.
     */
    public function source()
    {
        return $this->belongsTo(Source::class);
    }

    /**
     * Get the category of this article.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the author of this article.
     */
    public function author()
    {
        return $this->belongsTo(Author::class);
    }
}
