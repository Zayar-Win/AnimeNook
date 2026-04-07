<?php

test('non-admin member cannot access group admin dashboard', function () {
    ['group' => $group, 'user' => $user] = createGroupWithUser('user');

    $this->actingAs($user)
        ->get('/'.$group->subdomain.'/admin/dashboard')
        ->assertRedirect(route('group.home', ['group' => $group->subdomain]));
});

test('group admin can access admin dashboard when subscription active', function () {
    ['group' => $group, 'user' => $admin] = createGroupWithUser('admin');
    $group->update(['expire_date' => now()->addMonth()]);

    $this->actingAs($admin)
        ->get('/'.$group->subdomain.'/admin/dashboard')
        ->assertOk();
});
