<?php

namespace App\Http\Controllers;

use App\helpers\Uploader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{

    public Uploader $uploader;
    public function __construct(Uploader $uploader)
    {
        $this->uploader = $uploader;
    }
    public function removeBg(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Adjust the validation rules as needed
        ]);
        $image = $request->file('image')->store('images');
        $client = new \GuzzleHttp\Client();
        $res = $client->post('https://api.remove.bg/v1.0/removebg', [
            'multipart' => [
                [
                    'name'     => 'image_file',
                    'contents' => fopen($image, 'r')
                ],
                [
                    'name'     => 'size',
                    'contents' => 'auto'
                ]
            ],
            'headers' => [
                'X-Api-Key' => env('IMAGE_BG_REMOVE_API_KEY')
            ]
        ]);
        dd($res);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Adjust the validation rules as needed
        ]);
        $image  =  $this->uploader->upload($request->image, 'images');

        return response()->json([
            'image' => $image
        ]);
    }
}
