"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
  { value: "height-asc", label: "Height Asc" },
  { value: "height-desc", label: "Height Desc" },
  { value: "weight-asc", label: "Weight Asc" },
  { value: "weight-desc", label: "Weight Desc" },
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
  minHeight: number | null;
  setMinHeight: (value: number | null) => void;
  maxHeight: number | null;
  setMaxHeight: (value: number | null) => void;
  minWeight: number | null;
  setMinWeight: (value: number | null) => void;
  maxWeight: number | null;
  setMaxWeight: (value: number | null) => void;
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
  minHeight,
  setMinHeight,
  maxHeight,
  setMaxHeight,
  minWeight,
  setMinWeight,
  maxWeight,
  setMaxWeight,
  children,
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [typeFilterOpen, setTypeFilterOpen] = useState(false);
  const [heightFilterOpen, setHeightFilterOpen] = useState(false);
  const [weightFilterOpen, setWeightFilterOpen] = useState(false);

  const toggleType = (type: string) => {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type].sort();
    setSelectedTypes(next);
  };

  return (
    <div className="flex flex-col rounded-lg border border-zinc-200 bg-white mb-4 dark:border-zinc-800 dark:bg-zinc-900">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-2 rounded-t-lg px-4 py-3 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
        aria-expanded={isOpen}
        aria-controls="filter-bar-content"
        id="filter-bar-toggle"
      >
        <span>Filters & Sorting</span>
        <span
          className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>
      <div
        id="filter-bar-content"
        role="region"
        aria-labelledby="filter-bar-toggle"
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-4 p-4">
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
                    <ChevronDown className="h-4 w-4" />
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

            <div className="grid gap-4 md:grid-cols-2">
              <fieldset className="flex flex-col gap-2 border-0 p-0">
                <legend className="sr-only">Filter by height</legend>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setHeightFilterOpen((open) => !open)}
                    className="flex w-full items-center gap-1.5 rounded-md py-1 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    aria-expanded={heightFilterOpen}
                    aria-controls="filter-by-height-inputs"
                    id="filter-by-height-toggle"
                  >
                    <span>Filter by height (m)</span>
                    <span
                      className={`shrink-0 transition-transform ${heightFilterOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                  <div
                    id="filter-by-height-inputs"
                    role="region"
                    aria-labelledby="filter-by-height-toggle"
                    className={`grid transition-[grid-template-rows] duration-200 ease-out ${heightFilterOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="flex flex-col sm:flex-row gap-2 pt-0.5">
                        <div className="flex flex-1 flex-col gap-1">
                          <label
                            htmlFor="filter-min-height"
                            className="text-xs font-medium text-zinc-500 dark:text-zinc-400"
                          >
                            Min
                          </label>
                          <input
                            id="filter-min-height"
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="0.1"
                            value={minHeight ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (!value) {
                                setMinHeight(null);
                                return;
                              }
                              const parsed = Number(value);
                              setMinHeight(Number.isNaN(parsed) ? null : parsed);
                            }}
                            className={inputStyles}
                            aria-label="Minimum height in metres"
                          />
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                          <label
                            htmlFor="filter-max-height"
                            className="text-xs font-medium text-zinc-500 dark:text-zinc-400"
                          >
                            Max
                          </label>
                          <input
                            id="filter-max-height"
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="0.1"
                            value={maxHeight ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (!value) {
                                setMaxHeight(null);
                                return;
                              }
                              const parsed = Number(value);
                              setMaxHeight(Number.isNaN(parsed) ? null : parsed);
                            }}
                            className={inputStyles}
                            aria-label="Maximum height in metres"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-2 border-0 p-0">
                <legend className="sr-only">Filter by weight</legend>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setWeightFilterOpen((open) => !open)}
                    className="flex w-full items-center gap-1.5 rounded-md py-1 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    aria-expanded={weightFilterOpen}
                    aria-controls="filter-by-weight-inputs"
                    id="filter-by-weight-toggle"
                  >
                    <span>Filter by weight (kg)</span>
                    <span
                      className={`shrink-0 transition-transform ${weightFilterOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                  <div
                    id="filter-by-weight-inputs"
                    role="region"
                    aria-labelledby="filter-by-weight-toggle"
                    className={`grid transition-[grid-template-rows] duration-200 ease-out ${weightFilterOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="flex flex-col sm:flex-row gap-2 pt-0.5">
                        <div className="flex flex-1 flex-col gap-1">
                          <label
                            htmlFor="filter-min-weight"
                            className="text-xs font-medium text-zinc-500 dark:text-zinc-400"
                          >
                            Min
                          </label>
                          <input
                            id="filter-min-weight"
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="0.1"
                            value={minWeight ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (!value) {
                                setMinWeight(null);
                                return;
                              }
                              const parsed = Number(value);
                              setMinWeight(Number.isNaN(parsed) ? null : parsed);
                            }}
                            className={inputStyles}
                            aria-label="Minimum weight in kilograms"
                          />
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                          <label
                            htmlFor="filter-max-weight"
                            className="text-xs font-medium text-zinc-500 dark:text-zinc-400"
                          >
                            Max
                          </label>
                          <input
                            id="filter-max-weight"
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="0.1"
                            value={maxWeight ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (!value) {
                                setMaxWeight(null);
                                return;
                              }
                              const parsed = Number(value);
                              setMaxWeight(Number.isNaN(parsed) ? null : parsed);
                            }}
                            className={inputStyles}
                            aria-label="Maximum weight in kilograms"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>

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
        </div>
      </div>
    </div>
  );
}
