<?php

namespace Tests\Unit\Repositories;

use App\Models\Article;
use App\Models\User;
use App\Models\UserPreference;
use App\Repositories\ArticleRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected ArticleRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new ArticleRepository(new Article());
    }

    /** @test */
    public function it_can_get_all_articles_with_pagination()
    {
        Article::factory()->count(15)->create();

        $result = $this->repository->getAllArticles(10);

        $this->assertCount(10, $result);
        $this->assertEquals(15, $result->total());
    }

    /** @test */
    public function it_can_filter_articles_by_source()
    {
        $articles = Article::factory()->count(5)->create();
        $targetSource = $articles->first()->source_id;

        $result = $this->repository->getAllArticles(10, ['source_id' => $targetSource]);

        foreach ($result as $article) {
            $this->assertEquals($targetSource, $article->source_id);
        }
    }

    /** @test */
    public function it_can_search_articles_by_keyword()
    {
        Article::factory()->create(['title' => 'Laravel Framework News']);
        Article::factory()->create(['description' => 'Learning Laravel']);
        Article::factory()->create(['title' => 'React Updates']);

        $result = $this->repository->searchArticles('Laravel');

        $this->assertEquals(2, $result->total());
    }

    /** @test */
    public function it_can_get_personalized_feed()
    {
        $user = User::factory()->create();
        $articles = Article::factory()->count(5)->create();
        $preferredSourceId = $articles->first()->source_id;

        UserPreference::create([
            'user_id' => $user->id,
            'preferred_sources' => [$preferredSourceId],
            'preferred_categories' => [],
            'preferred_authors' => [],
        ]);

        $result = $this->repository->getPersonalizedFeed($user->id, 10);

        foreach ($result as $article) {
            $this->assertEquals($preferredSourceId, $article->source_id);
        }
    }
}
