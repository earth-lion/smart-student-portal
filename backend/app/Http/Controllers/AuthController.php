<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use Illuminate\Http\Request;
use App\Models\UniversityEmail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            // تحقق من صحة البيانات
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email',
                'password' => 'required|string|min:8',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // تأكد أن الإيميل موجود في جدول university_emails
            $isUniversityEmail = UniversityEmail::where('email', $request->email)->exists();

            if (!$isUniversityEmail) {
                return response()->json(['message' => 'الإيميل غير مسجل في الجامعة.'], 400);
            }

            // تأكد أن المستخدم غير مسجل مسبقًا
            $existingUser = User::where('email', $request->email)->first();
            if ($existingUser) {
                return response()->json([
                    'message' => 'تم تسجيلك مسبقًا.',
                    'redirect_url' => url('/api/students/' . $existingUser->student_id),
                    'user' => $existingUser,
                ], 200);
            }
            $student = Student::where('email', $request->email)->first();

            // إنشاء مستخدم جديد
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'student_id' => $student ? $student->student_id : null,
            ]);


            // لو وجدنا طالب نربطه بالمستخدم
            if ($student) {
                $user->student_id = $student->student_id;
                $user->save();
            }

            // إنشاء توكن
            $token = $user->createToken('StudentApp')->plainTextToken;

            return response()->json([
                'message' => 'تم التسجيل بنجاح.',
                'token' => $token,
                'user' => $user,
                'redirect_url' => $student ? url('/api/students/' . $student->student_id) : null,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Register Error: ' . $e->getMessage()); // لتتبع الخطأ في الـ log
            return response()->json(['message' => 'حدث خطأ أثناء التسجيل.'], 500);
        }
    }



    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'بيانات تسجيل الدخول غير صحيحة.'], 401);
        }

        // إنشاء التوكن
        $token = $user->createToken('StudentApp')->plainTextToken;

        $extraData = [];
        if ($user->role === 'student' && $user->student_id) {
            $student = \App\Models\Student::find($user->student_id);
            if ($student) {
                $extraData = [
                    'student_id'    => $user->student_id,
                    'department'    => $student->department,
                    'academic_year' => (int)$student->academic_year,
                    'total_credits' => (int)$student->total_credits,
                    'current_gpa'   => $student->current_gpa,
                ];
            }
        } elseif ($user->role === 'staff' && $user->staff_id) {
            $staff = \App\Models\Staff::find($user->staff_id);
            if ($staff) {
                $extraData = [
                    'staff_id'      => $user->staff_id,
                    'job_title'     => $staff->job_title,
                    'department'    => $staff->department,
                    'phone_number'  => $staff->phone_number,
                    'hire_date'     => $staff->hire_date,
                    'salary'        => $staff->salary,
                ];
            }
        }

        return response()->json([
            'message' => 'تم تسجيل الدخول بنجاح.',
            'token'   => $token,
            'user'    => array_merge([
                'name'       => $user->name,
                'email'      => $user->email,
                'role'       => $user->role ?? 'student',
            ], $extraData)
        ], 200);
    }

    public function logout(Request $request)
    {
        // Revoke the token that was used to authenticate the current request
        $request->user()?->currentAccessToken()?->delete();
        return response()->json(['message' => 'تم تسجيل الخروج بنجاح.']);
    }

}
