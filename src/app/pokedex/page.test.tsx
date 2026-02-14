import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PokedexPage from "./page";

const mockDownloadCsv = vi.fn();

vi.mock("@/utils/downloadCsv", () => ({
  downloadCsv: (content: string, filename: string) => mockDownloadCsv(content, filename),
}));

const mockPokemonList = [
  {
    id: 1,
    name: "bulbasaur",
    imageUrl: null,
    types: ["grass", "poison"],
  },
  {
    id: 2,
    name: "ivysaur",
    imageUrl: null,
    types: ["grass", "poison"],
  },
];

vi.mock("@/hooks/usePokemonList", () => ({
  usePokemonList: () => ({
    data: mockPokemonList,
    isLoading: false,
    error: null,
  }),
}));

const mockRemoveCaught = vi.fn();
const mockGetNote = vi.fn((id: number) => (id === 1 ? "First catch" : ""));

vi.mock("@/store/pokedexStore", () => ({
  usePokedexStore: (selector: (s: unknown) => unknown) => {
    const state = {
      caughtIds: new Set([1]),
      caughtAt: { 1: "2025-02-01T12:00:00Z" },
      getNote: mockGetNote,
      removeCaught: mockRemoveCaught,
    };
    return selector(state);
  },
}));

vi.mock("@/features/filters", () => ({
  FilterBar: () => <div data-testid="filter-bar">FilterBar</div>,
  useFilters: () => ({
    nameQuery: "",
    setNameQuery: vi.fn(),
    selectedTypes: [],
    setSelectedTypes: vi.fn(),
    sortOption: "id-asc",
    setSortOption: vi.fn(),
    sortKey: "id" as const,
    sortDir: "asc" as const,
  }),
}));

vi.mock("@/features/pokedex", () => ({
  PokedexTable: () => <div data-testid="pokedex-table">Table</div>,
  PokedexCardGrid: () => <div data-testid="pokedex-card-grid">Grid</div>,
  PokedexViewToggle: () => <div data-testid="view-toggle">ViewToggle</div>,
  PokedexProgress: () => <div data-testid="pokedex-progress">Progress</div>,
  usePokedexViewMode: () => ({ viewMode: "table", setViewMode: vi.fn() }),
}));

describe("PokedexPage", () => {
  beforeEach(() => {
    mockDownloadCsv.mockClear();
  });

  it("renders an Export CSV button", () => {
    render(<PokedexPage />);

    const exportBtn = screen.getByRole("button", { name: /export pokédex as csv/i });
    expect(exportBtn).toBeInTheDocument();
  });

  it("calls downloadCsv with CSV content and date-based filename when Export is clicked", () => {
    render(<PokedexPage />);

    fireEvent.click(screen.getByRole("button", { name: /export pokédex as csv/i }));

    expect(mockDownloadCsv).toHaveBeenCalledTimes(1);
    const [csvContent, filename] = mockDownloadCsv.mock.calls[0];

    expect(csvContent).toContain("Id,Name,Types,Height,Weight,Caught At,Note");
    expect(csvContent).toContain("bulbasaur");
    expect(csvContent).toContain("First catch");
    expect(csvContent).toContain("2025/02/01 12:00:00");
    expect(filename).toMatch(/^pokedex-\d{4}-\d{2}-\d{2}\.csv$/);
  });
});
