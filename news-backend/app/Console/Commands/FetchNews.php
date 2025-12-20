<?php

namespace App\Console\Commands;

use App\Services\NewsService;
use Illuminate\Console\Command;

class FetchNews extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'news:fetch {source?} {--category=} {--query=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch news articles from configured sources';

    /**
     * The NewsService instance
     *
     * @var NewsService
     */
    protected $newsService;

    /**
     * Create a new command instance.
     *
     * @param NewsService $newsService
     * @return void
     */
    public function __construct(NewsService $newsService)
    {
        parent::__construct();
        $this->newsService = $newsService;
    }

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        $source = $this->argument('source');

        // Fetch from all sources if not specified
        if (!$source) {
            $sources = array_keys(config('news_sources'));

            foreach ($sources as $src) {
                $this->info("Fetching from $src...");
                $this->fetchFromSource($src);
            }

            return;
        }

        // Fetch from specific source
        $this->info("Fetching articles from {$source}");
        $this->fetchFromSource($source);
    }

    /**
     * Fetch articles from a specific source
     *
     * @param string $source
     * @return void
     */
    protected function fetchFromSource($source)
    {
        $params = [
            'query_params' => array_filter([
                'category' => $this->option('category'),
                'q' => $this->option('query'),
            ]),
        ];

        $success = $this->newsService->fetchArticles($source, $params);

        if ($success) {
            $this->info("Successfully fetched articles from {$source}");
        } else {
            $this->error("Failed to fetch articles from {$source}");
        }
    }
}
