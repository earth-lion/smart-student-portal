<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UniversityEmail extends Model
{
    protected $primaryKey = 'email_id';

    protected $fillable = [ 'email', 'password','national_id_id'];

    protected $hidden = ['password'];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
    public function students()
    {
        return $this->hasMany(Student::class, 'university_emails', 'email');
    }
    public function nationalId()
{
    return $this->belongsTo(NationalId::class, 'national_id_id');
}


}

