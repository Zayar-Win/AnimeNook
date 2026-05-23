<?php

return [
    'enabled' => env('IMAGE_COMPRESSION_ENABLED', true),
    'max_width' => (int) env('IMAGE_COMPRESSION_MAX_WIDTH', 2000),
    'max_height' => (int) env('IMAGE_COMPRESSION_MAX_HEIGHT', 2000),
    'jpeg_quality' => (int) env('IMAGE_COMPRESSION_JPEG_QUALITY', 75),
    'webp_quality' => (int) env('IMAGE_COMPRESSION_WEBP_QUALITY', 75),
    'fail_on_error' => env('IMAGE_COMPRESSION_FAIL_ON_ERROR', false),
];

