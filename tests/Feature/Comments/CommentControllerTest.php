<?php

use App\Models\Anime;
use App\Models\Comment;
use App\Models\Group;
use App\Models\Manga;
use App\Models\Status;
use App\Models\User;
use App\Notifications\AdminNewCommentNotification;
use Illuminate\Support\Facades\Notification;

test('guest cannot create comment', function () {
    $group = Group::factory()->create();
    $status = Status::factory()->create();
    $anime = Anime::factory()->create(['group_id' => $group->id, 'status_id' => $status->id]);

    $this->post('/'.$group->subdomain.'/comments/create', [
        'comment' => 'Hello world comment',
        'animeId' => $anime->id,
    ])->assertRedirect();
});

test('authenticated user can create comment on anime', function () {
    Notification::fake();

    ['group' => $group, 'user' => $user] = createGroupWithUser();
    $status = Status::factory()->create();
    $anime = Anime::factory()->create(['group_id' => $group->id, 'status_id' => $status->id]);

    $this->actingAs($user)
        ->from('/'.$group->subdomain.'/animes/'.$anime->slug)
        ->post('/'.$group->subdomain.'/comments/create', [
            'comment' => 'Nice episode!',
            'animeId' => $anime->id,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('comments', [
        'user_id' => $user->id,
        'group_id' => $group->id,
        'commentable_id' => $anime->id,
        'commentable_type' => Anime::class,
    ]);
});

test('comment create validates body and requires anime or manga', function () {
    ['group' => $group, 'user' => $user] = createGroupWithUser();

    $this->actingAs($user)
        ->post('/'.$group->subdomain.'/comments/create', [
            'comment' => 'ab',
            'animeId' => null,
            'mangaId' => null,
        ])
        ->assertSessionHasErrors(['comment']);
});

test('mentioned_user_ids must belong to same group', function () {
    ['group' => $group, 'user' => $author] = createGroupWithUser();
    $otherGroup = Group::factory()->create();
    $intruder = User::factory()->create(['group_id' => $otherGroup->id]);
    $status = Status::factory()->create();
    $anime = Anime::factory()->create(['group_id' => $group->id, 'status_id' => $status->id]);

    $this->actingAs($author)
        ->post('/'.$group->subdomain.'/comments/create', [
            'comment' => 'Hi there',
            'animeId' => $anime->id,
            'mentioned_user_ids' => [$intruder->id],
        ])
        ->assertSessionHasErrors(['mentioned_user_ids.0']);
});

test('user cannot update another users comment', function () {
    ['group' => $group, 'user' => $owner] = createGroupWithUser();
    ['user' => $other] = createGroupWithUser();
    $other->update(['group_id' => $group->id]);

    $status = Status::factory()->create();
    $anime = Anime::factory()->create(['group_id' => $group->id, 'status_id' => $status->id]);
    $comment = Comment::create([
        'user_id' => $owner->id,
        'group_id' => $group->id,
        'body' => 'Original',
        'commentable_id' => $anime->id,
        'commentable_type' => Anime::class,
    ]);

    $this->actingAs($other)
        ->post('/'.$group->subdomain.'/comments/update', [
            'comment' => 'Hacked',
            'animeId' => $anime->id,
            'commentId' => $comment->id,
        ])
        ->assertSessionHas('warn');

    expect($comment->fresh()->body)->toBe('Original');
});

test('user cannot delete another users comment', function () {
    ['group' => $group, 'user' => $owner] = createGroupWithUser();
    ['user' => $other] = createGroupWithUser();
    $other->update(['group_id' => $group->id]);

    $status = Status::factory()->create();
    $anime = Anime::factory()->create(['group_id' => $group->id, 'status_id' => $status->id]);
    $comment = Comment::create([
        'user_id' => $owner->id,
        'group_id' => $group->id,
        'body' => 'Mine',
        'commentable_id' => $anime->id,
        'commentable_type' => Anime::class,
    ]);

    $this->actingAs($other)
        ->post('/'.$group->subdomain.'/comments/'.$comment->id.'/delete', [])
        ->assertSessionHas('warn');

    expect(Comment::query()->whereKey($comment->id)->exists())->toBeTrue();
});

test('notifies group admins on new comment', function () {
    Notification::fake();

    ['group' => $group, 'user' => $author] = createGroupWithUser();
    $adminRole = \App\Models\Role::query()->where('name', 'admin')->firstOrFail();
    $admin = User::factory()->create([
        'group_id' => $group->id,
        'role_id' => $adminRole->id,
        'password' => 'password',
    ]);

    $status = Status::factory()->create();
    $anime = Anime::factory()->create(['group_id' => $group->id, 'status_id' => $status->id]);

    $this->actingAs($author)
        ->post('/'.$group->subdomain.'/comments/create', [
            'comment' => 'Needs moderation?',
            'animeId' => $anime->id,
        ])
        ->assertRedirect();

    Notification::assertSentTo($admin, AdminNewCommentNotification::class);
});
