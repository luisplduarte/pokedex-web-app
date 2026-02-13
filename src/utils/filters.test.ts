import { describe, it, expect } from "vitest";
import {
  filterByName,
  filterByType,
  filterByHeightRange,
  sortBy,
  type FilterSortItem,
} from "./filters";

const baseItem: FilterSortItem = {
  name: "bulbasaur",
  types: ["grass", "poison"],
};

const list: FilterSortItem[] = [
  { ...baseItem, name: "bulbasaur", types: ["grass", "poison"], height: 7 },
  { ...baseItem, name: "ivysaur", types: ["grass", "poison"], height: 10 },
  { ...baseItem, name: "charizard", types: ["fire", "flying"], height: 17 },
  { ...baseItem, name: "pikachu", types: ["electric"], height: 4 },
  { ...baseItem, name: "charmander", types: ["fire"], height: 6 },
];

describe("filterByName", () => {
  it("returns full list when query is empty", () => {
    expect(filterByName(list, "")).toEqual(list);
    expect(filterByName(list, "   ")).toEqual(list);
  });

  it("returns empty array when list is empty", () => {
    expect(filterByName([], "bulb")).toEqual([]);
  });

  it("filters by case-insensitive substring", () => {
    expect(filterByName(list, "char")).toHaveLength(2);
    expect(filterByName(list, "CHAR")).toEqual(filterByName(list, "char"));
    expect(filterByName(list, "saur").map((x) => x.name)).toEqual([
      "bulbasaur",
      "ivysaur",
    ]);
  });

  it("returns single match", () => {
    const result = filterByName(list, "pikachu");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("pikachu");
  });

  it("returns empty when no match", () => {
    expect(filterByName(list, "mewtwo")).toEqual([]);
  });
});

describe("filterByType", () => {
  it("returns full list when types array is empty", () => {
    expect(filterByType(list, [])).toEqual(list);
  });

  it("returns empty array when list is empty", () => {
    expect(filterByType([], ["fire"])).toEqual([]);
  });

  it("filters by single type (case-insensitive)", () => {
    const result = filterByType(list, ["fire"]);
    expect(result.map((x) => x.name)).toEqual(["charizard", "charmander"]);
    expect(filterByType(list, ["FIRE"])).toEqual(result);
  });

  it("filters by multiple types (OR: at least one match)", () => {
    const result = filterByType(list, ["electric", "poison"]);
    expect(result.map((x) => x.name)).toContain("pikachu");
    expect(result.map((x) => x.name)).toContain("bulbasaur");
    expect(result).toHaveLength(3); // pikachu, bulbasaur, ivysaur
  });

  it("returns single item when one type matches", () => {
    const result = filterByType(list, ["electric"]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("pikachu");
  });
});

describe("filterByHeightRange", () => {
  it("returns full list when min and max are omitted", () => {
    expect(filterByHeightRange(list)).toEqual(list);
  });

  it("returns empty array when list is empty", () => {
    expect(filterByHeightRange([], 1, 10)).toEqual([]);
  });

  it("filters by min only", () => {
    const result = filterByHeightRange(list, 7);
    expect(result.map((x) => x.name)).toEqual(["bulbasaur", "ivysaur", "charizard"]);
  });

  it("filters by max only", () => {
    const result = filterByHeightRange(list, undefined, 6);
    expect(result.map((x) => x.name)).toEqual(["pikachu", "charmander"]);
  });

  it("filters by min and max (inclusive)", () => {
    const result = filterByHeightRange(list, 6, 10);
    expect(result.map((x) => x.name)).toEqual(["bulbasaur", "ivysaur", "charmander"]);
  });

  it("treats missing height as 0", () => {
    const withMissing = [
      ...list,
      { ...baseItem, name: "unknown", types: ["normal"] },
    ];
    const result = filterByHeightRange(withMissing, undefined, 3);
    expect(result.map((x) => x.name)).toContain("unknown");
  });

  it("invalid range (min > max) returns no items when both applied", () => {
    const result = filterByHeightRange(list, 20, 1);
    expect(result).toEqual([]);
  });
});

describe("sortBy", () => {
  it("returns copy; does not mutate original", () => {
    const copy = sortBy(list, "name", "asc");
    expect(copy).not.toBe(list);
    expect(list[0].name).toBe("bulbasaur");
  });

  it("sorts by name asc", () => {
    const result = sortBy(list, "name", "asc");
    expect(result.map((x) => x.name)).toEqual([
      "bulbasaur",
      "charizard",
      "charmander",
      "ivysaur",
      "pikachu",
    ]);
  });

  it("sorts by name desc", () => {
    const result = sortBy(list, "name", "desc");
    expect(result.map((x) => x.name)).toEqual([
      "pikachu",
      "ivysaur",
      "charmander",
      "charizard",
      "bulbasaur",
    ]);
  });

  it("sorts by height asc", () => {
    const result = sortBy(list, "height", "asc");
    expect(result.map((x) => x.name)).toEqual([
      "pikachu",
      "charmander",
      "bulbasaur",
      "ivysaur",
      "charizard",
    ]);
  });

  it("sorts by height desc", () => {
    const result = sortBy(list, "height", "desc");
    expect(result[0].name).toBe("charizard");
    expect(result[result.length - 1].name).toBe("pikachu");
  });

  it("sorts by type (first type) asc", () => {
    const result = sortBy(list, "type", "asc");
    const firstTypes = result.map((x) => x.types[0]);
    expect(firstTypes).toEqual([...firstTypes].sort());
  });

  it("sorts by caughtAt asc", () => {
    const withCaught: FilterSortItem[] = [
      { ...list[0], caughtAt: "2025-01-02T00:00:00Z" },
      { ...list[1], caughtAt: "2025-01-01T00:00:00Z" },
      { ...list[2], caughtAt: "2025-01-03T00:00:00Z" },
    ];
    const result = sortBy(withCaught, "caughtAt", "asc");
    expect(result.map((x) => x.name)).toEqual(["ivysaur", "bulbasaur", "charizard"]);
  });

  it("sorts by caughtAt desc", () => {
    const withCaught: FilterSortItem[] = [
      { ...list[0], caughtAt: "2025-01-02T00:00:00Z" },
      { ...list[1], caughtAt: "2025-01-01T00:00:00Z" },
      { ...list[2], caughtAt: "2025-01-03T00:00:00Z" },
    ];
    const result = sortBy(withCaught, "caughtAt", "desc");
    expect(result.map((x) => x.name)).toEqual(["charizard", "bulbasaur", "ivysaur"]);
  });

  it("treats missing caughtAt as 0 (earliest)", () => {
    const mixed: FilterSortItem[] = [
      { ...list[0], caughtAt: "2025-01-02T00:00:00Z" },
      { ...list[1] }, // no caughtAt
    ];
    const result = sortBy(mixed, "caughtAt", "asc");
    expect(result[0].name).toBe("ivysaur");
  });

  it("empty list returns empty", () => {
    expect(sortBy([], "name", "asc")).toEqual([]);
  });

  it("single item unchanged", () => {
    const single = [list[0]];
    expect(sortBy(single, "name", "asc")).toEqual(single);
  });
});
