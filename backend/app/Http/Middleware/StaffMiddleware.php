<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class StaffMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Staff routes can be accessed by both staff members and admins
        if (!$request->user() || !in_array($request->user()->role, ['staff', 'admin'])) {
            return response()->json(['message' => 'غير مصرح لك بالوصول كموظف أو أستاذ.'], 403);
        }

        return $next($request);
    }
}
