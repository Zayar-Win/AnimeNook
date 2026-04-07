<?php

namespace App\Http\Requests;

use App\Models\Group;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CommentRequest extends FormRequest
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
        $group = $this->route('group');
        $groupId = $group instanceof Group ? $group->id : null;

        return [
            'comment' => ['required', 'string', 'min:3', 'max:10000'],
            'animeId' => ['nullable', 'numeric', 'required_without:mangaId'],
            'mangaId' => ['nullable', 'numeric', 'required_without:animeId'],
            'commentId' => ['nullable', 'numeric'],
            'mentioned_user_ids' => ['nullable', 'array', 'max:20'],
            'mentioned_user_ids.*' => [
                'numeric',
                Rule::exists('users', 'id')->where(fn ($q) => $q->where('group_id', $groupId)),
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('mentioned_user_ids') && is_array($this->input('mentioned_user_ids'))) {
            $ids = array_values(array_filter(array_map(
                static fn ($v) => (int) $v,
                $this->input('mentioned_user_ids', [])
            ), static fn (int $id) => $id > 0));

            $this->merge(['mentioned_user_ids' => $ids]);
        }
    }
}
