<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NationalId extends Model
{
    use HasFactory;

    protected $table = 'national_ids'; // اسم الجدول

    protected $fillable = [
        'name',
        'national_id',
    ];
    public function universityEmail()
    {
        return $this->hasOne(UniversityEmail::class, 'national_id_id');
    }
}
