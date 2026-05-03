<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Chapter ZIP import
    |--------------------------------------------------------------------------
    |
    | Limits for ZIP uploads of manga chapter pages. Extraction uses ZipArchive
    | index order (not filename sorting).
    |
    */

    'max_upload_bytes' => (int) env('CHAPTER_ZIP_MAX_UPLOAD_BYTES', 200 * 1024 * 1024),

    'max_extracted_files' => (int) env('CHAPTER_ZIP_MAX_EXTRACTED_FILES', 500),

];
