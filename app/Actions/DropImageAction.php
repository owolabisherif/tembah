<?php

namespace App\Actions;

use App\Models\Image;
use Illuminate\Support\Facades\Storage;

class DropImageAction {
    public static function handle($model, $type, $uploadPath, $disk = 'public') {
        if (!@$model->id) return;

        $imagesInDb = Image::whereImageableId($model->id)->whereImageableType($type);

        if(!$imagesInDb->count()) return;

        $images = $imagesInDb->get();

        foreach ($images as $img) {
            $imageNameArray = explode("/", $img->url);
            $imageName = $imageNameArray[count($imageNameArray) - 1];

            if (Storage::disk($disk)->exists("$uploadPath/$imageName")) {
                Storage::disk($disk)->delete("$uploadPath/$imageName");
            }
        }


        $imagesInDb->delete();
    }
}