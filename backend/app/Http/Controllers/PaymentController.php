<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FawryService;

class PaymentController extends Controller
{
    public function pay(Request $request, FawryService $fawry)
    {
        $user = $request->user();
        $amount = 150.00;
        $itemId = 'COURSE_FEES';
        $description = 'دفع رسوم كورس';

        $response = $fawry->initiatePayment($user, $amount, $description, $itemId);

        return response()->json($response);
    }
}
