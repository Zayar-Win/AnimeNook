<?php

namespace App\Http\Controllers;

use App\helpers\ShortenLinkGenerator;
use App\Models\Chapter;
use App\Models\OuoFailLink;
use Exception;
use Illuminate\Http\Request;

class AdminOuoFailLinkController extends Controller
{
    public function index()
    {
        $failLinks = OuoFailLink::with(['group', 'chapter.chapterable'])->paginate(20);
        return inertia('Admin/OuoFailLinks/Index', [
            'failLinks' => $failLinks
        ]);
    }

    public function rerunAllFailLink()
    {
        $failLinks = OuoFailLink::with('group', 'chapter')->get();
        $shortenLinkGenerator = new ShortenLinkGenerator();
        foreach ($failLinks as $failLink) {
            try {
                $link = $shortenLinkGenerator->generate($failLink->chapter->chapter_link);
                Chapter::where('id', $failLink->chapter->id)->update([
                    'chapter_link' => $link
                ]);
                $failLink->delete();
            } catch (Exception $e) {
            }
        }
        return back()->with('success', 'Done');
    }

    public function rerunFailLink(OuoFailLink $failLink)
    {
        $failLink = OuoFailLink::with('chapter')->where('id', $failLink->id)->first();
        $shortenLinkGenerator = new ShortenLinkGenerator();
        try {
            $link = $shortenLinkGenerator->generate($failLink->chapter->chapter_link);
            Chapter::where('id', $failLink->chapter_id)->update([
                'chapter_link' => $link
            ]);
            $failLink->delete();
            return back()->with('success', 'Updated with new generated link.');
        } catch (Exception $e) {
            return back()->with('error', 'Try again.');
        }
    }

    public function delete(OuoFailLink $failLink)
    {
        $failLink->delete();
        return back()->with('success', 'Fail Link deleted successful');
    }
}
