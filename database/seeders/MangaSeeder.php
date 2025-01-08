<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Manga;
use App\Models\Season;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MangaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public $mangaThumbnails = [
        'https://lzd-img-global.slatic.net/g/p/c4689550c14324d259fae2678a0284dd.jpg_720x720q80.jpg_.webp',
        'https://jumpg-assets.tokyo-cdn.com/secure/title/100274/title_thumbnail_portrait_list/312883.jpg?hash=ib4amk7bLZFtSTIA73GSQg&expires=2145884400',
        'https://gagadget.com/media/uploads/maxresdefault_T3GG3Ht.jpg',
        'https://i.ytimg.com/vi/rRGgHrqViFY/hqdefault.jpg',
        'https://w0.peakpx.com/wallpaper/437/944/HD-wallpaper-top-35-best-one-piece-iphone-one-piece-anime-thumbnail.jpg',
        'https://wallpapers.com/images/hd/black-clover-4k-animated-poster-ird08xd7nkl917op.jpg',
        'https://i.pinimg.com/736x/d0/68/4f/d0684f87fffcf2eb21cd6942fa47537b.jpg',
        'https://resize.cdn.otakumode.com/full/u/3ae3a2e53fd847639291f45a178c1fbe.jpg',
        'https://m.media-amazon.com/images/I/81Y3J1ghwrL._AC_UF1000,1000_QL80_.jpg',
        'https://images.hdqwalls.com/download/yato-noragami-anime-b2-1125x2436.jpg'
    ];

    public function createChapters($manga)
    {
        $season = Season::factory()->create([
            'seasonable_id' => $manga->id,
            'seasonable_type' => Manga::class
        ]);
        for ($i = 0; $i < 10; $i++) {
            Chapter::factory()->create([
                'thumbnail' => 'https://staticg.sportskeeda.com/editor/2023/09/97d5f-16951446392189.png?w=640',
                'chapterable_id' => $manga->id,
                'chapterable_type' => Manga::class,
                'season_id' => $season->id,
                'chapter_number' => $i + 1,
                'chapter_link' => 'https://mangadex.org/chapter/ede6cb51-5307-4499-9df2-333705eed2c1/12',
                'ouo_chapter_link' => 'https://mangadex.org/chapter/ede6cb51-5307-4499-9df2-333705eed2c1/12',
                'title' => 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit, deleniti.',
                'description' => ' Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero beatae quo tempora nemo repellendus velit ad eaque quidem esse facilis ea ratione earum maxime animi, debitis deleniti quia dolorum mollitia.'
            ]);
        }
    }
    public function run(): void
    {
        for ($i = 0; $i < 10; $i++) {
            $manga = Manga::factory()->create([
                'thumbnail' => $this->mangaThumbnails[$i]
            ]);

            $this->createChapters($manga);
        }
    }
}
