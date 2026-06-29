<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;

class StudentResource extends Model
{

public function assignResourcesToStudent(Request $request)
{
    $studentId = $request->input('student_id');
    $resourceIds = $request->input('resource_id');

    // التحقق من وجود الطالب
    $student = Student::findOrFail($studentId);

    // ربط الطالب بالموارد
    foreach ($resourceIds as $resourceId) {
        $student->resources()->attach($resourceId); // استخدام علاقة many-to-many
    }

    return response()->json(['message' => 'Resources assigned successfully']);
}

}
