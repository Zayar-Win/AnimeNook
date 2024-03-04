<?php

namespace App\Http\Controllers;

use App\helpers\Uploader;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

use function PHPSTORM_META\map;

class GroupAdminUserController extends Controller
{
    public function __construct(public Uploader $uploader)
    {
        
    }
    public function index(){
        $users = User::latest()->paginate(10);
        return inertia('Group/Admin/Users/Index',[
            'users' => $users
        ]);
    }

    public function create(){
        return inertia('Group/Admin/Users/UserForm',[
            'type' => 'create'
        ]);
    }
    public function edit(Group $group,User $user){
        $user->makeVisible(['password']);
        return inertia('Group/Admin/Users/UserForm',[
            'type' => 'edit',
            'user' =>$user
        ]);
    }

    public function update(Group $group,User $user){
        $validatedData = request()->validate([
            'name' => 'required',
            'email' => ['required','email',Rule::unique('users')->ignore($user->id)],
            'profile_picture' => ['required'],
            'role_id' => ['required'],
            'type' => ['required','in:free,paid'],
            'password' => ['required','min:6','max:20']
        ]);
        if(gettype($validatedData['profile_picture']) !== 'string'){
            $validatedData['profile_picture'] = $this->uploader->upload($validatedData['profile_picture'],'amineProfile');
        }
        $user->update($validatedData);
        return back()->with('success','User Update successful.');
    }

    public function delete(Group $group,User $user){
        $user->delete();
        return back()->with('success','User Delete Successful');
    }

    public function store(Group $group ,Request $request){
        $validatedData = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'profile_picture' => 'nullable',
            'role_id' => 'required',
            'type' => 'required|in:free,paid',
            'password' => 'required|min:6|max:20'
        ]);
        $validatedData['group_id'] = $group->id;
        $validatedData['password'] = bcrypt($validatedData['password']);
        if(gettype($validatedData['profile_picture']) !== 'string'){
            $validatedData['profile_picture'] =  $this->uploader->upload($validatedData['profile_picture'],'animeProfile');
        }
        User::create($validatedData);
        return redirect(route('group.admin.users'))->with('success','User Created Successful.');
    }
}
