<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Group;
use App\Models\Manga;
use Inertia\Inertia;

class GroupAdminBannerController extends Controller
{
    public function index(Group $group)
    {
        return Inertia::render('Group/Admin/Banners/Index', [
            'banners' => Banner::with('bannerable')
                ->where('group_id', $group->id)
                ->where('bannerable_type', Manga::class)
                ->orderBy('order', 'asc')
                ->get()
                ->map(function ($banner) {
                    $banner->banner_id = $banner->id;
                    unset($banner->id);

                    return $banner;
                }),
            'allBanners' => Manga::with('tags')
                ->where('group_id', $group->id)
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function update(Group $group)
    {
        $data = request()->validate([
            'banners' => 'required|array',
        ]);

        $updatedBannerIds = [];

        foreach ($data['banners'] as $index => $banner) {
            if (isset($banner['banner_id'])) {
                Banner::where('group_id', $group->id)
                    ->where('id', $banner['banner_id'])
                    ->update([
                        'order' => $index + 1,
                    ]);
                $updatedBannerIds[] = $banner['banner_id'];
            } else {
                $createdBanner = Banner::create([
                    'order' => $index + 1,
                    'group_id' => $group->id,
                    'bannerable_id' => $banner['bannerable']['id'],
                    'bannerable_type' => Manga::class,
                ]);
                $updatedBannerIds[] = $createdBanner->id;
            }
        }
        Banner::where('group_id', $group->id)
            ->whereNotIn('id', $updatedBannerIds)
            ->delete();

        return back()->with('success', 'Banners updated');
    }
}
