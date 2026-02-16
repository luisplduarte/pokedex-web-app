"use client";

import { usePokedexStore } from "@/store/pokedexStore";

interface PokedexProgressProps {
  total: number;
}

export function PokedexProgress({ total }: PokedexProgressProps) {
  const caughtCount = usePokedexStore((s) => s.caughtIds.size);
  const percentage = total > 0 ? Math.min(100, (caughtCount / total) * 100) : 0;
  const percentageLabel = Math.round(percentage);

  return (
    <div className="space-y-2 mb-4 w-full max-w-xs">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Pokemon added to Pokédex
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 shrink-0">
          {caughtCount}
        </p>
        <div
          className="relative h-2 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-700"
          role="progressbar"
          aria-valuenow={caughtCount}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Pokédex progress: ${caughtCount} of ${total} caught`}
        >
          <div
            className="h-full rounded-full bg-zinc-700 dark:bg-zinc-300 transition-[width] duration-300"
            style={{ width: `${percentage}%` }}
          />
          <div
            className="absolute h-3 w-3 rounded-full bg-zinc-700 dark:bg-zinc-300 shadow-sm"
            style={{ left: `${percentage}%`, top: "50%", transform: "translate(-50%, -50%)" }}
          />
          <span
            className="absolute mt-1 text-xs text-zinc-500 dark:text-zinc-400"
            style={{ left: `${percentage}%`, top: "100%", transform: "translateX(-50%)" }}
          >
            {percentageLabel}%
          </span>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 shrink-0">
          {total}
        </p>
      </div>
    </div>
  );
}
