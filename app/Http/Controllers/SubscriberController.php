<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SubscriberController extends Controller
{
    public function store(Group $group)
    {
        $validateData = request()->validate([
            'email' => ['required', 'email']
        ]);
        $isAlreadyExist = Subscriber::where('email', $validateData['email'])->exists();
        if ($isAlreadyExist) {
            return back()->with('warning', 'You already subscribed');
        }
        Subscriber::create([
            'group_id' => $group->id,
            'email' => $validateData['email']
        ]);

        return back()->with('success', 'Thanks For Subscribe.');
    }
}
