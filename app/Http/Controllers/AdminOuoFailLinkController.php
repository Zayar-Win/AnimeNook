<?php

namespace App\Http\Controllers;

use App\Models\OuoFailLink;
use Illuminate\Http\Request;

class AdminOuoFailLinkController extends Controller
{
    public function index()
    {
        $failLinks = OuoFailLink::with(['group', 'chapter.chapterable'])->paginate(20);
        return inertia('Admin/OuoFailLinks/Index', $failLinks);
    }
}
