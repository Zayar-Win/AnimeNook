<?php

namespace App\Console\Commands;

use App\helpers\ShortenLinkGenerator;
use App\Models\Chapter;
use App\Models\Group;
use App\Models\OuoFailLink;
use Exception;
use Illuminate\Console\Command;

class RegenrateOuoFailLink extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:regenrate-ouo-fail-link';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $failLinks = OuoFailLink::with('group', 'chapter')->get();
        $shortenLinkGenerator = new ShortenLinkGenerator();
        foreach ($failLinks as $failLink) {
            $group = Group::where('id',$failLink->group_id)->first();
            if($group->plan->name === 'preminum'){
                $failLink->delete();
            }else{
                try {
                    $link = $shortenLinkGenerator->generate($failLink->chapter->chapter_link);
                    Chapter::where('id', $failLink->chapter->id)->update([
                        'ouo_chapter_link' => $link

                    ]);
                    $failLink->delete();
                } catch (Exception $e) {
                }
            }
        }
    }
}
