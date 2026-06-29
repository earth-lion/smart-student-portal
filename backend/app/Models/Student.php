<?php

namespace App\Models;
use Laravel\Sanctum\HasApiTokens;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasApiTokens, HasFactory, Notifiable;


    protected $primaryKey = 'student_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'name',
        'email',
        'password',
        'national_id',
        'phone_number',
        'address',
        'department',
        'academic_year',
        'admission_year',
        'total_credits',
        'current_gpa',
        'major_id',
        'advisor_id',
        'seat_number',
        'semester',
        'financial_status',
        'image',
    ];

    protected $hidden = ['password'];

    public function major()
    {
        return $this->belongsTo(Major::class, 'major_id');
    }

    public function advisor()
    {
        return $this->belongsTo(Advisor::class, 'advisor_id');
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'student_courses', 'student_id', 'course_id');
    }
    public function registrations()
{
    return $this->hasMany(Registration::class, 'student_id', 'student_id');
}

    public function user()
{
    return $this->belongsTo(User::class);
}
public function comments()
{
    return $this->hasMany(Comment::class);
}
public function financialData()
    {
        return $this->hasOne(FinancialData::class, 'student_id','id');
    }
     public function resources()
    {
        return $this->belongsToMany(Resource::class, 'student_resource');
    }
    public function grades()
    {
        return $this->hasMany(Grade::class, 'student_id', 'student_id');
    }



}

