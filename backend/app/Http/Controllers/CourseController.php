<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Student;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\RegistrationSetting;
use Illuminate\Support\Facades\Log;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,student_id'
        ]);

        $student = Student::with('registrations.course', 'grades')->findOrFail($request->student_id);
        // حساب إجمالي الساعات المسجلة
        $totalCreditsRegistered = $student->registrations->sum(function ($registration) {
            return optional($registration->course)->total_credits;
        });
        // الساعات المتاحة المتبقية
        $availableHours = $student->total_credits - $totalCreditsRegistered;
        // المواد المسجلة مسبقًا
        $registeredCourseIds = $student->registrations->pluck('course_id')->toArray();
        // درجات الطالب
        $grades = $student->grades->keyBy('course_id');
        // جلب المواد المتاحة في نفس القسم وغير مسجلة مسبقًا
        $availableCourses = Course::where('department', $student->department)
            ->whereNotIn('course_id', $registeredCourseIds)
            ->get(['course_id', 'name','semester','academic_year', 'total_credits', 'type', 'instructor_name','price']);
        // فلترة المواد حسب النجاح أو الرسوب
        $filteredCourses = $availableCourses->map(function ($course) use ($grades) {
            $grade = $grades->get($course->course_id);

            if ($grade && $grade->grade < 50) {
                $course->status = 'summer';
            } elseif (!$grade) {
                $course->status = 'available';
            } else {
                $course->status = 'no';
            }

            return $course;
        })->filter(function ($course) {
            return $course->status !== 'no';
        })->values();



        return response()->json([
            'available_hours' => $availableHours,
            'courses' => $filteredCourses,
        ]);
    }

    // في CourseController
    public function registerCourses(Request $request)
{

    // 🛑 التحقق من حالة التسجيل
    $setting = RegistrationSetting::latest()->first();

    if (!$setting || !$setting->is_open) {
        return response()->json([
            'message' => 'فترة التسجيل مغلقة حاليًا. الرجاء المحاولة لاحقًا عند فتح التسجيل.',
        ], 403);
    }

    // ✅ التحقق من البيانات
    $request->validate([
        'student_id' => 'required|exists:students,student_id',
        'course_ids' => 'required|array',
        'course_ids.*' => 'exists:courses,course_id',
    ]);

        $student = Student::with('grades', 'registrations.course')->findOrFail($request->student_id);
        $courses = Course::whereIn('course_id', $request->course_ids)->get();

        $totalRequestedHours = $courses->sum('total_credits');

        

        $totalRegisteredCredits = $student->registrations->sum(function ($reg) {
            return optional($reg->course)->total_credits;
        });

        $totalCreditsAfterRegistration = $totalRegisteredCredits + $totalRequestedHours;

        if ($totalCreditsAfterRegistration > $student->total_credits_required) {
            return response()->json([
                'message' => "عدد الساعات الكلي بعد التسجيل يتجاوز الحد الأقصى للساعات المطلوبة للتخرج.",
                'max_credits_allowed' => $student->total_credits_required,
                'current_registered_credits' => $totalRegisteredCredits,
                'requested_credits' => $totalRequestedHours,
                'total_if_registered' => $totalCreditsAfterRegistration,
            ], 400);
        }

        $gpa = $student->gpa;
        $academicWarning = $student->academic_warning;

        if ($gpa !== null && $gpa >= 3.5) {
            $maxHours = 21;
        } elseif ($gpa !== null && $gpa <= 2.0) {
            $maxHours = 12;
        } elseif ($academicWarning) {
            $maxHours = 14;
        } else {
            $maxHours = 18;
        }

        if ($totalRequestedHours > $maxHours) {
            return response()->json([
                'message' => 'عدد الساعات المطلوبة يتجاوز الحد المسموح به لحالتك الأكاديمية في هذا الترم.',
                'allowed_max_hours' => $maxHours,
                'requested_hours' => $totalRequestedHours,
            ], 400);
        }

        if ($totalRequestedHours > $student->total_credits) {
            return response()->json([
                'message' => 'عدد الساعات المطلوبة يتجاوز رصيدك المتبقي من الساعات في هذا الترم.',
                'available_hours' => $student->total_credits,
                'requested_hours' => $totalRequestedHours,
            ], 400);
        }

        $existingCourseIds = $student->registrations->pluck('course_id')->toArray();
        $grades = $student->grades->keyBy('course_id');

        $alreadyRegisteredCourses = [];
        $newlyRegisteredCourses = [];
        $summerCourses = [];
        $failedPrerequisiteCourses = [];

        DB::transaction(function () use ($student, $courses, $existingCourseIds, $grades, &$alreadyRegisteredCourses, &$newlyRegisteredCourses, &$summerCourses, &$failedPrerequisiteCourses) {
            foreach ($courses as $course) {
                $isAlreadyRegistered = in_array($course->course_id, $existingCourseIds);
                $grade = $grades->get($course->course_id);
                $isRepeatCourse = $grade && $grade->grade < 50;

                if ($isAlreadyRegistered) {
                    $alreadyRegisteredCourses[] = $course->name;
                    continue;
                }

                $prerequisites = $course->prerequisites ?? [];
                $failedPrerequisites = [];

                foreach ($prerequisites as $pre) {
                    $preGrade = $grades->get($pre->course_id);
                    if (!$preGrade || $preGrade->grade < 50) {
                        $failedPrerequisites[] = $pre->name;
                    }
                }

                if (!empty($failedPrerequisites)) {
                    $failedPrerequisiteCourses[] = [
                        'course' => $course->name,
                        'missing' => $failedPrerequisites
                    ];
                    continue;
                }

                Registration::create([
                    'student_id' => $student->student_id,
                    'course_id' => $course->course_id,
                    'price' => $course->price,

                ]);

                $student->total_credits -= $course->total_credits;
                $student->total_registered_credits += $course->total_credits;
                $newlyRegisteredCourses[] = $course->name;

                if ($isRepeatCourse) {
                    $summerCourses[] = $course->name;
                }
            }

            $student->save();
        });

        $response = [];

        if (!empty($newlyRegisteredCourses)) {
            $response['message'] = 'تم تسجيل المواد التالية بنجاح.';
            $response['registered'] = $newlyRegisteredCourses;
        }

        if (!empty($alreadyRegisteredCourses)) {
            $response['note'] = 'المواد التالية مسجل فيها مسبقًا.';
            $response['already_registered'] = $alreadyRegisteredCourses;
        }

        if (!empty($summerCourses)) {
            $response['summer_courses'] = 'المواد الصيفية التالية تم إعادة عرضها لأنها مواد رسب فيها الطالب.';
            $response['summer_courses_list'] = $summerCourses;
        }

        if (!empty($failedPrerequisiteCourses)) {
            $response['note_failed'] = 'لم يتم تسجيل بعض المواد بسبب عدم اجتياز الشروط المسبقة.';
            $response['failed_prerequisites'] = $failedPrerequisiteCourses;
        }

        $response['remaining_hours'] = $student->total_credits;


        return response()->json($response);
    }




}
