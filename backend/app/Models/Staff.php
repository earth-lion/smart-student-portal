<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Staff extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'staff';

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone_number',
        'national_id',
        'address',
        'job_title',
        'department',
        'hire_date',
        'salary',
    ];

    protected $hidden = ['password'];

    public function user()
    {
        return $this->hasOne(User::class, 'staff_id');
    }
}
