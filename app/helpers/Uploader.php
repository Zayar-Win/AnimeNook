<?php

namespace App\helpers;

use Carbon\Carbon;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Storage;

class Uploader
{
    /**
     * check url is full url or base 64 string
     */
    public function _isLink(string $url)
    {
        $http = substr($url, 0, 4);
        if (strtolower($http) == 'http') {
            return true;
        }

        return false;
    }

    public function getDefaultName($photo)
    {
        return Carbon::now()->timestamp . '_' . $photo->getClientOriginalName();
    }

    public function upload($photo, $imgContainer, $customName = null)
    {
        $customName = $customName ?? $this->getDefaultName($photo);
        if ($this->_isLink($photo)) {
            return $photo;
        }

        if (App::environment() !== 'testing') {
            if (App::environment() !== 'production' && !$imgContainer) {
                $imgContainer = App::environment();
            }
            $path = ($customName) ? $photo->storeAs($imgContainer, $customName) : $photo->store($imgContainer);
            $url = Storage::url($path);
            return $url;
        }
    }

    public function remove($url)
    {
        $path = $this->changeUrlToPath($url);
        if ($this->canDeletePhoto($url) && Storage::exists($path)) {
            Storage::delete($path);
        }
    }

    public function changeUrlToPath($url)
    {
        return parse_url($url)['path'];
    }

    public function getFolderNameByUrl($url)
    {
        return explode('/', $this->changeUrlToPath($url))[1];
    }

    public function canDeletePhoto($url)
    {
        if ($this->isOnDevelopmentOrStagingEnv($url)) {
            return false;
        }
        return true;
    }

    protected function isOnDevelopmentOrStagingEnv($url)
    {
        return
            app()->environment() !== 'production' &&
            $this->getFolderNameByUrl($url) !== app()->environment();
    }
}
