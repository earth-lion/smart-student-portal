<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterStudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
{
    return [
        'name' => 'required|string|max:100',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|min:6|confirmed',
        'national_id' => 'required|digits:14|unique:students,national_id',
    ];
}

public function messages()
{
    return [
        'email.required' => 'البريد الإلكتروني مطلوب',
        'email.unique' => 'البريد مستخدم بالفعل',
        'password.confirmed' => 'كلمة المرور غير متطابقة',
        'national_id.digits' => 'الرقم القومي يجب أن يكون 14 رقمًا',
    ];
}

}
