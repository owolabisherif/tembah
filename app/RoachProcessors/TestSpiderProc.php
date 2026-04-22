<?php
namespace App\RoachProcessors;

use RoachPHP\ItemPipeline\ItemInterface;
use RoachPHP\ItemPipeline\Processors\ItemProcessorInterface;
use RoachPHP\Support\Configurable;

class TestSpiderProc implements ItemProcessorInterface
{
    use Configurable;

    public function processItem(ItemInterface $item): ItemInterface
    {
        $totalGoals = $item->get('awayGoals', 0) + $item->get('homeGoals', 0);

        if ($totalGoals < $this->option('threshold')) {
            return $item->drop(
                sprintf('Fewer than %s goals scored', $this->option('threshold'))
            );
        }

        return $item;
    }
  
    private function defaultOptions(): array
    {
        // If not overwritten by the user, the default threshold
        // is 4. Any game with fewer goals than that will get
        // dropped.
        return [
            'threshold' => 4
        ];
    }
}