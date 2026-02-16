/** Item shape required for filter/sort utils (matches Pokemon and extended caught list) */
export interface FilterSortItem {
  id?: number;
  name: string;
  types: string[];
  caughtAt?: string;
  /** Height in decimetres (as returned by PokéAPI). */
  height?: number;
  /** Weight in hectograms (as returned by PokéAPI). */
  weight?: number;
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
 * Filter list by height range (in metres).
 */
export function filterByHeightRange<T extends { height?: number }>(
  list: T[],
  minHeightMeters?: number | null,
  maxHeightMeters?: number | null
): T[] {
  const hasMin = minHeightMeters != null && !Number.isNaN(minHeightMeters);
  const hasMax = maxHeightMeters != null && !Number.isNaN(maxHeightMeters);

  if (!hasMin && !hasMax) return list;

  const minDm = hasMin ? minHeightMeters! * 10 : undefined;
  const maxDm = hasMax ? maxHeightMeters! * 10 : undefined;

  return list.filter((item) => {
    if (item.height == null) return false;
    if (minDm != null && item.height < minDm) return false;
    if (maxDm != null && item.height > maxDm) return false;
    return true;
  });
}

/**
 * Filter list by weight range (in kilograms).
 */
export function filterByWeightRange<T extends { weight?: number }>(
  list: T[],
  minWeightKg?: number | null,
  maxWeightKg?: number | null
): T[] {
  const hasMin = minWeightKg != null && !Number.isNaN(minWeightKg);
  const hasMax = maxWeightKg != null && !Number.isNaN(maxWeightKg);

  if (!hasMin && !hasMax) return list;

  const minHg = hasMin ? minWeightKg! * 10 : undefined;
  const maxHg = hasMax ? maxWeightKg! * 10 : undefined;

  return list.filter((item) => {
    if (item.weight == null) return false;
    if (minHg != null && item.weight < minHg) return false;
    if (maxHg != null && item.weight > maxHg) return false;
    return true;
  });
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
