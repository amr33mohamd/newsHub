<?php

return [
    'newsapi' => [
        'name' => 'NewsAPI.org',
        'base_url' => 'https://newsapi.org/v2/',
        'api_key' => env('NEWSAPI_KEY'),
        'endpoints' => [
            'top_headlines' => 'top-headlines',
            'everything' => 'everything',
        ],
        'default_params' => [
            'language' => 'en',
            'pageSize' => 100,
        ],
        'field_mapping' => [
            'title' => 'title',
            'description' => 'description',
            'content' => 'content',
            'url' => 'url',
            'image_url' => 'urlToImage',
            'published_at' => 'publishedAt',
            'author' => 'author',
            'source_name' => 'source.name',
        ],
        'rate_limit' => [
            'requests_per_day' => 1000,
            'requests_per_hour' => 100,
        ],
    ],

    'guardian' => [
        'name' => 'The Guardian',
        'base_url' => 'https://content.guardianapis.com/',
        'api_key' => env('GUARDIAN_API_KEY'),
        'api_key_param' => 'api-key',
        'endpoints' => [
            'search' => 'search',
        ],
        'default_params' => [
            'show-fields' => 'thumbnail,trailText,body',
            'page-size' => 50,
        ],
        'field_mapping' => [
            'title' => 'webTitle',
            'description' => 'fields.trailText',
            'content' => 'fields.body',
            'url' => 'webUrl',
            'image_url' => 'fields.thumbnail',
            'published_at' => 'webPublicationDate',
            'author' => null,
            'source_name' => 'sectionName',
        ],
        'rate_limit' => [
            'requests_per_day' => 5000,
            'requests_per_second' => 5,
        ],
    ],

    'nyt' => [
        'name' => 'New York Times',
        'base_url' => 'https://api.nytimes.com/svc/',
        'api_key' => env('NYT_API_KEY'),
        'endpoints' => [
            'top_stories' => 'topstories/v2/{section}.json',
            'article_search' => 'search/v2/articlesearch.json',
            'most_popular' => 'mostpopular/v2/viewed/{period}.json',
        ],
        'default_params' => [],
        'field_mapping' => [
            'title' => 'title',
            'description' => 'abstract',
            'content' => 'abstract',
            'url' => 'url',
            'image_url' => 'multimedia.0.url',
            'published_at' => 'published_date',
            'author' => 'byline',
            'source_name' => 'section',
        ],
        'image_prefix' => 'https://www.nytimes.com/',
        'rate_limit' => [
            'requests_per_day' => 4000,
            'requests_per_minute' => 10,
        ],
    ],
];
