<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminGroupController extends Controller
{
    public function index()
    {
        return inertia('Admin/Groups/Index');
    }
}
