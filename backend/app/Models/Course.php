<?php
namespace App\Models;

use App\Models\CourseFile;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $primaryKey = 'course_id';

    protected $fillable = [
        'name', 'total_credits', 'type',
        'max_hours', 'min_hours', 'major_id', 'instructor_id',
        'price', 'department', 'academic_year	', 'semester'
    ];

    public function major()
    {
        return $this->belongsTo(Major::class, 'major_id');
    }

    public function instructor()
    {
        return $this->belongsTo(Instructor::class, 'instructor_id');
    }

   public function registrations()
{
    return $this->hasMany(Registration::class, 'course_id', 'course_id');
}


    public function students()
    {
        return $this->belongsToMany(Student::class, 'registrations', 'course_id', 'student_id');
    }

    public function resources()
    {
        return $this->hasMany(Resource::class, 'course_id');
    }
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
    public function prerequisites()
{
    return $this->belongsToMany(Course::class, 'course_prerequisites', 'course_id', 'prerequisite_id');
}


    public function grades()
    {
        return $this->hasMany(Grade::class, 'course_id', 'course_id');
    }

}
