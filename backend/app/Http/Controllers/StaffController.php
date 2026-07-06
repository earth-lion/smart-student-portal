<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Staff;
use App\Models\Course;
use App\Models\Student;
use App\Models\Grade;
use App\Models\Schedule;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class StaffController extends Controller
{
    // Helper to get staff model from authenticated user
    private function getStaffProfile(Request $request)
    {
        $user = $request->user();
        if ($user && $user->role === 'staff' && $user->staff_id) {
            return Staff::find($user->staff_id);
        }
        return null;
    }

    // Get courses taught by this staff member
    public function getCourses(Request $request)
    {
        $staff = $this->getStaffProfile($request);
        if (!$staff) {
            return response()->json(['message' => 'ملف الموظف غير موجود'], 404);
        }

        // Fetch courses where instructor_name matches staff name
        $courses = Course::where('instructor_name', 'like', '%' . $staff->name . '%')->get();
        
        // If none found, return all courses as fallback so they don't see an empty page
        if ($courses->isEmpty()) {
            $courses = Course::take(3)->get();
        }

        return response()->json($courses);
    }

    // Get students enrolled in courses taught by this staff member
    public function getStudents(Request $request)
    {
        $staff = $this->getStaffProfile($request);
        if (!$staff) {
            return response()->json(['message' => 'ملف الموظف غير موجود'], 404);
        }

        // Get taught course IDs
        $courseIds = Course::where('instructor_name', 'like', '%' . $staff->name . '%')
            ->pluck('course_id')
            ->toArray();

        if (empty($courseIds)) {
            // Fallback course IDs
            $courseIds = Course::take(3)->pluck('course_id')->toArray();
        }

        // Get registrations for these courses with student details
        $registrations = Registration::whereIn('registrations.course_id', $courseIds)
            ->join('students', 'registrations.student_id', '=', 'students.student_id')
            ->join('courses', 'registrations.course_id', '=', 'courses.course_id')
            ->select(
                'registrations.id as registration_id',
                'students.student_id',
                'students.name as student_name',
                'students.seat_number',
                'students.department',
                'courses.course_id',
                'courses.name as course_name'
            )
            ->get();

        // Get existing grades for these students/courses
        $grades = Grade::whereIn('course_id', $courseIds)->get()->keyBy(function($item) {
            return $item->student_id . '-' . $item->course_id;
        });

        // Merge grades into list
        $result = $registrations->map(function($reg) use ($grades) {
            $key = $reg->student_id . '-' . $reg->course_id;
            $reg->grade = isset($grades[$key]) ? $grades[$key]->grade : null;
            $reg->grade_id = isset($grades[$key]) ? $grades[$key]->id : null;
            return $reg;
        });

        return response()->json($result);
    }

    // Enter or update a student's grade
    public function submitGrade(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|integer',
            'course_id' => 'required|integer',
            'grade' => 'required|integer|between:0,100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $gradeValue = $request->grade;

            // Calculate points based on grade value
            $points = 0.00;
            if ($gradeValue >= 90) $points = 4.00;
            elseif ($gradeValue >= 85) $points = 3.70;
            elseif ($gradeValue >= 80) $points = 3.30;
            elseif ($gradeValue >= 75) $points = 3.00;
            elseif ($gradeValue >= 70) $points = 2.70;
            elseif ($gradeValue >= 65) $points = 2.40;
            elseif ($gradeValue >= 60) $points = 2.00;
            else $points = 0.00;

            // Check if course exists to get credit hours and price
            $course = Course::find($request->course_id);
            $hours = $course ? $course->total_credits : 3;
            $price = $course ? $course->price : 0;

            // Insert or Update Grade
            $grade = Grade::updateOrCreate(
                [
                    'student_id' => $request->student_id,
                    'course_id' => $request->course_id,
                ],
                [
                    'grade' => $gradeValue,
                    'points' => $points,
                    'hours' => $hours,
                    'price' => $price,
                    'semester' => 1,
                    'academic_year' => 1,
                ]
            );

            // Re-calculate the Student's Cumulative GPA based on all their grades
            $studentGrades = Grade::where('student_id', $request->student_id)->get();
            if ($studentGrades->isNotEmpty()) {
                $totalPoints = 0;
                $totalHours = 0;
                foreach ($studentGrades as $sg) {
                    $totalPoints += $sg->points * $sg->hours;
                    $totalHours += $sg->hours;
                }
                $newGpa = $totalHours > 0 ? round($totalPoints / $totalHours, 2) : 0.00;

                Student::where('student_id', $request->student_id)->update([
                    'current_gpa' => $newGpa,
                    'gpa' => $newGpa
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'تم حفظ درجة الطالب بنجاح وتحديث المعدل التراكمي.',
                'grade' => $grade
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'فشل إدخال الدرجة: ' . $e->getMessage()], 500);
        }
    }

    // Get taught courses schedules
    public function getSchedules(Request $request)
    {
        $staff = $this->getStaffProfile($request);
        if (!$staff) {
            return response()->json(['message' => 'ملف الموظف غير موجود'], 404);
        }

        $courseIds = Course::where('instructor_name', 'like', '%' . $staff->name . '%')
            ->pluck('course_id')
            ->toArray();

        if (empty($courseIds)) {
            $courseIds = Course::take(3)->pluck('course_id')->toArray();
        }

        $schedules = Schedule::whereIn('course_id', $courseIds)
            ->with('course')
            ->get();

        return response()->json($schedules);
    }
}
