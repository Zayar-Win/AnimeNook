<?php

namespace Database\Seeders;

use App\Models\Anime;
use App\Models\Chapter;
use App\Models\Season;
use Database\Factories\AnimeFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnimeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public $animeSerieThumbnails = [
        'https://assets-prd.ignimgs.com/2022/08/08/top-anime-like-demon-slayer-thumbnail-1659988718825.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFLM5BawHGupYUSPVljw0tLAm042RwmMIqb89yFq15Frg2ETgVPed7g7i9qsf0zNwpzhM&usqp=CAU',
        'https://cdn.animenewsnetwork.com/thumbnails/crop900x350/video/category/62/key_art_naruto.jpg',
        'https://static1.colliderimages.com/wordpress/wp-content/uploads/2022/04/Vinland-Saga-Thorfinn-holding-dagger-Cropped-Cropped.jpg?q=50&fit=crop&w=1500&dpr=1.5',
        'https://static1.colliderimages.com/wordpress/wp-content/uploads/2022/03/Kakegurui-Yumeko-Cropped.jpg?q=50&fit=crop&w=1500&dpr=1.5',
        'https://static1.colliderimages.com/wordpress/wp-content/uploads/2022/06/ending4a-Cropped.jpg?q=50&fit=crop&w=1500&dpr=1.5',
        'https://static1.colliderimages.com/wordpress/wp-content/uploads/2022/11/castlevania.jpg?q=50&fit=crop&w=1500&dpr=1.5',
        'https://static1.colliderimages.com/wordpress/wp-content/uploads/2022/12/pokemon-ash-ketchum-pikachu-last-episode.jpg?q=50&fit=crop&w=1500&dpr=1.5',
        'https://static1.colliderimages.com/wordpress/wp-content/uploads/2022/06/my-hero-academia-season-5-deku-todoroki-bakugo-1273746-Cropped.jpg?q=50&fit=crop&w=1500&dpr=1.5'
    ];

    public function createChapters($anime)
    {
        $season = Season::factory()->create([
            'seasonable_id' => $anime->id,
            'seasonable_type' => Anime::class
        ]);
        for ($i = 0; $i < 10; $i++) {
            Chapter::factory()->create([
                'thumbnail' => 'https://staticg.sportskeeda.com/editor/2023/09/97d5f-16951446392189.png?w=640',
                'chapterable_id' => $anime->id,
                'season_id' => $season->id,
                'chapterable_type' => Anime::class,
                'chapter_number' => $i + 1,
                'chapter_link' => 'https://youtu.be/o5Bj--A9ORo?si=eeLxZeRzfPzL1JG0',
                'ouo_chapter_link' => 'https://youtu.be/o5Bj--A9ORo?si=eeLxZeRzfPzL1JG0',
                'title' => 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit, deleniti.',
                'description' => ' Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero beatae quo tempora nemo repellendus velit ad eaque quidem esse facilis ea ratione earum maxime animi, debitis deleniti quia dolorum mollitia.'
            ]);
        }
    }

    public function run(): void
    {
        $anime1 = Anime::factory()->create([
            'is_trending' => true,
            'thumbnail' => 'https://m.media-amazon.com/images/M/MV5BMjcxMDg4MDUtMmQ2NC00ZDIyLTkyMjEtMDBiY2NiOTA2NWVmXkEyXkFqcGdeQWpybA@@._V1_.jpg',
            'background_image' => 'https://1.bp.blogspot.com/-x9pSUkrvOo8/YTEZrYf4f_I/AAAAAAAAKVE/q4S1kjbvATMQyuGBzuTx-QQxIYfBZRDkgCPcBGAsYHg/w919/my-hero-academia-battle-4k-uhdpaper.com-1001.0_b-thumbnail.jpg'
        ]);

        $this->createChapters($anime1);

        $anime2 = Anime::factory()->create([
            'is_trending' => true,
            'thumbnail' => 'https://staticg.sportskeeda.com/editor/2023/09/97d5f-16951446392189.png?w=640',
            'background_image' => 'https://wallpapercg.com/download/ichigo-kurosaki-3840x2160-14945.jpeg'
        ]);

        $this->createChapters($anime2);

        $anime3 = Anime::factory()->create([
            'is_trending' => true,
            'is_recommended' => true,
            'background_image' => 'https://wallpaperswide.com/download/one_piece_art_sabo_portgas_d_ace_luffy-wallpaper-1440x1080.jpg',
            'thumbnail' => 'https://wallpaperswide.com/download/one_piece_art_sabo_portgas_d_ace_luffy-wallpaper-1440x1080.jpg',
            'transparent_background' => 'https://www.pngkey.com/png/full/610-6103328_my-hero-academia-image-my-hero-academia-group.png'
        ]);
        $this->createChapters($anime3);
        foreach ($this->animeSerieThumbnails as $thumbnail) {
            $anime = Anime::factory()->create([
                'thumbnail' => $thumbnail
            ]);
            $this->createChapters($anime);
        }
    }
}
