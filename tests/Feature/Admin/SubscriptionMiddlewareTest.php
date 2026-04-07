<?php

test('group admin is blocked when group subscription expired', function () {
    ['group' => $group, 'user' => $admin] = createGroupWithUser('admin');
    $group->update(['expire_date' => now()->subDay()]);

    $this->actingAs($admin)
        ->from('/'.$group->subdomain.'/admin/animes')
        ->get('/'.$group->subdomain.'/admin/dashboard')
        ->assertRedirect()
        ->assertSessionHas('warning');
});
