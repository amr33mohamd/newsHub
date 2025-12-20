<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArticleFilterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'source_id' => ['nullable', 'integer', 'exists:sources,id'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'from_date' => ['nullable', 'date', 'date_format:Y-m-d'],
            'to_date' => ['nullable', 'date', 'date_format:Y-m-d', 'after_or_equal:from_date'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'source_id.integer' => 'Source ID must be a valid number.',
            'source_id.exists' => 'The selected source does not exist.',
            'category_id.integer' => 'Category ID must be a valid number.',
            'category_id.exists' => 'The selected category does not exist.',
            'from_date.date' => 'From date must be a valid date.',
            'from_date.date_format' => 'From date must be in Y-m-d format (e.g., 2024-01-01).',
            'to_date.date' => 'To date must be a valid date.',
            'to_date.date_format' => 'To date must be in Y-m-d format (e.g., 2024-01-01).',
            'to_date.after_or_equal' => 'To date must be equal to or after the from date.',
            'per_page.integer' => 'Per page must be a valid number.',
            'per_page.min' => 'Per page must be at least 1.',
            'per_page.max' => 'Per page cannot exceed 100.',
        ];
    }
}
