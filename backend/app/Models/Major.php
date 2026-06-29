<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// app/Models/Major.php
class Major extends Model
{
    protected $primaryKey = 'major_id';

    protected $fillable = ['major_name', 'description'];

    public function students()
    {
        return $this->hasMany(Student::class, 'major_id');
    }

    public function courses()
    {
        return $this->hasMany(Course::class, 'major_id');
    }
}
