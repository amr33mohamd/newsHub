# Laravel Product Scraper

## Overview

This Laravel project is a **Product Scraper Application** designed to scrape product data from e-commerce websites and store them in the database. It supports:

- Scheduled scraping tasks.
- Proxy and user-agent rotation.
- Configurable scraper profiles for multiple websites.
- Clean architecture using **Repository-Service Pattern** for scalability and maintainability.

---

## Features

- **Scrape product data dynamically using custom profiles.**
- **Proxy & User Agent rotation to avoid detection.**
- **Supports adding new websites easily via ****`config/scrapers.php`****.**
- **Scheduled scraping using Laravel Scheduler.**
- Clean separation using Repository-Service Pattern.

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd tasks-backend
```

### 2. Install Dependencies

```bash
composer install
```

### 3. Environment Setup

Copy `.env`:

```bash
cp .env.example .env
```

Set up your database and other configurations in `.env`.

Generate application key:

```bash
php artisan key:generate
```

### 4. Database Setup

Run migrations:

```bash
php artisan migrate
```

### 5. Set Up Cache Table for Scheduler Locks

```bash
php artisan cache:table
php artisan migrate
```

---

## Running The Scraper

### Manually Run Scraper Command:

```bash
php artisan scrape:products https://webscraper.io/test-sites/e-commerce/allinone/computers webscraper
```

### Scheduler (Automatic Scraping):

Ensure **crontab** is set to run Laravel scheduler:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

Scheduled scraper is defined in `app/Console/Kernel.php` to run hourly:

```php
$schedule->command('scrape:products https://webscraper.io/test-sites/e-commerce/allinone/computers webscraper')
         ->hourly()
         ->appendOutputTo(storage_path('logs/scraper.log'));
```

Check scheduled commands:

```bash
php artisan schedule:list
```

---

## How The Scraper Works

1. **Start Scraping:**

   - The `ScrapeProducts` Artisan command accepts a target URL and a profile name.
   - It invokes the `ScraperService` and passes the URL and scraper profile.

2. **Scraper Profile Loading:**

   - The service loads the profile config from `config/scrapers.php` based on the provided profile name.
   - Profile contains selectors, product container structure, and any URL prefixes.

3. **Proxy & User-Agent Handling:**

   - A random user-agent is selected from a predefined list.
   - It fetches a proxy (optional) from a proxy service to avoid detection.

4. **HTTP Request:**

   - Makes an HTTP GET request to the target URL with proper headers and proxy.

5. **Response Validation:**

   - Checks if response is successful, not blocked (CAPTCHA, Access Denied), and contains valid product markers.

6. **DOM Parsing:**

   - Uses Symfony DomCrawler to parse the HTML response.
   - Identifies product containers and extracts required fields (title, price, image, rating, reviews, etc.) based on the profile config.

7. **Database Update:**

   - Updates or creates product records in the database using Eloquent.

8. **Logging & Error Handling:**

   - Logs each step, including proxy usage, failed requests, and products scraped.

9. **Proxy Failure Reporting:**

   - Reports non-working proxies back to proxy service for tracking.

10. **Scheduler Integration:**

    - Scheduled to run periodically (e.g., hourly) via Laravel Scheduler.

---

## Adding New Scrapers (Very Easy!)

New websites can be scraped by simply adding a configuration in `config/scrapers.php`:

```php
return [
    'webscraper' => [
        'product_container' => 'div.card.thumbnail',
        'fields' => [
            'title' => 'a.title',
            'price' => 'h4.price',
            'description' => 'p.description',
            'image' => ['selector' => 'img.image', 'attr' => 'src', 'prefix' => 'https://webscraper.io'],
            'rating' => ['selector' => 'div.ratings p[data-rating]', 'attr' => 'data-rating'],
            'reviews' => 'p.review-count',
        ],
        'valid_marker' => 'card thumbnail',
    ],

    // Add more websites easily like this...
];
```

Run the scraper by providing the new profile name:

```bash
php artisan scrape:products <new-website-url> <profile-name>
```

---

## Why Repository-Service Pattern?

| Reason                                        | Benefit                                                    |
| --------------------------------------------- | ---------------------------------------------------------- |
| **Separation of concerns**                    | Keeps business logic separate from database & controllers. |
| **Easy testing & mocking**                    | Swap repositories easily during testing.                   |
| **Scalable and clean architecture**           | Easier to add more logic (filters, transformations) later. |
| **Decouples Eloquent directly from services** | More flexibility if changing data source (API, DB, etc.).  |

---

## Why Use Webscraper.io Instead of Amazon?

- **Amazon Scraping:** Requires premium proxies, to prevent block 
- **Solution:** Used **webscraper.io's demo site** because:
  - No premium proxies needed.
  - Ideal for testing scraping logic freely without being blocked.
  - Safe & legal testing environment.

Once everything is stable, you can swap config to support production-level scrapers (Amazon, Walmart, etc.).

---

## Technologies Used

- **Laravel 11.x**
- **Symfony DomCrawler**
- **HTTP Client + Proxy Support**
- **Repository-Service Pattern**
- **Laravel Scheduler**

---

## API Endpoint (Products):

```http
GET /api/products
```

Lists all scraped products.

---

## Contributing

Feel free to contribute! Fork, improve & open a PR.

---

## License

MIT

