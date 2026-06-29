<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// app/Models/StudentCourse.php

class StudentCourse extends Model
{
    protected $table = 'student_courses'; // ضروري لأن اسم الجدول غير جمع اسم الموديل
    public $incrementing = false; // لأنه بدون id
    public $timestamps = false; // لأنه بدون created_at و updated_at

    protected $fillable = ['student_id', 'course_id'];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
    public function comments()
{
    return $this->hasMany(Comment::class);
}

}

