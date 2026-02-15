import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useState, useMemo } from "react";
import { FilterBar } from "./FilterBar";
import { filterByName, filterByType, sortBy } from "@/utils/filters";
import type { SortOption } from "../hooks/useFilters";

const MOCK_LIST = [
  { id: 1, name: "bulbasaur", types: ["grass", "poison"] },
  { id: 2, name: "charizard", types: ["fire", "flying"] },
  { id: 3, name: "pikachu", types: ["electric"] },
  { id: 4, name: "charmander", types: ["fire"] },
];

function sortOptionToKeyDir(option: SortOption) {
  const [key, dir] = option.split("-") as ["id" | "name" | "caughtAt", "asc" | "desc"];
  return { key, dir };
}

function FilterBarWithList() {
  const [nameQuery, setNameQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("id-asc");

  const { key: sortKey, dir: sortDir } = sortOptionToKeyDir(sortOption);
  const filtered = useMemo(() => {
    const byName = filterByName(MOCK_LIST, nameQuery);
    const byType = filterByType(byName, selectedTypes);
    return sortBy(byType, sortKey, sortDir);
  }, [nameQuery, selectedTypes, sortKey, sortDir]);

  return (
    <div>
      <FilterBar
        nameQuery={nameQuery}
        setNameQuery={setNameQuery}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        sortOption={sortOption}
        setSortOption={setSortOption}
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
