<?php

namespace Database\Seeders;

use App\Models\Anime;
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

    public function run(): void
    {
        Anime::factory()->create([
            'is_trending' => true,
            'thumbnail' => 'https://m.media-amazon.com/images/M/MV5BMjcxMDg4MDUtMmQ2NC00ZDIyLTkyMjEtMDBiY2NiOTA2NWVmXkEyXkFqcGdeQWpybA@@._V1_.jpg',
            'background_image' => 'https://1.bp.blogspot.com/-x9pSUkrvOo8/YTEZrYf4f_I/AAAAAAAAKVE/q4S1kjbvATMQyuGBzuTx-QQxIYfBZRDkgCPcBGAsYHg/w919/my-hero-academia-battle-4k-uhdpaper.com-1001.0_b-thumbnail.jpg'
        ]);

        Anime::factory()->create([
            'is_trending' => true,
            'thumbnail' => 'https://staticg.sportskeeda.com/editor/2023/09/97d5f-16951446392189.png?w=640',
            'background_image' => 'https://wallpapercg.com/download/ichigo-kurosaki-3840x2160-14945.jpeg'
        ]);
        Anime::factory()->create([
            'is_trending' => true,
            'is_recommended' => true,
            'background_image' => 'https://wallpaperswide.com/download/one_piece_art_sabo_portgas_d_ace_luffy-wallpaper-1440x1080.jpg',
            'thumbnail' => 'https://wallpaperswide.com/download/one_piece_art_sabo_portgas_d_ace_luffy-wallpaper-1440x1080.jpg',
            'transparent_background' => 'https://www.pngkey.com/png/full/610-6103328_my-hero-academia-image-my-hero-academia-group.png'
        ]);
        foreach ($this->animeSerieThumbnails as $thumbnail) {
            Anime::factory()->create([
                'thumbnail' => $thumbnail
            ]);
        }
    }
}
