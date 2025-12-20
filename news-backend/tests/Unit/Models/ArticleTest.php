<?php

namespace Tests\Unit\Models;

use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\Source;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_belongs_to_source_category_and_author()
    {
        $article = Article::factory()->create();

        $this->assertInstanceOf(Source::class, $article->source);
        $this->assertInstanceOf(Category::class, $article->category);
        $this->assertInstanceOf(Author::class, $article->author);
    }

    /** @test */
    public function it_can_be_created_with_valid_data()
    {
        $source = Source::factory()->create();
        $category = Category::factory()->create();
        $author = Author::factory()->create();

        $url = 'https://example.com/article';

        $article = Article::create([
            'title' => 'Test Article',
            'description' => 'Test Description',
            'content' => 'Test Content',
            'url' => $url,
            'url_hash' => hash('sha256', $url),
            'image_url' => 'https://example.com/image.jpg',
            'published_at' => now(),
            'source_id' => $source->id,
            'category_id' => $category->id,
            'author_id' => $author->id,
        ]);

        $this->assertDatabaseHas('articles', [
            'title' => 'Test Article',
            'url' => 'https://example.com/article',
        ]);
    }
}
