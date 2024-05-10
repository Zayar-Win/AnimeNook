<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;

class GroupAdminSettingController extends Controller
{
    public function index(Group $group)
    {
        return inertia('Group/Admin/Setting/Index', [
            'group' => $group
        ]);
    }
}
