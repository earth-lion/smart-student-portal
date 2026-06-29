<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    protected $fillable = ['student_id', 'course_id','price'];

    public function course()
{
    return $this->belongsTo(Course::class, 'course_id', 'course_id');
}

public function student()
{
    return $this->belongsTo(Student::class, 'student_id', 'student_id');
}

}
