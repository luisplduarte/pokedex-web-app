"use client";

import { usePokedexStore } from "@/store/pokedexStore";
import { POKEDEX_TOTAL } from "@/lib/constants";

interface PokedexProgressProps {
  total?: number;
}

export function PokedexProgress({ total = POKEDEX_TOTAL }: PokedexProgressProps) {
  const caughtCount = usePokedexStore((s) => s.caughtIds.size);
  const percentage = total > 0 ? Math.min(100, (caughtCount / total) * 100) : 0;

  return (
    <div className="space-y-1">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {caughtCount} / {total} caught
      </p>
      <div
        className="h-1.5 w-full max-w-xs rounded-full bg-zinc-200 dark:bg-zinc-700"
        role="progressbar"
        aria-valuenow={caughtCount}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Pokédex progress: ${caughtCount} of ${total} caught`}
      >
        <div
          className="h-full rounded-full bg-blue-500 dark:bg-blue-400 transition-[width] duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
