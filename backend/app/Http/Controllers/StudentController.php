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

        // جلب الرسوم الثابتة بناءً على الفرقة والقسم والفصل
        $financialData = FinancialData::where('academic_year', $student->academic_year)
            ->where('semester', $student->semester)
            ->where('department', $student->department)
            ->first();

        $fixed_fee = $financialData?->fixed_fee ?? 0;

        $courses_fee = Registration::join('courses', 'registrations.course_id', '=', 'courses.course_id')
            ->where('registrations.student_id', $student->student_id)
            ->sum('courses.price');

        $total_due = $fixed_fee + $courses_fee;

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
            // البيانات المالية مفصولة:
            'financial_data' => [
                'fixed_fee' => $fixed_fee,
                'courses_fee' => $courses_fee,
                'total_due' => $total_due,
                'financial_status' => $student->financial_status, // البيانات المالية
            ],
        ]);
    }


}
