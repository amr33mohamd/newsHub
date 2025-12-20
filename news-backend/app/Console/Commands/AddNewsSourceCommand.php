<?php

namespace App\Console\Commands;

use App\Models\Source;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class AddNewsSourceCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'news:add-source {name? : The API identifier for the news source}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add a new news source adapter, configuration, and database entry';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Adding a new news source...');
        $this->newLine();

        // Get basic information
        $apiIdentifier = $this->argument('name') ?? $this->ask('API identifier (e.g., newsapi, guardian)');
        $apiIdentifier = Str::slug($apiIdentifier);

        // Check if source already exists
        if (Source::where('api_identifier', $apiIdentifier)->exists()) {
            $this->error("News source '{$apiIdentifier}' already exists in database!");
            return Command::FAILURE;
        }

        // Gather configuration
        $name = $this->ask('Display name (e.g., NewsAPI, The Guardian)');
        $baseUrl = $this->ask('Base URL (e.g., https://newsapi.org/v2/)');
        $apiKey = $this->ask('API Key');
        $websiteUrl = $this->ask('Website URL (optional)', null);
        $description = $this->ask('Description (optional)', null);

        // Get endpoints
        $this->info('Configure endpoints (press enter with empty name to finish):');
        $endpoints = [];
        while (true) {
            $endpointName = $this->ask('Endpoint name (e.g., top-headlines, everything)');
            if (empty($endpointName)) {
                break;
            }
            $endpointPath = $this->ask('Endpoint path (e.g., /top-headlines)');
            $endpoints[$endpointName] = $endpointPath;
        }

        if (empty($endpoints)) {
            $this->error('At least one endpoint is required!');
            return Command::FAILURE;
        }

        // Get field mapping
        $this->info('Configure field mapping:');
        $fieldMapping = [
            'title' => $this->ask('Title field path', 'title'),
            'description' => $this->ask('Description field path', 'description'),
            'content' => $this->ask('Content field path', 'content'),
            'url' => $this->ask('URL field path', 'url'),
            'image_url' => $this->ask('Image URL field path', 'urlToImage'),
            'published_at' => $this->ask('Published date field path', 'publishedAt'),
            'author' => $this->ask('Author field path (optional)', 'author'),
            'source_name' => $this->ask('Source/Category field path (optional)', null),
        ];

        // Get response structure path
        $responsePath = $this->ask('Response array path (e.g., articles, response.results)', 'articles');

        // API key parameter name
        $apiKeyParam = $this->ask('API key parameter name', 'apiKey');

        // Image prefix (optional)
        $imagePrefix = $this->ask('Image URL prefix (optional, leave empty if not needed)', null);

        // Create adapter class
        if (!$this->createAdapterClass($apiIdentifier, $responsePath)) {
            return Command::FAILURE;
        }

        // Add to config file
        if (!$this->addToConfig($apiIdentifier, [
            'name' => $name,
            'base_url' => $baseUrl,
            'api_key' => $apiKey,
            'api_key_param' => $apiKeyParam,
            'endpoints' => $endpoints,
            'field_mapping' => $fieldMapping,
            'image_prefix' => $imagePrefix,
        ])) {
            return Command::FAILURE;
        }

        // Add to database
        $source = Source::create([
            'name' => $name,
            'api_identifier' => $apiIdentifier,
            'website_url' => $websiteUrl,
            'description' => $description,
            'is_active' => true,
        ]);

        // Update NewsService
        $this->updateNewsService($apiIdentifier);

        $this->newLine();
        $this->info('News source added successfully!');
        $this->newLine();
        $this->table(
            ['Property', 'Value'],
            [
                ['API Identifier', $apiIdentifier],
                ['Display Name', $name],
                ['Database ID', $source->id],
                ['Adapter Class', "App\\Services\\NewsAdapters\\" . Str::studly($apiIdentifier) . 'Adapter'],
                ['Config Key', "news_sources.{$apiIdentifier}"],
            ]
        );

        $this->newLine();
        $this->info('Next steps:');
        $this->line("  1. Test the adapter: php artisan news:fetch {$apiIdentifier}");
        $this->line('  2. Review the generated adapter class if you need custom logic');
        $this->line('  3. Update field mappings in config/news_sources.php if needed');

        return Command::SUCCESS;
    }

    /**
     * Create adapter class file
     */
    protected function createAdapterClass(string $apiIdentifier, string $responsePath): bool
    {
        $className = Str::studly($apiIdentifier) . 'Adapter';
        $path = app_path("Services/NewsAdapters/{$className}.php");

        if (File::exists($path)) {
            if (!$this->confirm("Adapter class already exists. Overwrite?", false)) {
                return true;
            }
        }

        // Parse response path to generate extraction logic
        $extractionCode = $this->generateExtractionCode($responsePath);

        $stub = <<<PHP
<?php

namespace App\Services\NewsAdapters;

class {$className} extends AbstractNewsAdapter
{
    /**
     * Extract articles array from API response
     *
     * @param array \$data
     * @return array
     */
    protected function extractArticles(array \$data): array
    {
        return {$extractionCode};
    }

    /**
     * Get the adapter name
     *
     * @return string
     */
    public function getName(): string
    {
        return '{$apiIdentifier}';
    }
}

PHP;

        File::put($path, $stub);
        $this->info("Created adapter class: {$className}");

        return true;
    }

    /**
     * Generate extraction code from response path
     */
    protected function generateExtractionCode(string $path): string
    {
        $parts = explode('.', $path);
        $code = '$data';

        foreach ($parts as $part) {
            $code .= "['{$part}']";
        }

        return $code . ' ?? []';
    }

    /**
     * Add configuration to news_sources.php
     */
    protected function addToConfig(string $apiIdentifier, array $config): bool
    {
        $configPath = config_path('news_sources.php');

        if (!File::exists($configPath)) {
            $this->error('Config file not found: config/news_sources.php');
            return false;
        }

        $configContent = File::get($configPath);

        // Build config array string
        $configArray = $this->arrayToString($config, 1);
        $newSource = "\n    '{$apiIdentifier}' => {$configArray},\n];";

        // Replace the closing bracket
        $configContent = preg_replace('/\];[\s]*$/', $newSource, $configContent);

        File::put($configPath, $configContent);
        $this->info("Added configuration to news_sources.php");

        return true;
    }

    /**
     * Convert array to formatted string for config file
     */
    protected function arrayToString(array $array, int $indent = 0): string
    {
        $spaces = str_repeat('    ', $indent);
        $lines = ["["];

        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $lines[] = $spaces . "    '{$key}' => " . $this->arrayToString($value, $indent + 1) . ",";
            } elseif (is_null($value)) {
                $lines[] = $spaces . "    '{$key}' => null,";
            } elseif (is_bool($value)) {
                $boolStr = $value ? 'true' : 'false';
                $lines[] = $spaces . "    '{$key}' => {$boolStr},";
            } else {
                $escapedValue = addslashes($value);
                $lines[] = $spaces . "    '{$key}' => '{$escapedValue}',";
            }
        }

        $lines[] = $spaces . "]";

        return implode("\n", $lines);
    }

    /**
     * Update NewsService to include new adapter
     */
    protected function updateNewsService(string $apiIdentifier): void
    {
        $servicePath = app_path('Services/NewsService.php');
        $content = File::get($servicePath);

        $className = Str::studly($apiIdentifier) . 'Adapter';
        $useStatement = "use App\\Services\\NewsAdapters\\{$className};";

        // Add use statement if not exists
        if (!str_contains($content, $useStatement)) {
            $content = preg_replace(
                '/(use App\\\\Services\\\\NewsAdapters\\\\NYTAdapter;)/',
                "$1\nuse App\\Services\\NewsAdapters\\{$className};",
                $content
            );
        }

        // Add to match statement
        $newCase = "            '{$apiIdentifier}' => new {$className}(\$profile),";

        if (!str_contains($content, $newCase)) {
            $content = preg_replace(
                "/(            'nyt' => new NYTAdapter\\(\\$profile\\),)/",
                "$1\n{$newCase}",
                $content
            );
        }

        File::put($servicePath, $content);
        $this->info("Updated NewsService with new adapter");
    }
}
