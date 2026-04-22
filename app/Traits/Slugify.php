<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

trait Slugify
{
    public static function bootSlugify()
    {
        static::creating(function (Model $model) {
            $model->generateSlugOnCreate();
        });

        static::updating(function (Model $model) {
            $model->generateSlugOnUpdate();
        });
    }


    protected function generateSlugOnCreate(): void
    {

        $options  = $this->getSlugOptions();

        $this->prepSlug($options["saveTo"], $options["column"], $options["lang"]);
    }

    protected function generateSlugOnUpdate(): void
    {
        $options  = $this->getSlugOptions();

        $this->prepSlug($options["saveTo"], $options["column"], $options["lang"]);
    }

    private function prepSlug($saveTo, $column = "slug", $lang = 'en')
    {
        if (count($saveTo) > 1) {
            foreach ($saveTo as $key => $value) {
                $this->makeSlug($value, $column[$key], $lang[$key]);
            }
        } else {
            $this->makeSlug($saveTo[0], $column[0], $lang[0]);
        }
    }

    private function makeSlug($str, $column = "slug", $lang = 'en')
    {
        $slug = $lang == 'ar' ? makeArabicSlug($str) : Str::slug($str);

        $exists = $this->where(["$column" => $slug])->exists();

        if ($exists) {
            $next = $this->where("$column", "LIKE", '%' . $slug . '%')->count() + 1;

            return $slug . "_$next";
        } else {
            return $slug;
        }
    }
}
