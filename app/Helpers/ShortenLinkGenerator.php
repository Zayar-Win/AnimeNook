<?php

namespace App\helpers;

use GuzzleHttp\Client;

class ShortenLinkGenerator{
    public function generate($link){
        $client = new Client();
        $response = $client->request('GET','http://localhost:5000/shortenlink?link=' . urlencode($link));
        $data = json_decode($response->getBody(), true);
        return $data['link'];
    }
}