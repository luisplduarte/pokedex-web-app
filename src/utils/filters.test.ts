import { describe, it, expect } from "vitest";
import {
  filterByName,
  filterByType,
  sortBy,
  type FilterSortItem,
} from "./filters";

const baseItem: FilterSortItem = {
  name: "bulbasaur",
  types: ["grass", "poison"],
};

const list: FilterSortItem[] = [
  { ...baseItem, id: 1, name: "bulbasaur", types: ["grass", "poison"] },
  { ...baseItem, id: 2, name: "ivysaur", types: ["grass", "poison"] },
  { ...baseItem, id: 3, name: "charizard", types: ["fire", "flying"] },
  { ...baseItem, id: 4, name: "pikachu", types: ["electric"] },
  { ...baseItem, id: 5, name: "charmander", types: ["fire"] },
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

  it("sorts by id asc", () => {
    const result = sortBy(list, "id", "asc");
    expect(result.map((x) => x.name)).toEqual([
      "bulbasaur",
      "ivysaur",
      "charizard",
      "pikachu",
      "charmander",
    ]);
  });

  it("sorts by id desc", () => {
    const result = sortBy(list, "id", "desc");
    expect(result.map((x) => x.name)).toEqual([
      "charmander",
      "pikachu",
      "charizard",
      "ivysaur",
      "bulbasaur",
    ]);
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
