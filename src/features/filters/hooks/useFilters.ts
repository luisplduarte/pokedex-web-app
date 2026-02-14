"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SortDir, SortKey } from "@/utils/filters";

const PARAM_NAME = "q";
const PARAM_TYPES = "types";
const PARAM_SORT = "sort";

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
  };
}
