<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ResourceController extends Controller
{
    //  عرض المواد الدراسية بناءً على القسم والعام الدراسي
    public function index(Request $request)
    {
        $query = Resource::with('course');

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }
        if ($request->has('academic_year')) {
            $query->where('academic_year', $request->academic_year);
        }

        $resources = $query->latest()->get();

        return response()->json($resources);
    }


public function getFilesByResource($resource_id)
{
    $resource = Resource::with('files')->findOrFail($resource_id);

    $files = $resource->files->map(function ($file) {
        return [
            'id'         => $file->id,
            'resource_id'=> $file->resource_id,
            'file_name'  => $file->file_name,
            'file_type'  => $file->file_type,
            'file_url'   => Storage::url('uploads/' . basename($file->file_path)),
        ];
    });

    return response()->json([
        'resource_name' => $resource->resource_name,
        'files' => $files
    ]);
}

public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'instructor_name' => 'nullable|string|max:255',
        'resource_type' => 'required|string|max:255', // 'محاضرات' | 'كتب' | 'تمارين وعملي'
        'course_id' => 'required|integer',
        'department_id' => 'nullable|integer',
        'academic_year' => 'required|integer',
        'file' => 'nullable|file|mimes:pdf,docx,doc,pptx,ppt,txt,zip|max:10240', // max 10MB
    ]);

    $resource = Resource::create([
        'title' => $validated['title'],
        'instructor_name' => $validated['instructor_name'] ?? 'هيئة التدريس',
        'resource_type' => $validated['resource_type'],
        'course_id' => $validated['course_id'],
        'department_id' => $validated['department_id'] ?? 2,
        'academic_year' => $validated['academic_year'],
        'file_path' => null,
    ]);

    if ($request->hasFile('file')) {
        $file = $request->file('file');
        // Store file in storage/app/public/uploads
        $path = $file->store('uploads', 'public');
        
        \App\Models\ResourceFile::create([
            'resource_id' => $resource->resource_id,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $file->getClientOriginalExtension(),
        ]);
        
        // Also update file_path on Resource itself for compatibility
        $resource->update([
            'file_path' => $path
        ]);
    }

    return response()->json([
        'status' => 'success',
        'message' => 'تم إضافة المصدر التعليمي بنجاح',
        'data' => $resource->load('files')
    ], 201);
}

}
