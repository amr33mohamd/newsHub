<?php

namespace Tests\Unit\Services;

use App\Models\Article;
use App\Repositories\ArticleRepository;
use App\Services\ArticleService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleServiceTest extends TestCase
{
    use RefreshDatabase;

    protected ArticleService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $repository = new ArticleRepository(new Article());
        $this->service = new ArticleService($repository);
    }

    /** @test */
    public function it_can_get_all_articles()
    {
        Article::factory()->count(5)->create();

        $result = $this->service->getAllArticles(10);

        $this->assertCount(5, $result);
    }

    /** @test */
    public function it_can_search_articles()
    {
        Article::factory()->create(['title' => 'Laravel Framework']);
        Article::factory()->create(['title' => 'React Library']);

        $result = $this->service->searchArticles('Laravel');

        $this->assertCount(1, $result);
    }
}
