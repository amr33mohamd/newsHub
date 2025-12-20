<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\Source;
use Illuminate\Database\Eloquent\Factories\Factory;

class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        $url = $this->faker->unique()->url();

        return [
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'content' => $this->faker->paragraphs(3, true),
            'url' => $url,
            'url_hash' => hash('sha256', $url),
            'image_url' => $this->faker->imageUrl(),
            'published_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'source_id' => Source::factory(),
            'category_id' => Category::factory(),
            'author_id' => Author::factory(),
        ];
    }
}
