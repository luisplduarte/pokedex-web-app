"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SortDir, SortKey } from "@/utils/filters";

const PARAM_NAME = "q";
const PARAM_TYPES = "types";
const PARAM_SORT = "sort";
const PARAM_MIN_HEIGHT = "minH";
const PARAM_MAX_HEIGHT = "maxH";
const PARAM_MIN_WEIGHT = "minW";
const PARAM_MAX_WEIGHT = "maxW";

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "id-asc"
  | "id-desc"
  | "caughtAt-asc"
  | "caughtAt-desc";

const DEFAULT_SORT_OPTION: SortOption = "id-asc";

const SORT_OPTIONS: SortOption[] = [
  "name-asc",
  "name-desc",
  "id-asc",
  "id-desc",
  "caughtAt-asc",
  "caughtAt-desc",
];

function parseTypes(value: string | null): string[] {
  if (!value || !value.trim()) return [];
  return value.split(",").map((t) => t.trim()).filter(Boolean);
}

function parseSortOption(value: string | null): SortOption {
  if (value && SORT_OPTIONS.includes(value as SortOption)) {
    return value as SortOption;
  }
  return DEFAULT_SORT_OPTION;
}

function parseNumberParam(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function sortOptionToKeyDir(option: SortOption): { key: SortKey; dir: SortDir } {
  const [key, dir] = option.split("-") as [SortKey, SortDir];
  return { key, dir };
}

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const nameQuery = searchParams.get(PARAM_NAME) ?? "";
  const selectedTypes = useMemo(
    () => parseTypes(searchParams.get(PARAM_TYPES)),
    [searchParams]
  );
  const sortOption = useMemo(
    () => parseSortOption(searchParams.get(PARAM_SORT)),
    [searchParams]
  );
  const { key: sortKey, dir: sortDir } = useMemo(
    () => sortOptionToKeyDir(sortOption),
    [sortOption]
  );
  const minHeight = useMemo(
    () => parseNumberParam(searchParams.get(PARAM_MIN_HEIGHT)),
    [searchParams]
  );
  const maxHeight = useMemo(
    () => parseNumberParam(searchParams.get(PARAM_MAX_HEIGHT)),
    [searchParams]
  );
  const minWeight = useMemo(
    () => parseNumberParam(searchParams.get(PARAM_MIN_WEIGHT)),
    [searchParams]
  );
  const maxWeight = useMemo(
    () => parseNumberParam(searchParams.get(PARAM_MAX_WEIGHT)),
    [searchParams]
  );

  const setParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const setNameQuery = useCallback(
    (value: string) => setParams({ [PARAM_NAME]: value.trim() || undefined }),
    [setParams]
  );

  const setSelectedTypes = useCallback(
    (types: string[]) =>
      setParams({ [PARAM_TYPES]: types.length > 0 ? types.join(",") : undefined }),
    [setParams]
  );

  const setSortOption = useCallback(
    (option: SortOption) =>
      setParams({ [PARAM_SORT]: option === DEFAULT_SORT_OPTION ? undefined : option }),
    [setParams]
  );

  return {
    nameQuery,
    setNameQuery,
    selectedTypes,
    setSelectedTypes,
    sortKey,
    sortDir,
    sortOption,
    setSortOption,
    minHeight,
    maxHeight,
    minWeight,
    maxWeight,
    setMinHeight: (value: number | null) =>
      setParams({
        [PARAM_MIN_HEIGHT]:
          value == null || Number.isNaN(value) ? undefined : String(value),
      }),
    setMaxHeight: (value: number | null) =>
      setParams({
        [PARAM_MAX_HEIGHT]:
          value == null || Number.isNaN(value) ? undefined : String(value),
      }),
    setMinWeight: (value: number | null) =>
      setParams({
        [PARAM_MIN_WEIGHT]:
          value == null || Number.isNaN(value) ? undefined : String(value),
      }),
    setMaxWeight: (value: number | null) =>
      setParams({
        [PARAM_MAX_WEIGHT]:
          value == null || Number.isNaN(value) ? undefined : String(value),
      }),
  };
}
