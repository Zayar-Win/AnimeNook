<?php

namespace App\helpers;

use App\Services\ImageCompressionService;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Storage;

class Uploader
{
    private ?ImageCompressionService $compressionService;

    public function __construct(?ImageCompressionService $compressionService = null)
    {
        $this->compressionService = $compressionService;
    }

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
        if (is_string($photo) && $this->_isLink($photo)) {
            return $photo;
        }
        $customName = $customName ?? $this->getDefaultName($photo);

        if (App::environment() !== 'testing') {
            if (App::environment() !== 'production' && !$imgContainer) {
                $imgContainer = App::environment();
            }

            if ($photo instanceof UploadedFile) {
                $payload = $this->getCompressionService()->compressUploadedFile($photo);
                if ($payload['compressed']) {
                    // Extension may change (e.g. jpg/png → webp); keep the base name.
                    $baseName = pathinfo($customName, PATHINFO_FILENAME);
                    $storedName = $baseName.'.'.$payload['extension'];

                    $path = trim((string) $imgContainer, '/');
                    if ($path !== '') {
                        $path .= '/';
                    }
                    $path .= $storedName;
                    Storage::put($path, $payload['contents']);

                    return Storage::url($path);
                }
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

    private function getCompressionService(): ImageCompressionService
    {
        return $this->compressionService ??= app(ImageCompressionService::class);
    }
}
