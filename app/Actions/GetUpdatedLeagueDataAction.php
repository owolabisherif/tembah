<?php
    namespace App\Actions;

use App\Enums\Status;
use App\Models\Country;
use App\Models\League;
use ArPHP\I18N\Arabic;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GetUpdatedLeagueDataAction {

    public static function handle(int $leagueId): array | null {
        try {
            $key =  config('api.key');
            $endPoint = config('api.endpoint');
            $response = Http::get("{$endPoint}/{$key}/soccerfixtures/data/mapping?json=1");
            $international = collect(["intl", "intL", "intl.", "international"]);

            $data = $response->collect();

            $leagues  = collect($data["fixtures"]["mapping"]);

            if(!$leagues->count()) return null;
            
            $league = $leagues->first(fn($item) => (int) $item["@id"] == $leagueId);

            $countryName = $international->contains(Str::lower($league["@country"])) ? 'international' : Str::lower($league["@country"]);

            $country = Country::whereSlug(Str::slug($countryName))->first();

            return [$league, $country];

        } catch (\Exception $e) {
            Log::error($e);
            return null;
        }
    }
}