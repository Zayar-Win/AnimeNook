<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\Banner;
use App\Models\Group;
use App\Models\Manga;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GroupAdminBannerController extends Controller
{
    public function index()
    {
        return Inertia::render('Group/Admin/Banners/Index', [
            'banners' => Banner::with('bannerable')->orderBy('order', 'asc')->get()->map(function ($banner) {
                $banner->banner_id = $banner->id;
                unset($banner->id);
                return $banner;
            }),
            'allBanners' => [...Anime::with('tags')->get(), ...Manga::with('tags')->get()]
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
                Banner::find($banner['banner_id'])->update([
                    'order' => $index + 1
                ]);
                $updatedBannerIds[] = $banner['banner_id'];
            } else {
                $createdBanner = Banner::create([
                    'order' => $index + 1,
                    'group_id' => $group->id,
                    'bannerable_id' => $banner['bannerable']['id'],
                    'bannerable_type' => $banner['bannerable']['type'] == 'anime' ? Anime::class : Manga::class
                ]);
                $updatedBannerIds[] = $createdBanner->id;
            }
        }
        Banner::whereNotIn('id', $updatedBannerIds)->delete();

        return back()->with('success', 'Banners updated');
    }
}
