/** Item shape required for filter/sort utils (matches Pokemon and extended caught list) */
export interface FilterSortItem {
  id?: number;
  name: string;
  types: string[];
  caughtAt?: string;
}

export type SortKey = "id" | "name" | "caughtAt";
export type SortDir = "asc" | "desc";

export function filterByName<T extends { name: string }>(
  list: T[],
  query: string
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((item) => item.name.toLowerCase().includes(q));
}

/**
 * Filter list to items that have at least one of the given types.
 */
export function filterByType<T extends { types: string[] }>(
  list: T[],
  types: string[]
): T[] {
  if (types.length === 0) return list;
  const set = new Set(types.map((t) => t.toLowerCase()));
  return list.filter((item) =>
    item.types.some((type) => set.has(type.toLowerCase()))
  );
}

/**
 * Sort list by key and direction. Keys: id, name, caughtAt (timestamp).
 * Missing id/caughtAt are treated as 0 for ordering.
 */
export function sortBy<T extends FilterSortItem>(
  list: T[],
  key: SortKey,
  dir: SortDir
): T[] {
  const sorted = [...list];
  const mult = dir === "asc" ? 1 : -1;

  sorted.sort((a, b) => {
    switch (key) {
      case "id":
        return mult * ((a.id ?? 0) - (b.id ?? 0));
      case "name":
        return mult * a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      case "caughtAt": {
        const aTime = a.caughtAt ? new Date(a.caughtAt).getTime() : 0;
        const bTime = b.caughtAt ? new Date(b.caughtAt).getTime() : 0;
        return mult * (aTime - bTime);
      }
      default:
        return 0;
    }
  });

  return sorted;
}
