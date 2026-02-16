import { describe, it, expect } from "vitest";
import {
  filterByName,
  filterByType,
  filterByHeightRange,
  filterByWeightRange,
  sortBy,
  type FilterSortItem,
} from "./filters";

const baseItem: FilterSortItem = {
  name: "bulbasaur",
  types: ["grass", "poison"],
};

const list: FilterSortItem[] = [
  {
    ...baseItem,
    id: 1,
    name: "bulbasaur",
    types: ["grass", "poison"],
    height: 7, // 0.7 m
    weight: 69, // 6.9 kg
  },
  {
    ...baseItem,
    id: 2,
    name: "ivysaur",
    types: ["grass", "poison"],
    height: 10, // 1.0 m
    weight: 130, // 13.0 kg
  },
  {
    ...baseItem,
    id: 3,
    name: "charizard",
    types: ["fire", "flying"],
    height: 17, // 1.7 m
    weight: 905, // 90.5 kg
  },
  {
    ...baseItem,
    id: 4,
    name: "pikachu",
    types: ["electric"],
    height: 4, // 0.4 m
    weight: 60, // 6.0 kg
  },
  {
    ...baseItem,
    id: 5,
    name: "charmander",
    types: ["fire"],
    height: 6, // 0.6 m
    weight: 85, // 8.5 kg
  },
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
  it("returns full list when no bounds are provided", () => {
    expect(filterByHeightRange(list, undefined, undefined)).toEqual(list);
    expect(filterByHeightRange(list, null, null)).toEqual(list);
  });

  it("filters by minimum height in metres", () => {
    const result = filterByHeightRange(list, 0.7, undefined);
    expect(result.map((x) => x.name)).toEqual([
      "bulbasaur",
      "ivysaur",
      "charizard",
    ]);
  });

  it("filters by maximum height in metres", () => {
    const result = filterByHeightRange(list, undefined, 0.7);
    expect(result.map((x) => x.name)).toEqual([
      "bulbasaur",
      "pikachu",
      "charmander",
    ]);
  });

  it("filters by height range in metres", () => {
    const result = filterByHeightRange(list, 0.6, 1.0);
    expect(result.map((x) => x.name)).toEqual([
      "bulbasaur",
      "ivysaur",
      "charmander",
    ]);
  });

  it("excludes items without height when bounds are set", () => {
    const withMissing = [...list, { ...baseItem, id: 99, name: "mystery", types: ["normal"] }];
    const result = filterByHeightRange(withMissing, 0.5, 2.0);
    expect(result.some((x) => x.name === "mystery")).toBe(false);
  });
});

describe("filterByWeightRange", () => {
  it("returns full list when no bounds are provided", () => {
    expect(filterByWeightRange(list, undefined, undefined)).toEqual(list);
    expect(filterByWeightRange(list, null, null)).toEqual(list);
  });

  it("filters by minimum weight in kilograms", () => {
    const result = filterByWeightRange(list, 10, undefined);
    expect(result.map((x) => x.name)).toEqual(["ivysaur", "charizard"]);
  });

  it("filters by maximum weight in kilograms", () => {
    const result = filterByWeightRange(list, undefined, 10);
    expect(result.map((x) => x.name)).toEqual([
      "bulbasaur",
      "pikachu",
      "charmander",
    ]);
  });

  it("filters by weight range in kilograms", () => {
    const result = filterByWeightRange(list, 6, 9);
    expect(result.map((x) => x.name)).toEqual([
      "bulbasaur",
      "pikachu",
      "charmander",
    ]);
  });

  it("excludes items without weight when bounds are set", () => {
    const withMissing = [...list, { ...baseItem, id: 100, name: "light", types: ["normal"] }];
    const result = filterByWeightRange(withMissing, 1, 100);
    expect(result.some((x) => x.name === "light")).toBe(false);
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
