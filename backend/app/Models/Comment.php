<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['student_id', 'content','national_id'];

    public function student()
{
    return $this->belongsTo(Student::class);
}

}
