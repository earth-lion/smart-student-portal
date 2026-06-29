<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use HasFactory;
    protected $primaryKey = 'resource_id';

    protected $fillable = [
        'title',
        'instructor_name',
        'resource_type',
        'course_id',
        'department_id',
        'academic_year_id',
        'academic_year',
        'file_path',
    ];

    public function course()
{
    return $this->belongsTo(Course::class, 'course_id', 'course_id');
}


    public function department() {
        return $this->belongsTo(Department::class);
    }

    public function academicYear() {
        return $this->belongsTo(Year::class);
    }
    public function files()
{
    return $this->hasMany(ResourceFile::class, 'resource_id');
}


}


