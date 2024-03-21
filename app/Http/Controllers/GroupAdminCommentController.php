<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Group;

class GroupAdminCommentController extends Controller
{
    public function index(Group $group){
        $comments = $group->comments()->with('commentable')->paginate(15);
        return inertia('Group/Admin/Comments/Index',[
            'comments' => $comments
        ]);
    }
    public function delete(Group $group, Comment $comment){
        $comment->delete();
        return back()->with('success','Comment deleted successful.');
    }
}
