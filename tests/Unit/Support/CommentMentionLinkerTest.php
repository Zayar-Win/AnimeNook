<?php

use App\Models\Group;
use App\Models\User;
use App\Support\CommentMentionLinker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    \Tests\Support\TestBootstrap::seedRoles();
});

test('mentionedUserIdsFromPlainText finds user by display name', function () {
    $group = Group::factory()->create();
    $alice = User::factory()->create([
        'group_id' => $group->id,
        'name' => 'Alice Wonder',
        'password' => 'password',
    ]);
    User::factory()->create([
        'group_id' => $group->id,
        'name' => 'Bob',
        'password' => 'password',
    ]);

    $ids = CommentMentionLinker::mentionedUserIdsFromPlainText(
        'Hey @Alice Wonder thanks',
        $group,
        null
    );

    expect($ids)->toContain($alice->id);
});

test('linkifyBodyHtml wraps mention in anchor when ids provided', function () {
    $group = Group::factory()->create();
    $user = User::factory()->create([
        'group_id' => $group->id,
        'name' => 'Carol',
        'password' => 'password',
    ]);

    $html = CommentMentionLinker::linkifyBodyHtml(
        '<p>Hi @Carol</p>',
        $group,
        [$user->id],
        null
    );

    expect($html)->toContain('comment-mention-link');
    expect($html)->toContain('@Carol');
});

test('linkifyBodyHtml returns original when no mentions', function () {
    $group = Group::factory()->create();
    $raw = '<p>No mentions here</p>';

    expect(CommentMentionLinker::linkifyBodyHtml($raw, $group, [], null))->toBe($raw);
});
