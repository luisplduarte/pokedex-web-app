import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useState, useMemo } from "react";
import { FilterBar } from "./FilterBar";
import {
  filterByName,
  filterByType,
  filterByHeightRange,
  filterByWeightRange,
  sortBy,
} from "@/utils/filters";
import type { SortOption } from "../hooks/useFilters";

const MOCK_LIST = [
  { id: 1, name: "bulbasaur", types: ["grass", "poison"], height: 7, weight: 69 },
  { id: 2, name: "charizard", types: ["fire", "flying"], height: 17, weight: 905 },
  { id: 3, name: "pikachu", types: ["electric"], height: 4, weight: 60 },
  { id: 4, name: "charmander", types: ["fire"], height: 6, weight: 85 },
];

function sortOptionToKeyDir(option: SortOption) {
  const [key, dir] = option.split("-") as ["id" | "name" | "caughtAt", "asc" | "desc"];
  return { key, dir };
}

function FilterBarWithList() {
  const [nameQuery, setNameQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("id-asc");
   const [minHeight, setMinHeight] = useState<number | null>(null);
   const [maxHeight, setMaxHeight] = useState<number | null>(null);
   const [minWeight, setMinWeight] = useState<number | null>(null);
   const [maxWeight, setMaxWeight] = useState<number | null>(null);

  const { key: sortKey, dir: sortDir } = sortOptionToKeyDir(sortOption);
  const filtered = useMemo(() => {
    const byName = filterByName(MOCK_LIST, nameQuery);
    const byType = filterByType(byName, selectedTypes);
    const byHeight = filterByHeightRange(byType, minHeight, maxHeight);
    const byWeight = filterByWeightRange(byHeight, minWeight, maxWeight);
    return sortBy(byWeight, sortKey, sortDir);
  }, [
    nameQuery,
    selectedTypes,
    sortKey,
    sortDir,
    minHeight,
    maxHeight,
    minWeight,
    maxWeight,
  ]);

  return (
    <div>
      <FilterBar
        nameQuery={nameQuery}
        setNameQuery={setNameQuery}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        sortOption={sortOption}
        setSortOption={setSortOption}
        minHeight={minHeight}
        setMinHeight={setMinHeight}
        maxHeight={maxHeight}
        setMaxHeight={setMaxHeight}
        minWeight={minWeight}
        setMinWeight={setMinWeight}
        maxWeight={maxWeight}
        setMaxWeight={setMaxWeight}
      />
      <p data-testid="result-count">{filtered.length}</p>
      <ul data-testid="result-names">
        {filtered.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

describe("FilterBar integration", () => {
  it("updates visible list when name filter changes", () => {
    render(<FilterBarWithList />);

    expect(screen.getByTestId("result-count")).toHaveTextContent("4");
    expect(screen.getByTestId("result-names").textContent).toContain("bulbasaur");
    expect(screen.getByTestId("result-names").textContent).toContain("charizard");

    const nameInput = screen.getByLabelText(/filter by pokémon name/i);
    fireEvent.change(nameInput, { target: { value: "char" } });

    expect(screen.getByTestId("result-count")).toHaveTextContent("2");
    expect(screen.getByTestId("result-names").textContent).toContain("charizard");
    expect(screen.getByTestId("result-names").textContent).toContain("charmander");
    expect(screen.getByTestId("result-names").textContent).not.toContain("bulbasaur");
  });

  it("updates visible list when type filter is selected", () => {
    render(<FilterBarWithList />);

    expect(screen.getByTestId("result-count")).toHaveTextContent("4");

    fireEvent.click(screen.getByRole("button", { name: /filter by fire/i }));

    expect(screen.getByTestId("result-count")).toHaveTextContent("2");
    expect(screen.getByTestId("result-names").textContent).toContain("charizard");
    expect(screen.getByTestId("result-names").textContent).toContain("charmander");
  });

  it("updates order when sort option changes", () => {
    render(<FilterBarWithList />);

    const namesList = screen.getByTestId("result-names");
    // Default sort by id asc: bulbasaur(1), charizard(2), pikachu(3), charmander(4)
    expect(namesList.children[0]).toHaveTextContent("bulbasaur");

    fireEvent.change(screen.getByLabelText(/sort by/i), {
      target: { value: "id-desc" },
    });

    // Sort by id desc: charmander(4), pikachu(3), charizard(2), bulbasaur(1)
    expect(namesList.children[0]).toHaveTextContent("charmander");
  });
});
