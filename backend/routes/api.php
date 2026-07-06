<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GPAController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\UniversityEmailController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\AdminNotificationController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\CredentialLookupController;


Route::post('/chatbot', [ChatbotController::class, 'reply']);
Route::post('/credential-lookup', [CredentialLookupController::class, 'lookup']);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = $request->user();
    if ($user->role === 'student' && $user->student_id) {
        $student = \App\Models\Student::find($user->student_id);
        if ($student) {
            $user->department = $student->department;
            $user->academic_year = (int)$student->academic_year;
            $user->total_credits = (int)$student->total_credits;
            $user->current_gpa = $student->current_gpa;
        }
    } elseif ($user->role === 'staff' && $user->staff_id) {
        $staff = \App\Models\Staff::find($user->staff_id);
        if ($staff) {
            $user->job_title = $staff->job_title;
            $user->department = $staff->department;
            $user->phone_number = $staff->phone_number;
            $user->hire_date = $staff->hire_date;
            $user->salary = $staff->salary;
        }
    }
    return $user;
});
Route::post('logout', [AuthController::class, 'logout']);

//login and registration
Route::post('/register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

//comments
Route::post('/comments', [CommentController::class, 'store']);

//get email
Route::post('/get-university-email', [UniversityEmailController::class, 'getUniversityEmailByNationalId']);


// Routes student info
Route::get('/students/{student_id}',[StudentController::class,'show']);
// Route::middleware('auth:sanctum')->get('/students/{student_id}', [StudentController::class, 'show']);

//student grade
Route::middleware('auth:sanctum')->get('/student/grades', [GradeController::class, 'showStudentGrades']);
Route::get('/grades/pdf', [GradeController::class, 'downloadPdf'])->middleware('auth:sanctum');


//gpa route
Route::post('/calculate-gpa', [GPAController::class, 'calculate']);

//notification route
    Route::get('/notifications', [NotificationController::class, 'showNotifications']);
    Route::post('/notifications/{id}/favorite', [NotificationController::class, 'toggleFavorite']);
    Route::get('/notifications/favorite', [NotificationController::class, 'showFavorites']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/{id}/archived', [NotificationController::class, 'archiveNotification']);
    Route::get('/notifications/archived', [NotificationController::class, 'showArchivedNotifications']);
    Route::get('/notifications/non-archived', [NotificationController::class, 'showNonArchivedNotifications']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'deleteNotification']);

//schedule
Route::get('/schedule', [ScheduleController::class, 'index']);

//courses routes
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/registrations/{student_id}/courses', [RegistrationController::class, 'showStudentCourses']);
Route::post('/courses/register', [CourseController::class, 'registerCourses']);
Route::delete('/registrations', [RegistrationController::class, 'destroy']);

//resources
Route::get('/resources', [ResourceController::class, 'index']);
Route::get('/resources/{resource_id}/files', [ResourceController::class, 'getFilesByResource']);

//payment
Route::post('/fawry/callback', [PaymentController::class, 'fawryCallback']);
Route::post('/student/pay', [PaymentController::class, 'payFees'])->middleware('auth:sanctum');

// ── Admin-Only Middleware & Route Group ──
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Comments management
    Route::get('/comments', [CommentController::class, 'index']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    // Send notifications
    Route::post('/notifications/send', [AdminNotificationController::class, 'sendnotification']);
    Route::post('/notifications/send-registration-open', [NotificationController::class, 'sendRegistrationOpenNotification']);
    Route::post('/notifications/send-low-gpa', [NotificationController::class, 'sendLowGpaNotification']);
    Route::post('/notifications/send-outstanding-amount', [NotificationController::class, 'sendOutstandingAmountNotification']);

    // Schedule management
    Route::post('/schedule', [ScheduleController::class, 'store']);
    Route::delete('/schedule/{id}', function($id) {
        \App\Models\Schedule::destroy($id);
        return response()->json(['status' => 'success', 'message' => 'تم حذف الميعاد من الجدول بنجاح']);
    });

    // Resources management
    Route::post('/resources', [ResourceController::class, 'store']);
    Route::delete('/resources/{id}', function($id) {
        \App\Models\Resource::destroy($id);
        return response()->json(['status' => 'success', 'message' => 'تم حذف المصدر بنجاح']);
    });

    // Students CRUD
    Route::get('/admin/students', [AdminController::class, 'getStudents']);
    Route::post('/admin/students', [AdminController::class, 'createStudent']);
    Route::put('/admin/students/{id}', [AdminController::class, 'updateStudent']);
    Route::delete('/admin/students/{id}', [AdminController::class, 'deleteStudent']);

    // Staff CRUD
    Route::get('/admin/staff', [AdminController::class, 'getStaff']);
    Route::post('/admin/staff', [AdminController::class, 'createStaff']);
    Route::put('/admin/staff/{id}', [AdminController::class, 'updateStaff']);
    Route::delete('/admin/staff/{id}', [AdminController::class, 'deleteStaff']);

    // Stats & Audit
    Route::get('/admin/system-stats', [AdminController::class, 'getStats']);
    Route::get('/admin/audit-logs', [AdminController::class, 'getAuditLogs']);
});

// ── Staff-Only Route Group ──
Route::middleware(['auth:sanctum', 'staff'])->group(function () {
    Route::get('/staff/courses', [StaffController::class, 'getCourses']);
    Route::get('/staff/students', [StaffController::class, 'getStudents']);
    Route::post('/staff/grades', [StaffController::class, 'submitGrade']);
    Route::get('/staff/schedules', [StaffController::class, 'getSchedules']);
});
