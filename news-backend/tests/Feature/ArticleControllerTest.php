<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ArticleControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_all_articles()
    {
        Article::factory()->count(5)->create();

        $response = $this->getJson('/api/articles');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'title', 'description', 'url']
                ],
            ]);

        $this->assertCount(5, $response->json('data'));
    }

    /** @test */
    public function it_can_get_single_article()
    {
        $article = Article::factory()->create();

        $response = $this->getJson("/api/articles/{$article->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $article->id,
                'title' => $article->title,
            ]);
    }

    /** @test */
    public function it_can_search_articles()
    {
        Article::factory()->create(['title' => 'Laravel Tutorial']);
        Article::factory()->create(['title' => 'React Guide']);

        $response = $this->getJson('/api/articles/search?keyword=Laravel');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    /** @test */
    public function authenticated_user_can_get_personalized_feed()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Article::factory()->count(5)->create();

        $response = $this->getJson('/api/articles/personalized');

        $response->assertStatus(200);
    }
}
