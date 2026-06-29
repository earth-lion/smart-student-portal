<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // دالة خاصة للتحقق من student_id
    private function getValidatedStudentId(Request $request)
    {
        $studentId = $request->query('student_id');

        if (!$studentId) {
            abort(response()->json(['message' => 'Student ID is required'], 400));
        }

        return $studentId;
    }

    // عرض الإشعارات للطالب الحالي (العامة + الخاصة به)
    public function showNotifications(Request $request)
    {
        $studentId = $this->getValidatedStudentId($request);

        $notifications = Notification::where(function ($query) use ($studentId) {
            $query->where('category', 'general')
                  ->orWhere('student_id', $studentId);
        })->where('is_archived', false)
          ->orderBy('created_at', 'desc')
          ->get();

        return response()->json($notifications);
    }

    // عرض الإشعارات المفضلة للطالب
    public function showFavorites(Request $request)
    {
        $studentId = $this->getValidatedStudentId($request);

        $favorites = Notification::where('student_id', $studentId)
                                 ->where('is_favorite', true)
                                 ->where('is_archived', false)
                                 ->orderBy('created_at', 'desc')
                                 ->get();

        return response()->json($favorites);
    }

    // حذف إشعار
    public function deleteNotification($id)
    {
        $notification = Notification::find($id);

        if ($notification) {
            $notification->delete();
            return response()->json(['message' => 'Notification deleted successfully']);
        }

        return response()->json(['message' => 'Notification not found'], 404);
    }

    // تحديد/إلغاء مفضلة
    public function toggleFavorite($id)
    {
        $notification = Notification::find($id);

        if ($notification) {
            $notification->update(['is_favorite' => !$notification->is_favorite]);
            return response()->json(['message' => 'Notification favorite status updated']);
        }

        return response()->json(['message' => 'Notification not found'], 404);
    }

    // تحديد الإشعار كمقروء
    public function markAsRead($id)
    {
        $notification = Notification::find($id);

        if ($notification) {
            $notification->update(['is_read' => true]);
            return response()->json(['message' => 'Notification marked as read']);
        }

        return response()->json(['message' => 'Notification not found'], 404);
    }

    // أرشفة إشعار
    public function archiveNotification($id)
    {
        $notification = Notification::find($id);

        if ($notification) {
            $notification->update(['is_archived' => true]);
            return response()->json(['message' => 'Notification archived successfully']);
        }

        return response()->json(['message' => 'Notification not found'], 404);
    }

    // عرض المؤرشفة
    public function showArchivedNotifications(Request $request)
    {
        $studentId = $this->getValidatedStudentId($request);

        $archivedNotifications = Notification::where('student_id', $studentId)
                                             ->where('is_archived', true)
                                             ->orderBy('created_at', 'desc')
                                             ->get();

        return response()->json($archivedNotifications);
    }

    // عرض غير المؤرشفة
    public function showNonArchivedNotifications(Request $request)
    {
        $studentId = $this->getValidatedStudentId($request);

        $nonArchivedNotifications = Notification::where(function ($query) use ($studentId) {
            $query->where('category', 'general')
                  ->orWhere('student_id', $studentId);
        })->where('is_archived', false)
          ->orderBy('created_at', 'desc')
          ->get();

        return response()->json($nonArchivedNotifications);
    }
}
