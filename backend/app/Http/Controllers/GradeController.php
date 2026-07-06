<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class GradeController extends Controller
{
    public function showStudentGrades(Request $request)
    {
        $student = Auth::user();

        // التحقق من الصلاحيات
        if (!$student || !$student->student_id) {
            return response()->json([
                'message' => 'غير مصرح لك بعرض هذه البيانات.'
            ], 403);
        }

        // بناء الاستعلام الأساسي
        $query = Grade::with('course')
            ->where('student_id', $student->student_id)
            ->whereIn('course_id', function ($q) use ($student) {
                $q->select('course_id')
                    ->from('registrations')
                    ->where('student_id', $student->student_id);
            });

        // فلترة اختيارية بالسنة والفصل إذا تم إرسالهما
        if ($request->filled('academic_year')) {
            $query->where('academic_year', $request->academic_year);
        }
        if ($request->filled('semester')) {
            $query->where('semester', $request->semester);
        }

        $grades = $query->get();

        $gradesWithDetails = $grades->map(function ($grade) {
            return [
                'name'          => $grade->course->name ?? 'غير معروف',
                'course_name'   => $grade->course->name ?? 'غير معروف',
                'grade'         => $grade->grade,
                'evaluation'    => $this->getGradeLetter($grade->grade),
                'semester'      => $grade->semester,
                'academic_year' => $grade->academic_year,
                'credit_hours'  => $grade->course->total_credits ?? 3,
            ];
        });

        $gpa = $this->calculateGPA($grades);

        return response()->json([
            'grades' => $gradesWithDetails,
            'gpa'    => $gpa
        ]);
    }


// دالة لحساب الـ GPA بناءً على الدرجات
private function calculateGPA($grades)
{
    $totalPoints = 0;
    $totalHours = 0;

    foreach ($grades as $grade) {
        $gradeValue = $grade->grade;
        $hours = $grade->course->total_credits ?? 3;

        if ($gradeValue >= 90) {
            $points = 4.0;
            $letter = 'A+';
        } elseif ($gradeValue >= 85) {
            $points = 3.7;
            $letter = 'A';
        } elseif ($gradeValue >= 80) {
            $points = 3.3;
            $letter = 'B+';
        } elseif ($gradeValue >= 75) {
            $points = 3.0;
            $letter = 'B';
        } elseif ($gradeValue >= 70) {
            $points = 2.7;
            $letter = 'C+';
        } elseif ($gradeValue >= 65) {
            $points = 2.3;
            $letter = 'C';
        } elseif ($gradeValue >= 60) {
            $points = 2.0;
            $letter = 'D+';
        } elseif ($gradeValue >= 50) {
            $points = 1.7;
            $letter = 'D';
        } else {
            $points = 0.0;
            $letter = 'F';
        }

        $grade->grade_letter = $letter;
        $grade->credit_hours = $hours;

        $totalPoints += $points * $hours;
        $totalHours += $hours;
    }

    return $totalHours > 0 ? round($totalPoints / $totalHours, 2) : 0;
}
private function getGradeLetter($grade)
{
    if ($grade >= 90) return 'A+';
    if ($grade >= 85) return 'A';
    if ($grade >= 80) return 'B+';
    if ($grade >= 75) return 'B';
    if ($grade >= 70) return 'C+';
    if ($grade >= 65) return 'C';
    if ($grade >= 60) return 'D+';
    if ($grade >= 50) return 'D';
    return 'F';
}
// public function downloadPdf()
// {
//     $student = Auth::user();

//     // تأكدي من تحميل الكورسات المرتبطة
//     $grades = Grade::with('course')
//         ->where('student_id', $student->id)
//         ->get();

//     $gpa = $this->calculateGPA($grades);

//     $html = '<h2 style="text-align:right;">نتيجة الطالب: ' . e($student->name) . '</h2>';
//     $html .= '<table style="width:100%; border-collapse:collapse; direction:rtl;" border="1">';
//     $html .= '<thead><tr>
//                 <th>المادة</th>
//                 <th>الدرجة</th>
//                 <th>التقدير</th>
//                 <th>عدد الساعات</th>
//               </tr></thead><tbody>';

//     foreach ($grades as $grade) {
//         $courseName = $grade->course->name ?? 'غير متوفر';
//         $creditHours = $grade->course->credit_hours ?? '-';
//         $letter = $this->getGradeLetter($grade->grade);

//         $html .= '<tr>
//                     <td>' . e($courseName) . '</td>
//                     <td>' . $grade->grade . '</td>
//                     <td>' . $letter . '</td>
//                     <td>' . $creditHours . '</td>
//                   </tr>';
//     }

//     $html .= '</tbody></table>';
//     $html .= '<p style="text-align:right;"><strong>المعدل التراكمي GPA:</strong> ' . number_format($gpa, 2) . '</p>';

//     $pdf = Pdf::loadHTML($html);

//     return $pdf->download('student-grades.pdf');
// }

}
