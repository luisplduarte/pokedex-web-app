"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import type { SortOption } from "../hooks/useFilters";
import { getTypeIconUrl } from "../typeIcons";

const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dark",
  "dragon",
  "steel",
  "fairy",
] as const;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "id-asc", label: "Number Asc" },
  { value: "id-desc", label: "Number Desc" },
  { value: "caughtAt-asc", label: "Caught date Asc" },
  { value: "caughtAt-desc", label: "Caught date Desc" },
];

const inputStyles =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500";

const chipBase =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-sm capitalize transition-colors";
const chipInactive =
  "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600";
const chipActive =
  "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700";

export interface FilterBarProps {
  nameQuery: string;
  setNameQuery: (value: string) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  /** Optional slot for view toggle (e.g. Table/Grid), shown to the right of Sort by on larger screens. */
  children?: ReactNode;
}

export function FilterBar({
  nameQuery,
  setNameQuery,
  selectedTypes,
  setSelectedTypes,
  sortOption,
  setSortOption,
  children,
}: FilterBarProps) {
  const [typeFilterOpen, setTypeFilterOpen] = useState(false);

  const toggleType = (type: string) => {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type].sort();
    setSelectedTypes(next);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 mb-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="filter-name"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Name
        </label>
        <input
          id="filter-name"
          type="search"
          placeholder="Search by name…"
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
          className={`w-full ${inputStyles}`}
          aria-label="Filter by Pokémon name"
        />
      </div>

      <fieldset className="flex flex-col gap-2 border-0 p-0">
        <legend className="sr-only">Filter by type</legend>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setTypeFilterOpen((open) => !open)}
            className="flex w-full items-center gap-1.5 rounded-md py-1 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-expanded={typeFilterOpen}
            aria-controls="filter-by-type-list"
            id="filter-by-type-toggle"
          >
            <span>Filter by type</span>
            <span
              className={`shrink-0 transition-transform ${typeFilterOpen ? "rotate-180" : ""}`}
              aria-hidden
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          <div
            id="filter-by-type-list"
            role="region"
            aria-labelledby="filter-by-type-toggle"
            className={`grid transition-[grid-template-rows] duration-200 ease-out ${typeFilterOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {POKEMON_TYPES.map((type) => {
                  const selected = selectedTypes.includes(type);
                  const iconUrl = getTypeIconUrl(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleType(type)}
                      className={`${chipBase} ${selected ? chipActive : chipInactive}`}
                      aria-pressed={selected}
                      aria-label={
                        selected ? `Remove ${type} filter` : `Filter by ${type}`
                      }
                    >
                      {iconUrl ? (
                        <img
                          src={iconUrl}
                          alt=""
                          width={14}
                          height={14}
                          className="shrink-0"
                        />
                      ) : null}
                      <span>{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="filter-sort"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Sort by
          </label>
          <select
            id="filter-sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className={`${inputStyles} min-w-[10rem]`}
            aria-label="Sort by"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        {children ? <div className="sm:ml-auto">{children}</div> : null}
      </div>
    </div>
  );
}
