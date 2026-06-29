<?php

namespace App\Http\Controllers;

use App\Models\FinancialData;
use Illuminate\Http\Request;

class FinancialDataController extends Controller
{
    public function index()
    {
        return FinancialData::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'academic_year_level' => 'required|string',
            'semester' => 'required|string',
            'department' => 'required|string',
            'fixed_fee' => 'required|numeric',
        ]);

        return FinancialData::create($data);
    }

    public function update(Request $request, $id)
    {
        $data = FinancialData::findOrFail($id);

        $validated = $request->validate([
            'fixed_fee' => 'required|numeric',
        ]);

        $data->update($validated);
        return $data;
    }

    public function destroy($id)
    {
        FinancialData::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
