<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Student;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'email' => 'required|email',
                'national_id' => 'required|digits:14',
                'content' => 'required|string|max:1000',
            ]);

            $student = Student::where('email', $validatedData['email'])
                              ->where('national_id', $validatedData['national_id'])
                              ->first();

            if (!$student) {
                return response()->json([
                    'message' => 'لا يوجد طالب بهذه البيانات'
                ], 404);
            }

            $comment = Comment::create([
                'student_id' => $student->student_id,
                'content' => $validatedData['content'],
            ]);

            return response()->json([
                'message' => 'تم حفظ التعليق بنجاح',
                'comment' => $comment
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'حدث خطأ أثناء معالجة الطلب',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        try {
            $comments = Comment::with('student')->latest()->get();
            return response()->json([
                'status' => 'success',
                'data' => $comments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'حدث خطأ أثناء جلب الرسائل',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $comment = Comment::findOrFail($id);
            $comment->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'تم حذف الرسالة بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'حدث خطأ أثناء حذف الرسالة',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
