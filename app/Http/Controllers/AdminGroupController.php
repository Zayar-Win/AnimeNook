<?php

namespace App\Http\Controllers;

use App\helpers\Uploader;
use App\Models\Group;
use App\Models\Plan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminGroupController extends Controller
{
    public function __construct(public Uploader $uploader)
    {
    }
    public function index()
    {
        $groups = Group::latest()->paginate(10);
        return inertia('Admin/Groups/Index', [
            'groups' => $groups,
        ]);
    }

    public function create()
    {
        $plans = Plan::all();
        return inertia('Admin/Groups/GroupForm', [
            'type' => 'create',
            'plans' => $plans
        ]);
    }

    public function store()
    {
        $validatedData = request()->validate([
            'name' => 'required',
            'subdomain' => ['required', Rule::unique('groups', 'subdomain')],
            'logo' => ['required'],
            'plan_id' => ['required'],
            'start_date' => ['required'],
            'expire_date' => ['required']
        ]);
        if (gettype($validatedData['logo']) !== 'string') {
            $validatedData['logo'] =  $this->uploader->upload($validatedData['logo'], 'animeProfile');
        }
        Group::create($validatedData);
        return redirect(route('admin.groups'))->with('success', 'New Group created successful.');
    }

    public function edit(Group $group)
    {
        $plans = Plan::all();
        return inertia('Admin/Groups/GroupForm', [
            'group' => $group,
            'plans' => $plans,
            'type' => 'edit'
        ]);
    }

    public function update(Group $group)
    {
        $validatedData = request()->validate([
            'name' => ['required'],
            'subdomain' => ['required', Rule::unique('groups', 'subdomain')->ignore($group->id)],
            'logo' => ['required'],
            'plan_id' => ['required'],
            'start_date' => ['required'],
            'expire_date' => ['required'],
        ]);
        if (gettype($validatedData['logo']) !== 'string') {
            $validatedData['logo'] = $this->uploader->upload($validatedData['logo'], 'grouplogos');
        }
        $group->update($validatedData);
        return redirect(route('admin.groups'))->with('suceess', 'Group updated successful.');
    }

    public function delete(Group $group)
    {
        $group->delete();
        return back()->with('success', 'Group deleted successful.');
    }

    public function updateSubscription(Group $group)
    {
        $start_date = Carbon::now();
        $expire_date = Carbon::now()->addMonth(1);
        $group->update([
            'start_date' => $start_date,
            'expire_date' => $expire_date
        ]);
        return back()->with('success', 'New subscription unlocked');
    }
}
