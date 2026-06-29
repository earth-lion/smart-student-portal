<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResourceFile extends Model
{
    use HasFactory;

    // تحديد الجدول في قاعدة البيانات
    protected $table = 'resource_files';

    // الأعمدة القابلة للتعديل
    protected $fillable = [
        'resource_id', // يربط الملف بالـ Resource
        'file_path',   // مسار الملف
        'file_name',   // اسم الملف
        'file_type',   // نوع الملف (pdf, docx, txt, إلخ)
    ];

    // علاقة ResourceFile بـ Resource
   public function resource()
    {
        return $this->belongsTo(Resource::class, 'resource_id');
    }
}



