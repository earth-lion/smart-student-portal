<?php namespace App\Services;


use Illuminate\Support\Facades\Http;

class FawryService
{
    protected $merchantCode;
    protected $secretKey;

    public function __construct()
    {
        $this->merchantCode = env('FAWRY_MERCHANT_CODE'); // جلب رمز التاجر من .env
        $this->secretKey = env('FAWRY_SECRET_KEY'); // جلب المفتاح السري من .env
    }

    // دالة لحساب التوقيع
    public function generateSignature($referenceNumber)
    {
        $dataToSign = $this->merchantCode . '|' . $referenceNumber . '|' . $this->secretKey;
        return hash_hmac('sha256', $dataToSign, $this->secretKey);
    }

    // دالة بدء الدفع
    public function initiatePayment($user, $amount, $description, $itemId)
    {
        $referenceNumber = 'ORD-' . rand(1000000000, 9999999999); // رقم طلب عشوائي
        $signature = $this->generateSignature($referenceNumber);

        // إرسال الطلب إلى فوري
        $response = Http::asForm()->post('https://atfawry.fawrystaging.com/ECommerceWeb/Fawry/payments/init', [
            'merchantCode' => $this->merchantCode,
            'customerProfileId' => $user->id, // أو أي معرّف آخر للمستخدم
            'customerMobile' => $user->phone,
            'customerEmail' => $user->email,
            'paymentMethod' => 'PAYATFAWRY',
            'chargeItems' => json_encode([
                ['itemId' => $itemId, 'description' => $description, 'price' => $amount, 'quantity' => 1]
            ]),
            'referenceNumber' => $referenceNumber,
            'signature' => $signature,
        ]);

        return $response->json();
    }
}

