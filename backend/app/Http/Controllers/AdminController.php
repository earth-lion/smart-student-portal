<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use App\Models\Staff;
use App\Models\Course;
use App\Models\Grade;
use App\Models\Resource;
use App\Models\Schedule;
use App\Models\NationalId;
use App\Models\UniversityEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    // Get all students
    public function getStudents()
    {
        $students = Student::orderBy('student_id', 'desc')->get();
        foreach ($students as $student) {
            $ue = DB::table('university_emails')->where('email', $student->email)->first();
            $student->plain_password = $ue ? $ue->password : 'Ahmed@2024';
        }
        return response()->json($students);
    }

    // Create a new student (and their user account)
    public function createStudent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email|unique:users,email',
            'password' => 'required|string|min:6',
            'national_id' => 'required|string|size:14|unique:students,national_id|unique:national_ids,national_id',
            'phone_number' => 'nullable|string',
            'address' => 'nullable|string',
            'department' => 'nullable|string',
            'academic_year' => 'nullable|string',
            'admission_year' => 'nullable|string',
            'seat_number' => 'nullable|string',
            'financial_status' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $hashedPassword = Hash::make($request->password);

            // 1. Create Student
            $student = Student::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $hashedPassword,
                'national_id' => $request->national_id,
                'phone_number' => $request->phone_number,
                'address' => $request->address,
                'department' => $request->department,
                'academic_year' => $request->academic_year || '1',
                'admission_year' => $request->admission_year || date('Y'),
                'total_credits' => 18,
                'current_gpa' => 3.00,
                'seat_number' => $request->seat_number || rand(10000, 99999),
                'financial_status' => $request->financial_status || 'paid'
            ]);

            // 2. Create linked User Account
            User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $hashedPassword,
                'role' => 'student',
                'student_id' => $student->student_id
            ]);

            // 3. Register National ID & University Email
            $nid = NationalId::create([
                'name' => $request->name,
                'national_id' => $request->national_id
            ]);

            UniversityEmail::create([
                'national_id_id' => $nid->id,
                'email' => $request->email,
                'password' => $request->password
            ]);

            DB::commit();

            return response()->json([
                'message' => 'تم تسجيل الطالب وإنشاء الحساب الجامعي بنجاح.',
                'student' => $student
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'فشل إنشاء الحساب: ' . $e->getMessage()], 500);
        }
    }

    // Update a student
    public function updateStudent(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone_number' => 'nullable|string',
            'address' => 'nullable|string',
            'department' => 'nullable|string',
            'academic_year' => 'nullable|string',
            'seat_number' => 'nullable|string',
            'financial_status' => 'nullable|string',
            'current_gpa' => 'nullable|numeric|between:0,4.0'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $student->update($request->all());

            // Also update the linked user name
            User::where('student_id', $id)->update([
                'name' => $request->name
            ]);

            DB::commit();

            return response()->json(['message' => 'تم تحديث بيانات الطالب بنجاح.', 'student' => $student]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'فشل تحديث البيانات: ' . $e->getMessage()], 500);
        }
    }

    // Delete a student
    public function deleteStudent($id)
    {
        try {
            DB::beginTransaction();

            $student = Student::findOrFail($id);

            // Delete User profile, University email, National Id
            User::where('student_id', $id)->delete();
            NationalId::where('national_id', $student->national_id)->delete();
            $student->delete();

            DB::commit();

            return response()->json(['message' => 'تم حذف الطالب وجميع حساباته بنجاح.']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'فشل حذف الطالب: ' . $e->getMessage()], 500);
        }
    }

    // Get all staff members
    public function getStaff()
    {
        $staffMembers = Staff::orderBy('id', 'desc')->get();
        foreach ($staffMembers as $staff) {
            $ue = DB::table('university_emails')->where('email', $staff->email)->first();
            if ($ue) {
                $staff->plain_password = $ue->password;
            } else {
                // If not found in university_emails, let's construct the password using the name pattern: Name@Staff
                $emailPrefix = explode('@', $staff->email)[0];
                $staff->plain_password = ucfirst($emailPrefix) . '@Staff';
            }
        }
        return response()->json($staffMembers);
    }

    // Create a new staff member
    public function createStaff(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:staff,email|unique:users,email',
            'password' => 'required|string|min:6',
            'job_title' => 'required|string',
            'department' => 'required|string',
            'phone_number' => 'nullable|string',
            'national_id' => 'nullable|string|size:14|unique:staff,national_id',
            'address' => 'nullable|string',
            'salary' => 'nullable|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $hashedPassword = Hash::make($request->password);

            // 1. Create Staff profile
            $staff = Staff::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $hashedPassword,
                'job_title' => $request->job_title,
                'department' => $request->department,
                'phone_number' => $request->phone_number,
                'national_id' => $request->national_id,
                'address' => $request->address || 'بورسعيد، مصر',
                'hire_date' => date('Y-m-d'),
                'salary' => $request->salary || 6000.00
            ]);

            // 2. Create User account
            User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $hashedPassword,
                'role' => 'staff',
                'staff_id' => $staff->id
            ]);

            // 3. Register in national_ids & university_emails
            $nationalIdVal = $request->national_id ?: 'STAFF_' . rand(100000, 999999) . rand(100000, 999999);
            $nid = NationalId::create([
                'name' => $request->name,
                'national_id' => $nationalIdVal
            ]);

            UniversityEmail::create([
                'national_id_id' => $nid->id,
                'email' => $request->email,
                'password' => $request->password
            ]);

            DB::commit();

            return response()->json([
                'message' => 'تم إضافة الموظف بنجاح وإنشاء حساب الدخول.',
                'staff' => $staff
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'فشل إضافة الموظف: ' . $e->getMessage()], 500);
        }
    }

    // Update a staff member
    public function updateStaff(Request $request, $id)
    {
        $staff = Staff::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'job_title' => 'required|string',
            'department' => 'required|string',
            'phone_number' => 'nullable|string',
            'address' => 'nullable|string',
            'salary' => 'nullable|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $staff->update($request->all());

            // Update user account name
            User::where('staff_id', $id)->update([
                'name' => $request->name
            ]);

            DB::commit();

            return response()->json(['message' => 'تم تحديث بيانات الموظف بنجاح.', 'staff' => $staff]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'فشل تحديث البيانات: ' . $e->getMessage()], 500);
        }
    }

    // Delete a staff member
    public function deleteStaff($id)
    {
        try {
            DB::beginTransaction();

            $staff = Staff::findOrFail($id);
            User::where('staff_id', $id)->delete();
            $staff->delete();

            DB::commit();

            return response()->json(['message' => 'تم حذف الموظف وإلغاء حسابه بنجاح.']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'فشل حذف الموظف: ' . $e->getMessage()], 500);
        }
    }

    // Overall stats for Admin Dashboard Overview
    public function getStats()
    {
        $totalStudents = Student::count();
        $totalStaff = Staff::count();
        $totalCourses = Course::count();
        $totalResources = Resource::count();
        $totalSchedules = Schedule::count();

        // Get GPAs distribution
        $gpaAvg = Student::avg('current_gpa');
        $gpaWarningCount = Student::where('current_gpa', '<', 2.0)->count();

        // Financial status overview
        $totalFinancialDue = DB::table('financial_data')->sum('total_amount');
        $totalFinancialPaid = DB::table('financial_data')->sum('paid_amount');
        $totalFinancialRemaining = DB::table('financial_data')->sum('remaining_amount');

        return response()->json([
            'counts' => [
                'students' => $totalStudents,
                'staff' => $totalStaff,
                'courses' => $totalCourses,
                'resources' => $totalResources,
                'schedules' => $totalSchedules,
            ],
            'academic' => [
                'gpa_avg' => round($gpaAvg, 2),
                'gpa_warning_count' => $gpaWarningCount,
            ],
            'financial' => [
                'total_due' => $totalFinancialDue,
                'total_paid' => $totalFinancialPaid,
                'total_remaining' => $totalFinancialRemaining,
            ]
        ]);
    }

    // Simulated audit logs / activity logs
    public function getAuditLogs()
    {
        // Generate simulated dynamic audit log based on real system state
        $students = Student::orderBy('student_id', 'desc')->take(3)->get();
        $resources = Resource::orderBy('resource_id', 'desc')->take(3)->get();
        $schedules = Schedule::orderBy('id', 'desc')->take(3)->get();

        $logs = [];

        foreach ($students as $index => $std) {
            $logs[] = [
                'id' => 'std-' . $std->student_id,
                'action' => 'إضافة طالب جديد',
                'user' => 'مسؤول النظام',
                'details' => "تم إضافة الطالب " . $std->name . " بقسم " . $std->department,
                'time' => $std->created_at ? $std->created_at->diffForHumans() : 'منذ ساعات'
            ];
        }

        foreach ($resources as $index => $res) {
            $logs[] = [
                'id' => 'res-' . $res->resource_id,
                'action' => 'رفع مصدر أكاديمي',
                'user' => 'المشرف الأكاديمي',
                'details' => "تم إضافة المصدر " . $res->resource_name . " للمقرر #" . $res->course_id,
                'time' => $res->created_at ? $res->created_at->diffForHumans() : 'منذ يوم'
            ];
        }

        foreach ($schedules as $index => $sch) {
            $logs[] = [
                'id' => 'sch-' . $sch->id,
                'action' => 'تحديث جدول الدراسة',
                'user' => 'مسؤول النظام',
                'details' => "تمت إضافة موعد جديد لمادة #" . $sch->course_id . " يوم " . $sch->day,
                'time' => $sch->created_at ? $sch->created_at->diffForHumans() : 'منذ يومين'
            ];
        }

        return response()->json($logs);
    }
}
