<?php
namespace App\Providers;

use Laravel\Sanctum\Sanctum;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\PersonalAccessToken;

class SanctumServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);

        // إضافة middleware (ممكن يكون هنا)
        $this->app['router']->aliasMiddleware('auth:sanctum', \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class);
    }
}
