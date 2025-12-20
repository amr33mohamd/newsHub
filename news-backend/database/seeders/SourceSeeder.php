<?php

namespace Database\Seeders;

use App\Models\Source;
use Illuminate\Database\Seeder;

class SourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sources = [
            [
                'name' => 'NewsAPI.org',
                'api_identifier' => 'newsapi',
                'website_url' => 'https://newsapi.org',
                'description' => '70,000+ news sources from around the world',
                'is_active' => true,
            ],
            [
                'name' => 'The Guardian',
                'api_identifier' => 'guardian',
                'website_url' => 'https://www.theguardian.com',
                'description' => 'British daily newspaper with comprehensive news coverage',
                'is_active' => true,
            ],
            [
                'name' => 'New York Times',
                'api_identifier' => 'nyt',
                'website_url' => 'https://www.nytimes.com',
                'description' => 'American newspaper with global news coverage',
                'is_active' => true,
            ],
        ];

        foreach ($sources as $source) {
            Source::create($source);
        }
    }
}
