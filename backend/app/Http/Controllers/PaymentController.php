<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FawryService;

class PaymentController extends Controller
{
    public function pay(Request $request, FawryService $fawry)
    {
        $user = $request->user();
        $amount = 150.00;
        $itemId = 'COURSE_FEES';
        $description = 'دفع رسوم كورس';

        $response = $fawry->initiatePayment($user, $amount, $description, $itemId);

        return response()->json($response);
    }

    public function payFees(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,student_id',
            'amount' => 'required|numeric|min:1',
        ]);

        try {
            \Illuminate\Support\Facades\DB::beginTransaction();

            $student = \App\Models\Student::findOrFail($request->student_id);
            $financialData = \App\Models\FinancialData::where('student_id', $student->student_id)->first();

            // Calculate courses fee
            $courses_fee = \App\Models\Registration::join('courses', 'registrations.course_id', '=', 'courses.course_id')
                ->where('registrations.student_id', $student->student_id)
                ->sum('courses.price');

            $payAmount = floatval($request->amount);

            if (!$financialData) {
                $financialData = \App\Models\FinancialData::create([
                    'student_id' => $student->student_id,
                    'total_amount' => $payAmount,
                    'paid_amount' => $payAmount,
                    'remaining_amount' => 0,
                ]);
            } else {
                $financialData->paid_amount += $payAmount;
                // Since total due includes courses fee, remaining tuition fee could drop below 0 if they pay courses fee, which is fine, we adjust remaining amount accordingly.
                $financialData->remaining_amount -= $payAmount;
                $financialData->save();
            }

            // Update student status based on overall remaining amount (remaining_amount + courses_fee)
            $totalRemaining = $financialData->remaining_amount + $courses_fee;
            if ($totalRemaining <= 0) {
                $student->financial_status = 'paid';
            } else {
                $student->financial_status = 'unpaid';
            }
            $student->save();

            \Illuminate\Support\Facades\DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'تمت عملية الدفع بنجاح وتحديث الرصيد المالي.',
                'financial_data' => [
                    'fixed_fee' => $financialData->total_amount,
                    'courses_fee' => $courses_fee,
                    'total_amount' => $financialData->total_amount + $courses_fee,
                    'paid_amount' => $financialData->paid_amount,
                    'total_due' => max(0, $totalRemaining),
                    'financial_status' => $student->financial_status,
                ]
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return response()->json(['message' => 'فشل معالجة الدفع: ' . $e->getMessage()], 500);
        }
    }

    public function fawryCallback(Request $request)
    {
        // Mock callback response to prevent route 500 error
        return response()->json([
            'status' => 'success',
            'message' => 'Fawry callback processed successfully'
        ]);
    }
}
