<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Registration;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class RegistrationController extends Controller
{

    public function showStudentCourses($student_id)
{
    $student = Student::with('registrations.course')->findOrFail($student_id);

    $registered = $student->registrations->map(function ($registration) {
        $course = $registration->course;
        return [
            'course_id' => $course->course_id,
            'name' => $course->name,
            'total_credits' => $course->total_credits,
            'type' => $course->type,
            'instructor_name' => $course->instructor_name,
            'price' => $course->price,
        ];
    });

    $total_registered_hours = $registered->sum('total_credits');

    return response()->json([
        'registered_courses' => $registered,
        'total_registered_hours' => $total_registered_hours
    ]);
}    public function destroy(Request $request)
{
    $request->validate([
        'student_id' => 'required|exists:students,student_id',
        'course_id' => 'required|exists:courses,course_id',
    ]);

    $registration = Registration::where('student_id', $request->student_id)
        ->where('course_id', $request->course_id)
        ->first();

    if (!$registration) {
        return response()->json(['message' => 'التسجيل غير موجود.'], 404);
    }

    $registration->delete();

    return response()->json(['message' => 'تم حذف المادة من المواد المسجلة بنجاح.']);
}


}
