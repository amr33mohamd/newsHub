<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Author extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'source_id',
    ];

    /**
     * Get all articles written by this author.
     */
    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    /**
     * Get the source that this author belongs to.
     */
    public function source()
    {
        return $this->belongsTo(Source::class);
    }
}
