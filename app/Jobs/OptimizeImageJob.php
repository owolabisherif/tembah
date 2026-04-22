<?php

namespace App\Jobs;

use App\Models\Fixture;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Spatie\Image\Enums\Fit;
use Spatie\Image\Image;

class OptimizeImageJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(private array $paths)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        foreach ($this->paths as $path) {
            Image::load(Storage::disk("public")->path($path))->fit(Fit::Max, desiredWidth: 4096, desiredHeight: 2730, backgroundColor: '#ff5733')->optimize()->save();
        }
    }
}
