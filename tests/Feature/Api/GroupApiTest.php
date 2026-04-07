<?php

use App\Models\Anime;
use App\Models\Group;
use App\Models\Status;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('group search returns json for animes and mangas', function () {
    $group = Group::factory()->create();
    $status = Status::factory()->create();
    Anime::factory()->create([
        'group_id' => $group->id,
        'status_id' => $status->id,
        'name' => 'UniqueSearchTitle',
    ]);

    $response = $this->getJson('/api/'.$group->subdomain.'/search?search=UniqueSearchTitle');

    $response->assertOk();
    $response->assertJsonStructure(['animes', 'mangas']);
});

test('views store accepts valid payload for anime', function () {
    Storage::fake('local');

    $group = Group::factory()->create();
    $status = Status::factory()->create();
    $anime = Anime::factory()->create(['group_id' => $group->id, 'status_id' => $status->id]);

    $response = $this->postJson('/api/'.$group->subdomain.'/views/store', [
        'viewable_id' => $anime->id,
        'viewable_type' => 'anime',
    ]);

    $response->assertOk();
});

test('guest cannot list notifications', function () {
    $group = Group::factory()->create();

    $this->getJson('/api/'.$group->subdomain.'/notis')->assertUnauthorized();
});

test('authenticated user can list notifications', function () {
    ['group' => $group, 'user' => $user] = createGroupWithUser();

    $this->actingAs($user)
        ->getJson('/api/'.$group->subdomain.'/notis')
        ->assertOk()
        ->assertJsonStructure(['notifications']);
});

test('mention suggestions require authentication', function () {
    $group = Group::factory()->create();

    $this->getJson('/api/'.$group->subdomain.'/users/mention-suggestions?q=a')->assertUnauthorized();
});

test('authenticated user receives mention suggestions', function () {
    ['group' => $group, 'user' => $user] = createGroupWithUser();
    User::factory()->create([
        'group_id' => $group->id,
        'name' => 'Zeta Mention',
        'password' => 'password',
    ]);

    $this->actingAs($user)
        ->getJson('/api/'.$group->subdomain.'/users/mention-suggestions?q=Zeta')
        ->assertOk()
        ->assertJsonStructure(['users']);
});

test('images store accepts uploaded file', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->image('photo.jpg');

    $response = $this->post('/api/images/store', [
        'image' => $file,
    ]);

    $response->assertOk();
    $response->assertJsonStructure(['image']);
});
