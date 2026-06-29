<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Advisor extends Model
{
    protected $primaryKey = 'advisor_id';

    protected $fillable = ['name', 'email', 'password', 'department'];

    protected $hidden = ['password'];

    public function students()
    {
        return $this->hasMany(Student::class, 'advisor_id');
    }
}
