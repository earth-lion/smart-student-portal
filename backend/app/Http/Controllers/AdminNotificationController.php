<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class AdminNotificationController extends Controller
{
    public function sendnotification(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'message' => 'required|string',
            'category' => 'required|in:general,personal',
            'student_id' => 'nullable|exists:students,student_id',
            'notification_date' => 'nullable|date'
        ]);

        // التحقق من أن student_id موجود إذا كانت الفئة شخصية
        if ($data['category'] === 'personal' && empty($data['student_id'])) {
            return response()->json([
                'message' => 'يجب تحديد الطالب عند إرسال إشعار شخصي.'
            ], 422);
        }

        $notification = Notification::create([
            'title' => $data['title'],
            'message' => $data['message'],
            'category' => $data['category'],
            'student_id' => $data['category'] === 'personal' ? $data['student_id'] : null,
            'notification_date' => $data['notification_date'] ?? now(),
            'sent_at' => now(),
        ]);

        return response()->json([
            'message' => $data['category'] === 'personal'
                ? 'تم إرسال الإشعار إلى الطالب المحدد.'
                : 'تم إرسال إشعار عام لجميع الطلاب.',
            'notification' => $notification
        ], 201);
    }
}
