<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Student;
use App\Models\FinancialData;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function show($id)
    {
        // التحقق إذا كان الطالب مسجل في جدول المستخدمين
        $user = User::where('student_id', $id)->first();

        if (!$user) {
            return response()->json(['message' => 'الطالب غير مسجل في النظام'], 403);
        }

        $student = Student::findOrFail($id);

        // جلب البيانات المالية الخاصة بالطالب
        $financialData = FinancialData::where('student_id', $student->student_id)->first();

        $fixed_fee = $financialData?->total_amount ?? 0;

        $courses_fee = Registration::join('courses', 'registrations.course_id', '=', 'courses.course_id')
            ->where('registrations.student_id', $student->student_id)
            ->sum('courses.price');

        // الإجمالي المستحق هو المبلغ المتبقي للطالب
        $total_due = $financialData?->remaining_amount ?? 0;

        return response()->json([
            'id' => $student->student_id,
            'name' => $student->name,
            'email' => $student->email,
            'national_id' => $student->national_id,
            'phone_number' => $student->phone_number,
            'address' => $student->address,
            'department' => $student->department,
            'academic_year' => $student->academic_year,
            'admission_year' => $student->admission_year,
            'total_credits' => $student->total_credits,
            'current_gpa' => $student->current_gpa,
            'major_id' => $student->major_id,
            'advisor_id' => $student->advisor_id,
            'seat_number' => $student->seat_number,
            'financial_status' => $student->financial_status,
            'image_url' => $student->image ? asset('storage/' . $student->image) : asset('images/default.png'),
            'financial_data' => [
                'fixed_fee' => $fixed_fee,
                'courses_fee' => $courses_fee,
                'total_amount' => $fixed_fee + $courses_fee,
                'paid_amount' => $financialData?->paid_amount ?? 0,
                'total_due' => $total_due + $courses_fee, // If courses fee is added to total due
                'financial_status' => $student->financial_status, // البيانات المالية
            ],
        ]);
    }


}
