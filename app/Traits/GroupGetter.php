<?php

namespace App\Traits;

use App\Models\Group;

trait GroupGetter{
    public function group(){
        $group = request()->route("group");
        if(gettype($group) == "string"){
            $group = Group::where('subdomain',$group)->first();
        }
        return $group;
    
    }
}