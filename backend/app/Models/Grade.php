<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'course_id',
        'grade',
        'semester',
        'academic_year',
    ];

    // العلاقة مع الطالب
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    // العلاقة مع الكورس
    public function course()
{
    return $this->belongsTo(Course::class, 'course_id', 'course_id');
}

}
