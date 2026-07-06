<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinancialData extends Model
{
    use HasFactory;

    protected $table = 'financial_data';

    protected $fillable = [
        'student_id',
        'total_amount',
        'paid_amount',
        'remaining_amount',
    ];

    /**
     * علاقة مع جدول الطلاب
     */
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id','student_id');
    }
}
