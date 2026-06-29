<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NationalId;

class CredentialLookupController extends Controller
{
    public function lookup(Request $request)
    {
        $request->validate([
            'national_id' => 'required|string|size:14',
        ]);

        $nationalIdVal = $request->input('national_id');

        // Query the national_ids table along with its relation universityEmail
        $nationalId = NationalId::where('national_id', $nationalIdVal)->with('universityEmail')->first();

        if ($nationalId && $nationalId->universityEmail) {
            // Find role/type by looking at students/staff tables
            $roleLabel = 'عضو جامعة';
            $type = 'unknown';

            $isStudent = \App\Models\Student::where('national_id', $nationalIdVal)->exists();
            if ($isStudent) {
                $roleLabel = 'طالب';
                $type = 'student';
            } else {
                $isStaff = \App\Models\Staff::where('national_id', $nationalIdVal)->exists();
                if ($isStaff) {
                    $roleLabel = 'موظف / عضو هيئة تدريس';
                    $type = 'staff';
                }
            }

            return response()->json([
                'found'      => true,
                'type'       => $type,
                'name'       => $nationalId->name,
                'email'      => $nationalId->universityEmail->email,
                'password'   => $nationalId->universityEmail->password, // Returns the plain text initial password
                'role_label' => $roleLabel,
            ]);
        }

        return response()->json([
            'found'   => false,
            'message' => 'لم يتم العثور على أي حساب مرتبط بهذا الرقم القومي. يرجى مراجعة شؤون الطلاب.',
        ], 404);
    }
}
