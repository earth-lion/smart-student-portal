<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    protected function redirectTo($request)
    {
        // في حالة لم يتم التحقق من الهوية، نرجع رسالة JSON بدل ما نوجه المستخدم لرابط
        if (!$request->expectsJson()) {
            abort(401, 'Unauthorized');
        }
    }
}
