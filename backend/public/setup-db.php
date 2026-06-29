<?php

require __DIR__ . '/../vendor/autoload.php';

// Initialize Laravel application to use Eloquent DB connection
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

echo "Starting database setup...\n";

// Drop tables in correct order of foreign keys
Schema::disableForeignKeyConstraints();

$tables = [
    'personal_access_tokens',
    'comments',
    'grades',
    'registrations',
    'notifications',
    'resource_files',
    'resources',
    'schedules',
    'students',
    'staff',
    'users',
    'advisors',
    'majors',
    'courses',
    'registration_settings',
    'financial_data',
    'departments',
    'years',
    'semesters',
    'university_emails',
    'national_ids'
];

foreach ($tables as $table) {
    Schema::dropIfExists($table);
    echo "Dropped table: $table\n";
}

Schema::enableForeignKeyConstraints();

// Create Departments Table
Schema::create('departments', function ($table) {
    $table->id();
    $table->string('name');
    $table->timestamps();
});

// Create Years Table
Schema::create('years', function ($table) {
    $table->id();
    $table->string('name');
    $table->timestamps();
});

// Create Semesters Table
Schema::create('semesters', function ($table) {
    $table->id();
    $table->string('name');
    $table->timestamps();
});

// Create Majors Table
Schema::create('majors', function ($table) {
    $table->id();
    $table->string('name');
    $table->foreignId('department_id');
    $table->timestamps();
});

// Create Advisors Table
Schema::create('advisors', function ($table) {
    $table->id();
    $table->string('name');
    $table->string('email');
    $table->foreignId('department_id');
    $table->timestamps();
});

// Create Courses Table
Schema::create('courses', function ($table) {
    $table->id('course_id');
    $table->string('name');
    $table->integer('total_credits');
    $table->string('type')->default('lecture');
    $table->integer('max_hours')->nullable();
    $table->integer('min_hours')->nullable();
    $table->foreignId('major_id')->nullable();
    $table->foreignId('instructor_id')->nullable();
    $table->decimal('price', 8, 2)->default(0);
    $table->string('department')->nullable();
    $table->integer('academic_year')->nullable();
    $table->integer('semester')->nullable();
    $table->string('instructor_name')->nullable();
    $table->timestamps();
});

// Create Users Table (Laravel default auth + student/staff link)
Schema::create('users', function ($table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password');
    $table->string('role')->default('student'); // student, staff, admin
    $table->unsignedBigInteger('student_id')->nullable();
    $table->unsignedBigInteger('staff_id')->nullable();
    $table->timestamp('email_verified_at')->nullable();
    $table->rememberToken();
    $table->timestamps();
});

// Create Personal Access Tokens Table (Sanctum)
Schema::create('personal_access_tokens', function ($table) {
    $table->id();
    $table->morphs('tokenable');
    $table->string('name');
    $table->string('token', 64)->unique();
    $table->text('abilities')->nullable();
    $table->timestamp('last_used_at')->nullable();
    $table->timestamp('expires_at')->nullable();
    $table->timestamps();
});

// Create Students Table
Schema::create('students', function ($table) {
    $table->id('student_id');
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password');
    $table->string('national_id', 14)->unique();
    $table->string('phone_number')->nullable();
    $table->string('address')->nullable();
    $table->string('department')->nullable();
    $table->string('academic_year')->nullable();
    $table->string('admission_year')->nullable();
    $table->integer('total_credits')->default(0);
    $table->decimal('current_gpa', 4, 2)->default(0.00);
    $table->decimal('gpa', 4, 2)->default(0.00); // duplicate for request compatibility
    $table->foreignId('major_id')->nullable();
    $table->foreignId('advisor_id')->nullable();
    $table->string('seat_number')->nullable();
    $table->integer('semester')->default(1);
    $table->string('financial_status')->default('paid');
    $table->string('image')->nullable();
    $table->integer('total_credits_required')->default(120);
    $table->integer('total_registered_credits')->default(0);
    $table->boolean('academic_warning')->default(false);
    $table->timestamps();
});

// Create Staff Table
Schema::create('staff', function ($table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password');
    $table->string('phone_number')->nullable();
    $table->string('national_id', 14)->unique()->nullable();
    $table->string('address')->nullable();
    $table->string('job_title')->nullable();
    $table->string('department')->nullable();
    $table->string('hire_date')->nullable();
    $table->decimal('salary', 10, 2)->default(0.00);
    $table->timestamps();
});

// Create Schedules Table
Schema::create('schedules', function ($table) {
    $table->id();
    $table->foreignId('course_id');
    $table->string('type'); // lecture, section, exam
    $table->string('day'); // الأحد, الاثنين, etc.
    $table->time('start_time');
    $table->time('end_time');
    $table->foreignId('year_id');
    $table->foreignId('semester_id');
    $table->foreignId('department_id');
    $table->timestamps();
});

// Create Resources Table
Schema::create('resources', function ($table) {
    $table->id('resource_id');
    $table->string('resource_name');
    $table->string('resource_type')->default('محاضرة');
    $table->foreignId('course_id');
    $table->foreignId('department_id');
    $table->foreignId('academic_year_id')->nullable();
    $table->integer('academic_year')->nullable(); // duplicate for request compatibility
    $table->string('file_path')->nullable();
    $table->timestamps();
});

// Create Resource Files Table
Schema::create('resource_files', function ($table) {
    $table->id();
    $table->foreignId('resource_id');
    $table->string('file_name');
    $table->string('file_type'); // pdf, doc, ppt, etc.
    $table->string('file_path');
    $table->timestamps();
});

// Create Notifications Table
Schema::create('notifications', function ($table) {
    $table->id();
    $table->foreignId('student_id')->nullable();
    $table->string('title');
    $table->text('message');
    $table->string('category')->default('general'); // general, personal
    $table->boolean('is_read')->default(false);
    $table->boolean('is_favorite')->default(false);
    $table->boolean('is_archived')->default(false);
    $table->timestamps();
});

// Create Registrations Table
Schema::create('registrations', function ($table) {
    $table->id();
    $table->foreignId('student_id');
    $table->foreignId('course_id');
    $table->decimal('price', 8, 2)->default(0);
    $table->timestamps();
});

// Create Registration Settings Table
Schema::create('registration_settings', function ($table) {
    $table->id();
    $table->boolean('is_open')->default(true);
    $table->timestamps();
});

// Create Grades Table
Schema::create('grades', function ($table) {
    $table->id();
    $table->foreignId('student_id');
    $table->foreignId('course_id');
    $table->integer('grade'); // 0-100
    $table->integer('semester')->default(1);
    $table->integer('academic_year')->default(1);
    $table->decimal('points', 4, 2)->default(0.00);
    $table->integer('hours')->default(3);
    $table->decimal('price', 8, 2)->default(0.00);
    $table->timestamps();
});

// Create Comments Table
Schema::create('comments', function ($table) {
    $table->id();
    $table->foreignId('student_id')->nullable(); // nullable for general comments or staff feedback
    $table->unsignedBigInteger('staff_id')->nullable();
    $table->string('national_id', 14)->nullable();
    $table->string('sender_name')->nullable();
    $table->text('content');
    $table->text('body')->nullable();
    $table->timestamps();
});

// Create Financial Data Table
Schema::create('financial_data', function ($table) {
    $table->id();
    $table->foreignId('student_id');
    $table->decimal('total_amount', 8, 2)->default(0.00);
    $table->decimal('paid_amount', 8, 2)->default(0.00);
    $table->decimal('remaining_amount', 8, 2)->default(0.00);
    $table->timestamps();
});

// Create national_ids table (used by NationalId model)
Schema::create('national_ids', function ($table) {
    $table->id();
    $table->string('name');
    $table->string('national_id', 14)->unique();
    $table->timestamps();
});

// Create university_emails table (used by UniversityEmail model, linked to national_ids)
Schema::create('university_emails', function ($table) {
    $table->id('email_id');
    $table->unsignedBigInteger('national_id_id');
    $table->string('email')->unique();
    $table->string('password');
    $table->timestamps();
});


/* ── SEED DATA ────────────────────────────────────────────── */

echo "Seeding Departments, Years, Semesters, Majors...\n";

DB::table('departments')->insert([
    ['id' => 1, 'name' => 'علوم الحاسب (CS)', 'created_at' => now(), 'updated_at' => now()],
    ['id' => 2, 'name' => 'هندسة البرمجيات (SE)', 'created_at' => now(), 'updated_at' => now()],
    ['id' => 3, 'name' => 'نظم المعلومات (IS)', 'created_at' => now(), 'updated_at' => now()]
]);

DB::table('years')->insert([
    ['id' => 1, 'name' => 'الفرقة الأولى', 'created_at' => now(), 'updated_at' => now()],
    ['id' => 2, 'name' => 'الفرقة الثانية', 'created_at' => now(), 'updated_at' => now()],
    ['id' => 3, 'name' => 'الفرقة الثالثة', 'created_at' => now(), 'updated_at' => now()],
    ['id' => 4, 'name' => 'الفرقة الرابعة', 'created_at' => now(), 'updated_at' => now()]
]);

DB::table('semesters')->insert([
    ['id' => 1, 'name' => 'الفصل الدراسي الأول', 'created_at' => now(), 'updated_at' => now()],
    ['id' => 2, 'name' => 'الفصل الدراسي الثاني', 'created_at' => now(), 'updated_at' => now()]
]);

DB::table('majors')->insert([
    ['id' => 1, 'name' => 'تطوير الويب المتكامل', 'department_id' => 2, 'created_at' => now(), 'updated_at' => now()],
    ['id' => 2, 'name' => 'الذكاء الاصطناعي', 'department_id' => 1, 'created_at' => now(), 'updated_at' => now()],
    ['id' => 3, 'name' => 'تحليل البيانات', 'department_id' => 3, 'created_at' => now(), 'updated_at' => now()]
]);

DB::table('advisors')->insert([
    ['id' => 1, 'name' => 'د. محمد علي', 'email' => 'm.ali@mtis.edu.eg', 'department_id' => 2, 'created_at' => now(), 'updated_at' => now()],
    ['id' => 2, 'name' => 'د. أحمد سامي', 'email' => 'a.samy@mtis.edu.eg', 'department_id' => 1, 'created_at' => now(), 'updated_at' => now()]
]);

echo "Seeding Courses...\n";

$courses = [
    [
        'course_id' => 1,
        'name' => 'مقدمة في تكنولوجيا المعلومات',
        'total_credits' => 3,
        'type' => 'lecture',
        'price' => 300.00,
        'department' => 'هندسة البرمجيات (SE)',
        'academic_year' => 1,
        'semester' => 1,
        'instructor_name' => 'د. طارق محمود فوزي',
        'created_at' => now(),
        'updated_at' => now()
    ],
    [
        'course_id' => 2,
        'name' => 'خوارزميات وهياكل البيانات',
        'total_credits' => 3,
        'type' => 'lecture',
        'price' => 350.00,
        'department' => 'هندسة البرمجيات (SE)',
        'academic_year' => 2,
        'semester' => 1,
        'instructor_name' => 'د. منى صلاح رشاد',
        'created_at' => now(),
        'updated_at' => now()
    ],
    [
        'course_id' => 3,
        'name' => 'قواعد البيانات',
        'total_credits' => 3,
        'type' => 'lecture',
        'price' => 250.00,
        'department' => 'نظم المعلومات (IS)',
        'academic_year' => 2,
        'semester' => 2,
        'instructor_name' => 'د. إيمان فوزي حسن',
        'created_at' => now(),
        'updated_at' => now()
    ],
    [
        'course_id' => 4,
        'name' => 'هندسة البرمجيات',
        'total_credits' => 3,
        'type' => 'lecture',
        'price' => 350.00,
        'department' => 'هندسة البرمجيات (SE)',
        'academic_year' => 3,
        'semester' => 1,
        'instructor_name' => 'د. سمر عبد العزيز',
        'created_at' => now(),
        'updated_at' => now()
    ],
    [
        'course_id' => 5,
        'name' => 'رياضيات الحاسب',
        'total_credits' => 3,
        'type' => 'lecture',
        'price' => 300.00,
        'department' => 'علوم الحاسب (CS)',
        'academic_year' => 1,
        'semester' => 2,
        'instructor_name' => 'د. هالة مصطفى عمر',
        'created_at' => now(),
        'updated_at' => now()
    ]
];

DB::table('courses')->insert($courses);

echo "Seeding Students and Users (10 Students)...\n";

$studentsList = [
    [
        'id' => 1, 'name' => 'أحمد محمد علي', 'email' => 'ahmed@mtis.edu.eg', 'password' => 'Ahmed@2024',
        'national_id' => '29910010000001', 'phone_number' => '01012345671', 'address' => 'بورسعيد، حي الشرق',
        'department' => 'هندسة البرمجيات (SE)', 'academic_year' => '2', 'admission_year' => '2024',
        'total_credits' => 36, 'current_gpa' => 3.45, 'seat_number' => '10001', 'financial_status' => 'paid'
    ],
    [
        'id' => 2, 'name' => 'سارة إبراهيم حسن', 'email' => 'sara@mtis.edu.eg', 'password' => 'Sara@2024',
        'national_id' => '29910010000002', 'phone_number' => '01012345672', 'address' => 'بورسعيد، حي العرب',
        'department' => 'علوم الحاسب (CS)', 'academic_year' => '1', 'admission_year' => '2025',
        'total_credits' => 18, 'current_gpa' => 3.80, 'seat_number' => '10002', 'financial_status' => 'paid'
    ],
    [
        'id' => 3, 'name' => 'محمد خالد يوسف', 'email' => 'mohamed@mtis.edu.eg', 'password' => 'Mohamed@2024',
        'national_id' => '29910010000003', 'phone_number' => '01012345673', 'address' => 'بورسعيد، بورفؤاد',
        'department' => 'نظم المعلومات (IS)', 'academic_year' => '3', 'admission_year' => '2023',
        'total_credits' => 54, 'current_gpa' => 2.95, 'seat_number' => '10003', 'financial_status' => 'unpaid'
    ],
    [
        'id' => 4, 'name' => 'نور عبد الرحمن', 'email' => 'nour@mtis.edu.eg', 'password' => 'Nour@2024',
        'national_id' => '29910010000004', 'phone_number' => '01012345674', 'address' => 'بورسعيد، حي الزهور',
        'department' => 'هندسة البرمجيات (SE)', 'academic_year' => '4', 'admission_year' => '2022',
        'total_credits' => 108, 'current_gpa' => 3.60, 'seat_number' => '10004', 'financial_status' => 'paid'
    ],
    [
        'id' => 5, 'name' => 'عمر فاروق مصطفى', 'email' => 'omar@mtis.edu.eg', 'password' => 'Omar@2024',
        'national_id' => '29910010000005', 'phone_number' => '01012345675', 'address' => 'بورسعيد، حي المناخ',
        'department' => 'علوم الحاسب (CS)', 'academic_year' => '2', 'admission_year' => '2024',
        'total_credits' => 36, 'current_gpa' => 3.20, 'seat_number' => '10005', 'financial_status' => 'paid'
    ],
    [
        'id' => 6, 'name' => 'ريم أحمد سعيد', 'email' => 'reem@mtis.edu.eg', 'password' => 'Reem@2024',
        'national_id' => '29910010000006', 'phone_number' => '01012345676', 'address' => 'بورسعيد، حي الضواحي',
        'department' => 'نظم المعلومات (IS)', 'academic_year' => '1', 'admission_year' => '2025',
        'total_credits' => 12, 'current_gpa' => 3.70, 'seat_number' => '10006', 'financial_status' => 'unpaid'
    ],
    [
        'id' => 7, 'name' => 'يوسف حسام الدين', 'email' => 'youssef@mtis.edu.eg', 'password' => 'Youssef@2024',
        'national_id' => '29910010000007', 'phone_number' => '01012345677', 'address' => 'بورسعيد، بورفؤاد',
        'department' => 'هندسة البرمجيات (SE)', 'academic_year' => '3', 'admission_year' => '2023',
        'total_credits' => 60, 'current_gpa' => 2.80, 'seat_number' => '10007', 'financial_status' => 'paid'
    ],
    [
        'id' => 8, 'name' => 'لينا علي محمود', 'email' => 'lina@mtis.edu.eg', 'password' => 'Lina@2024',
        'national_id' => '29910010000008', 'phone_number' => '01012345678', 'address' => 'بورسعيد، حي الشرق',
        'department' => 'علوم الحاسب (CS)', 'academic_year' => '4', 'admission_year' => '2022',
        'total_credits' => 112, 'current_gpa' => 3.90, 'seat_number' => '10008', 'financial_status' => 'paid'
    ],
    [
        'id' => 9, 'name' => 'كريم وليد إبراهيم', 'email' => 'karim@mtis.edu.eg', 'password' => 'Karim@2024',
        'national_id' => '29910010000009', 'phone_number' => '01012345679', 'address' => 'بورسعيد، حي المناخ',
        'department' => 'نظم المعلومات (IS)', 'academic_year' => '2', 'admission_year' => '2024',
        'total_credits' => 42, 'current_gpa' => 3.10, 'seat_number' => '10009', 'financial_status' => 'paid'
    ],
    [
        'id' => 10, 'name' => 'دينا حسن سامي', 'email' => 'dina@mtis.edu.eg', 'password' => 'Dina@2024',
        'national_id' => '29910010000010', 'phone_number' => '01012345680', 'address' => 'بورسعيد، حي العرب',
        'department' => 'هندسة البرمجيات (SE)', 'academic_year' => '1', 'admission_year' => '2025',
        'total_credits' => 18, 'current_gpa' => 3.55, 'seat_number' => '10010', 'financial_status' => 'paid'
    ]
];

foreach ($studentsList as $st) {
    $hashedPassword = password_hash($st['password'], PASSWORD_BCRYPT);
    
    // Seed Students Table
    DB::table('students')->insert([
        'student_id' => $st['id'],
        'name' => $st['name'],
        'email' => $st['email'],
        'password' => $hashedPassword,
        'national_id' => $st['national_id'],
        'phone_number' => $st['phone_number'],
        'address' => $st['address'],
        'department' => $st['department'],
        'academic_year' => $st['academic_year'],
        'admission_year' => $st['admission_year'],
        'total_credits' => $st['total_credits'],
        'current_gpa' => $st['current_gpa'],
        'gpa' => $st['current_gpa'],
        'major_id' => 1,
        'advisor_id' => 1,
        'seat_number' => $st['seat_number'],
        'semester' => 1,
        'financial_status' => $st['financial_status'],
        'created_at' => now(),
        'updated_at' => now()
    ]);

    // Seed Users Table (student role)
    DB::table('users')->insert([
        'name' => $st['name'],
        'email' => $st['email'],
        'password' => $hashedPassword,
        'role' => 'student',
        'student_id' => $st['id'],
        'staff_id' => null,
        'created_at' => now(),
        'updated_at' => now()
    ]);

    // Seed national_ids for verification lookup
    $nid_id = DB::table('national_ids')->insertGetId([
        'name' => $st['name'],
        'national_id' => $st['national_id'],
        'created_at' => now(),
        'updated_at' => now()
    ]);

    // Seed university_emails for lookup
    DB::table('university_emails')->insert([
        'national_id_id' => $nid_id,
        'email' => $st['email'],
        'password' => $st['password'],
        'created_at' => now(),
        'updated_at' => now()
    ]);

    // Seed Financial Data
    $totalFee = $st['financial_status'] === 'paid' ? 1500.00 : 3500.00;
    $paidFee = $st['financial_status'] === 'paid' ? 1500.00 : 1000.00;
    DB::table('financial_data')->insert([
        'student_id' => $st['id'],
        'total_amount' => $totalFee,
        'paid_amount' => $paidFee,
        'remaining_amount' => $totalFee - $paidFee,
        'created_at' => now(),
        'updated_at' => now()
    ]);
}

echo "Seeding Staff and Users (10 Staff)...\n";

$staffList = [
    [
        'id' => 1, 'name' => 'د. طارق محمود فوزي', 'email' => 'tarek@mtis.edu.eg', 'password' => 'Tarek@Staff',
        'job_title' => 'رئيس قسم هندسة البرمجيات', 'department' => 'هندسة البرمجيات (SE)', 'phone_number' => '01234567891', 'national_id' => '28010010000001'
    ],
    [
        'id' => 2, 'name' => 'د. منى صلاح رشاد', 'email' => 'mona@mtis.edu.eg', 'password' => 'Mona@Staff',
        'job_title' => 'أستاذ مساعد', 'department' => 'علوم الحاسب (CS)', 'phone_number' => '01234567892', 'national_id' => '28010010000002'
    ],
    [
        'id' => 3, 'name' => 'م. عادل حسين نور', 'email' => 'adel@mtis.edu.eg', 'password' => 'Adel@Staff',
        'job_title' => 'مهندس مختبرات', 'department' => 'نظم المعلومات (IS)', 'phone_number' => '01234567893', 'national_id' => '28010010000003'
    ],
    [
        'id' => 4, 'name' => 'د. سمر عبد العزيز', 'email' => 'samar@mtis.edu.eg', 'password' => 'Samar@Staff',
        'job_title' => 'مرشد أكاديمي', 'department' => 'هندسة البرمجيات (SE)', 'phone_number' => '01234567894', 'national_id' => '28010010000004'
    ],
    [
        'id' => 5, 'name' => 'أ. حاتم رضا محمد', 'email' => 'hatem@mtis.edu.eg', 'password' => 'Hatem@Staff',
        'job_title' => 'محاضر', 'department' => 'علوم الحاسب (CS)', 'phone_number' => '01234567895', 'national_id' => '28010010000005'
    ],
    [
        'id' => 6, 'name' => 'د. إيمان فوزي حسن', 'email' => 'iman@mtis.edu.eg', 'password' => 'Iman@Staff',
        'job_title' => 'أستاذ', 'department' => 'نظم المعلومات (IS)', 'phone_number' => '01234567896', 'national_id' => '28010010000006'
    ],
    [
        'id' => 7, 'name' => 'أ. وليد نبيل جمال', 'email' => 'walid@mtis.edu.eg', 'password' => 'Walid@Staff',
        'job_title' => 'أخصائي شؤون طلاب', 'department' => 'الشؤون الطلابية', 'phone_number' => '01234567897', 'national_id' => '28010010000007'
    ],
    [
        'id' => 8, 'name' => 'د. هالة مصطفى عمر', 'email' => 'hala@mtis.edu.eg', 'password' => 'Hala@Staff',
        'job_title' => 'رئيس قسم علوم الحاسب', 'department' => 'علوم الحاسب (CS)', 'phone_number' => '01234567898', 'national_id' => '28010010000008'
    ],
    [
        'id' => 9, 'name' => 'م. رامي أشرف سيد', 'email' => 'rami@mtis.edu.eg', 'password' => 'Rami@Staff',
        'job_title' => 'مسؤول تقنية معلومات', 'department' => 'الدعم التقني', 'phone_number' => '01234567899', 'national_id' => '28010010000009'
    ],
    [
        'id' => 10, 'name' => 'أ. نادية كمال زكي', 'email' => 'nadia@mtis.edu.eg', 'password' => 'Nadia@Staff',
        'job_title' => 'سكرتيرة الكلية', 'department' => 'الإدارة', 'phone_number' => '01234567900', 'national_id' => '28010010000010'
    ]
];

foreach ($staffList as $st) {
    $hashedPassword = password_hash($st['password'], PASSWORD_BCRYPT);
    
    // Seed Staff Table
    DB::table('staff')->insert([
        'id' => $st['id'],
        'name' => $st['name'],
        'email' => $st['email'],
        'password' => $hashedPassword,
        'phone_number' => $st['phone_number'],
        'national_id' => $st['national_id'],
        'address' => 'بورسعيد، مصر',
        'job_title' => $st['job_title'],
        'department' => $st['department'],
        'hire_date' => '2024-01-15',
        'salary' => 8500.00,
        'created_at' => now(),
        'updated_at' => now()
    ]);

    // Seed Users Table (staff role)
    DB::table('users')->insert([
        'name' => $st['name'],
        'email' => $st['email'],
        'password' => $hashedPassword,
        'role' => 'staff',
        'student_id' => null,
        'staff_id' => $st['id'],
        'created_at' => now(),
        'updated_at' => now()
    ]);
}

echo "Seeding Admin User...\n";

DB::table('users')->insert([
    'name' => 'مسؤول النظام',
    'email' => 'admin@mtis.edu.eg',
    'password' => password_hash('Admin@2024!', PASSWORD_BCRYPT),
    'role' => 'admin',
    'student_id' => null,
    'staff_id' => null,
    'created_at' => now(),
    'updated_at' => now()
]);

echo "Seeding Schedules...\n";

DB::table('schedules')->insert([
    [
        'course_id' => 1, 'type' => 'lecture', 'day' => 'الأحد',
        'start_time' => '09:00:00', 'end_time' => '11:00:00',
        'year_id' => 1, 'semester_id' => 1, 'department_id' => 2,
        'created_at' => now(), 'updated_at' => now()
    ],
    [
        'course_id' => 1, 'type' => 'section', 'day' => 'الاثنين',
        'start_time' => '11:00:00', 'end_time' => '13:00:00',
        'year_id' => 1, 'semester_id' => 1, 'department_id' => 2,
        'created_at' => now(), 'updated_at' => now()
    ],
    [
        'course_id' => 2, 'type' => 'lecture', 'day' => 'الثلاثاء',
        'start_time' => '09:00:00', 'end_time' => '11:00:00',
        'year_id' => 2, 'semester_id' => 1, 'department_id' => 2,
        'created_at' => now(), 'updated_at' => now()
    ],
    [
        'course_id' => 3, 'type' => 'lecture', 'day' => 'الأربعاء',
        'start_time' => '11:00:00', 'end_time' => '13:00:00',
        'year_id' => 2, 'semester_id' => 2, 'department_id' => 3,
        'created_at' => now(), 'updated_at' => now()
    ]
]);

echo "Seeding Registrations...\n";

for ($sId = 1; $sId <= 10; $sId++) {
    DB::table('registrations')->insert([
        ['student_id' => $sId, 'course_id' => 1, 'price' => 300.00, 'created_at' => now(), 'updated_at' => now()],
        ['student_id' => $sId, 'course_id' => 2, 'price' => 350.00, 'created_at' => now(), 'updated_at' => now()]
    ]);
}

DB::table('registration_settings')->insert([
    ['id' => 1, 'is_open' => true, 'created_at' => now(), 'updated_at' => now()]
]);

echo "Seeding Grades...\n";

for ($sId = 1; $sId <= 10; $sId++) {
    DB::table('grades')->insert([
        [
            'student_id' => $sId, 'course_id' => 1, 'grade' => rand(65, 95), 'semester' => 1, 'academic_year' => 1,
            'points' => 3.50, 'hours' => 3, 'price' => 300.00, 'created_at' => now(), 'updated_at' => now()
        ],
        [
            'student_id' => $sId, 'course_id' => 2, 'grade' => rand(60, 98), 'semester' => 1, 'academic_year' => 1,
            'points' => 3.00, 'hours' => 3, 'price' => 350.00, 'created_at' => now(), 'updated_at' => now()
        ]
    ]);
}

echo "Seeding Resources...\n";

DB::table('resources')->insert([
    [
        'resource_id' => 1,
        'resource_name' => 'محاضرات هندسة البرمجيات الكليّة',
        'resource_type' => 'كتب',
        'course_id' => 4,
        'department_id' => 2,
        'academic_year_id' => 3,
        'academic_year' => 3,
        'file_path' => null,
        'created_at' => now(),
        'updated_at' => now()
    ],
    [
        'resource_id' => 2,
        'resource_name' => 'تمارين البرمجة وهياكل البيانات',
        'resource_type' => 'تمارين وعملي',
        'course_id' => 2,
        'department_id' => 2,
        'academic_year_id' => 2,
        'academic_year' => 2,
        'file_path' => null,
        'created_at' => now(),
        'updated_at' => now()
    ]
]);

DB::table('resource_files')->insert([
    [
        'resource_id' => 1,
        'file_name' => 'المحاضرة الأولى - مقدمة عامة.pdf',
        'file_type' => 'pdf',
        'file_path' => 'uploads/lec1.pdf',
        'created_at' => now(),
        'updated_at' => now()
    ],
    [
        'resource_id' => 2,
        'file_name' => 'شيت هياكل البيانات الأول.pdf',
        'file_type' => 'pdf',
        'file_path' => 'uploads/sheet1.pdf',
        'created_at' => now(),
        'updated_at' => now()
    ]
]);

echo "Seeding Notifications...\n";

DB::table('notifications')->insert([
    [
        'student_id' => null,
        'title' => 'بدء الفصل الدراسي والتسجيل الأكاديمي',
        'message' => 'أهلاً بكم في الكلية. تم فتح التسجيل للمقررات الأكاديمية للفصل الحالي، يرجى التوجه لصفحة التسجيل لاختيار المقررات وتأكيدها.',
        'category' => 'general',
        'is_read' => false,
        'is_favorite' => false,
        'is_archived' => false,
        'created_at' => now(),
        'updated_at' => now()
    ]
]);

for ($sId = 1; $sId <= 10; $sId++) {
    DB::table('notifications')->insert([
        [
            'student_id' => $sId,
            'title' => 'إشعار ترحيبي شخصي بالمنصة',
            'message' => 'مرحباً بك في منصة الإرشاد الأكاديمي المتكاملة. يرجى مراجعة مرشدك الأكاديمي لمتابعة خطتك الدراسية بنجاح.',
            'category' => 'personal',
            'is_read' => false,
            'is_favorite' => true,
            'is_archived' => false,
            'created_at' => now(),
            'updated_at' => now()
        ]
    ]);
}

echo "Seeding completed successfully!\n";
echo "Database setup is fully completed.\n";
