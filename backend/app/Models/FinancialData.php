<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinancialData extends Model
{
    use HasFactory;

    protected $table = 'financial_data';

    // تحديد الأعمدة القابلة للتحديث
    protected $fillable = [
        'student_id',
        'amount_due',
        'payment_status',
        'academic_year',
        'semester',
        'total_credits',
    ];

    /**
     * علاقة مع جدول الطلاب
     */
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id','id');
    }
}
