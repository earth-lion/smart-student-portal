<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GPAController extends Controller
{
    public function calculate(Request $request)
    {
        $data = $request->validate([
            'courses' => 'required|array|min:1',
            'courses.*.name' => 'nullable|string',
            'courses.*.grade' => 'required|numeric|min:0|max:100',
            'courses.*.hours' => 'required|numeric|min:1',
        ]);

        $totalPoints = 0;
        $totalHours = 0;

        foreach ($data['courses'] as $course) {
            $grade = $course['grade'];
            $hours = $course['hours'];

            $point = $this->getGradePoint($grade);
            $totalPoints += $point * $hours;
            $totalHours += $hours;
        }

        $gpa = $totalHours > 0 ? round($totalPoints / $totalHours, 2) : 0;

        return response()->json([
            'gpa' => $gpa
        ]);
    }

    private function getGradePoint($grade)
{
    if ($grade >= 97) return 4.0;
    if ($grade >= 93) return 3.9;
    if ($grade >= 90) return 3.7;
    if ($grade >= 87) return 3.5;
    if ($grade >= 85) return 3.3;
    if ($grade >= 82) return 3.0;
    if ($grade >= 80) return 2.7;
    if ($grade >= 77) return 2.5;
    if ($grade >= 75) return 2.3;
    if ($grade >= 72) return 2.0;
    if ($grade >= 70) return 1.7;
    if ($grade >= 67) return 1.5;
    if ($grade >= 65) return 1.3;
    if ($grade >= 60) return 1.0;
    return 0.0;
}

}
