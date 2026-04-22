<?php

namespace App\Actions;

use App\Models\Image;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class DropVideoAction {
    public static function handle(Model $model, $id, $uploadPath, $disk = 'public') {
        if (!$id) return;

        $md = $model::find($id);
        $videoNameArray = explode("/", $md->video_url);
        $videoName = $videoNameArray[count($videoNameArray) - 1];

        if (Storage::disk($disk)->exists("$uploadPath/$videoName")) {
            Storage::disk($disk)->delete("$uploadPath/$videoName");
        }
    }
}