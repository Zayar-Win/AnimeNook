<?php

namespace App\helpers;

use Exception;
use GuzzleHttp\Client;

class ShortenLinkGenerator
{
    public function generate($link)
    {
        $client = new Client();
        try {
            $response = $client->request('GET', 'http://localhost:5000/shortenlink?link=' . urlencode($link));
            $data = json_decode($response->getBody(), true);
            return $data['link'];
        } catch (Exception $e) {
            return $link;
        }
    }
}
