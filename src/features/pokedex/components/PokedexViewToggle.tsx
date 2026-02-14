"use client";

import type { PokedexViewMode } from "../hooks/usePokedexViewMode";

interface PokedexViewToggleProps {
  viewMode: PokedexViewMode;
  setViewMode: (mode: PokedexViewMode) => void;
}

const segmentBase =
  "min-h-[44px] min-w-[44px] rounded-md border px-3 py-2 text-sm font-medium transition-colors first:rounded-r-none last:rounded-l-none";
const segmentInactive =
  "border-zinc-300 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700";
const segmentActive =
  "border-blue-500 bg-blue-500 text-white dark:bg-blue-600 dark:border-blue-600";

export function PokedexViewToggle({ viewMode, setViewMode }: PokedexViewToggleProps) {
  return (
    <div className="inline-flex rounded-md border border-zinc-300 dark:border-zinc-600" role="group" aria-label="View mode">
      <button
        type="button"
        onClick={() => setViewMode("table")}
        className={`${segmentBase} ${viewMode === "table" ? segmentActive : segmentInactive}`}
        aria-pressed={viewMode === "table"}
      >
        Table
      </button>
      <button
        type="button"
        onClick={() => setViewMode("grid")}
        className={`${segmentBase} ${viewMode === "grid" ? segmentActive : segmentInactive}`}
        aria-pressed={viewMode === "grid"}
      >
        Grid
      </button>
    </div>
  );
}
