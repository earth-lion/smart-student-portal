<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Schedule;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $query = Schedule::with('course');

        if ($request->has('year_id')) {
            $query->where('year_id', $request->year_id);
        }
        if ($request->has('semester_id')) {
            $query->where('semester_id', $request->semester_id);
        }
        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $schedules = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $schedules
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|integer',
            'type' => 'required|in:lecture,section',
            'day' => 'required|string|max:255',
            'start_time' => 'required',
            'end_time' => 'required',
            'year_id' => 'required|integer',
            'semester_id' => 'required|integer',
            'department_id' => 'required|integer',
        ]);

        $schedule = Schedule::create([
            'course_id' => $validated['course_id'],
            'type' => $validated['type'],
            'day' => $validated['day'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'year_id' => $validated['year_id'],
            'semester_id' => $validated['semester_id'],
            'department_id' => $validated['department_id'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'تم إضافة الجدول الدراسي بنجاح',
            'data' => $schedule->load('course')
        ], 201);
    }
}
