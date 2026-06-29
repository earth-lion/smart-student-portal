<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NationalId;
use Illuminate\Support\Facades\Log;

class UniversityEmailController extends Controller
{
    public function getUniversityEmailByNationalId(Request $request)
    {
        // تحقق الفاليديشن أولاً - خارج try
        $request->validate([
            'name' => 'required|string',
            'national_id' => 'required|string|size:14',
        ]);

        try {
            $nationalId = NationalId::where('national_id', $request->national_id)->first();

            if (!$nationalId) {
                Log::error('رقم الهوية القومية غير موجود في قاعدة البيانات', [
                    'national_id' => $request->national_id
                ]);
                return response()->json(['message' => 'رقم الهوية القومية غير موجود في قاعدة البيانات'], 404);
            }

            if (!$nationalId->universityEmail) {
                Log::error('الإيميل الجامعي غير موجود', [
                    'national_id' => $request->national_id,
                    'name' => $request->name
                ]);
                return response()->json(['message' => 'لم يتم العثور على الإيميل الجامعي'], 404);
            }

            return response()->json([
                'token' => uniqid(),
                'name' => $nationalId->name,
                'email' => $nationalId->universityEmail->email,
                'password' => $nationalId->universityEmail->password,
            ], 200);

        } catch (\Exception $e) {
            Log::error('حدث خطأ غير متوقع', [
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'message' => 'حدث خطأ غير متوقع، يرجى المحاولة لاحقًا',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
