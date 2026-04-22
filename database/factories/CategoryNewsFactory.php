<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CategoryNews>
 */
class CategoryNewsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker = faker();
        return [
            "category_id" => $faker->numberBetween(1,2),
            "category_newsable_type" => $faker->randomElements(['App/Models/News', 'App/Models/League']),
            "category_newsable_id" => $faker->randomElements(1,10),
        ];
    }
}
