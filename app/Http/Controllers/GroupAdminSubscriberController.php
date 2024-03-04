<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GroupAdminSubscriberController extends Controller
{
    public function index(Group $group){
        $subscribers = $group->subscribers()->latest()->paginate(15);
        return inertia('Group/Admin/Subscribers/Index',[
            'subscribers' => $subscribers
        ]);
    }

    public function edit(Group $group,Subscriber $subscriber){
        return inertia('Group/Admin/Subscribers/SubscriberForm',[
            'subscriber' => $subscriber,
        ]);
    }

    public function update(Group $group,Subscriber $subscriber){
        $validatedData = request()->validate([
            'email' => ['required','email',Rule::unique('subscribers','email')->ignore($subscriber->id)]
        ]);
        $subscriber->update($validatedData);
        return redirect(route('group.admin.subscribers'))->with('success','Subscriber updated Successful.');
    }

    public function delete(Group $group,Subscriber $subscriber){
        $subscriber->delete();
        return back()->with('success','Subscriber Deleted Successful.');
    }
}
