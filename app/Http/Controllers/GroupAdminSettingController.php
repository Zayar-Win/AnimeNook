<?php

namespace App\Http\Controllers;

use App\helpers\Uploader;
use App\Models\Group;
use App\Models\GroupSetting;
use Illuminate\Http\Request;

class GroupAdminSettingController extends Controller
{

    public function __construct(public Uploader $uploader)
    {
    }

    public function index(Group $group)
    {
        return inertia('Group/Admin/Setting/Index', [
            'group' => $group
        ]);
    }

    public function update(Group $group, GroupSetting $setting)
    {
        $validateData = request()->validate(
            [
                'name' => 'required',
                'primary_color' => 'required',
                'social_links' => 'required',
                'logo' => 'required'
            ]
        );
        if (gettype($validateData['logo']) !== 'string') {
            $validateData['logo'] = $this->uploader->upload($validateData['logo'], 'groups');
        }
        $group->update([
            'name' => $validateData['name'],
            'logo' => $validateData['logo']
        ]);
        $setting->update([
            'primary_color' => $validateData['primary_color'],
            'social_links' => $validateData['social_links']
        ]);
        return back()->with('success', 'Group setting updated');
    }
}
