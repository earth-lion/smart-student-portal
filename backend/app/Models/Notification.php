<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $primaryKey = 'notification_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'student_id',
        'title',
        'message',
        'sent_at',
        'notification_date',
        'is_read',
        'category',
        'is_favorite',
        'is_deleted',
        'is_archived',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'is_favorite' => 'boolean',
        'is_deleted' => 'boolean',
        'is_archived' => 'boolean',
        'notification_date' => 'datetime',
        'sent_at' => 'datetime',
    ];



    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    // Scope to get notifications for a specific student
    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId)->where('is_deleted', false);
    }

    // Scope to get unread notifications
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    // Scope to get favorite notifications
    public function scopeFavorites($query)
    {
        return $query->where('is_favorite', true);
    }
    public function scopeArchived($query)
    {
        return $query->where('is_archived', true);
    }

    // سكوب لعرض الإشعارات غير المؤرشفة
    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }
}

