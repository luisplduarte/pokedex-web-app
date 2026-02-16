import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./page";

const mockPokemonList = [
  {
    id: 1,
    name: "bulbasaur",
    imageUrl: null,
    types: ["grass", "poison"],
  },
  {
    id: 2,
    name: "charmander",
    imageUrl: null,
    types: ["fire"],
  },
];

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/hooks/usePokemonList", () => ({
  usePokemonListInfinite: () => ({
    pokemon: mockPokemonList,
    isLoading: false,
    error: null,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  }),
}));

const mockAddCaught = vi.fn();
const mockRemoveCaught = vi.fn();
let mockCaughtIds = new Set<number>();
const mockCaughtAt: Record<number, string> = {};

vi.mock("@/store/pokedexStore", () => ({
  usePokedexStore: (selector: (s: unknown) => unknown) => {
    const state = {
      caughtIds: mockCaughtIds,
      caughtAt: mockCaughtAt,
      addCaught: mockAddCaught,
      removeCaught: mockRemoveCaught,
    };
    return selector(state);
  },
}));

describe("Home page", () => {
  beforeEach(() => {
    mockAddCaught.mockClear();
    mockRemoveCaught.mockClear();
    mockCaughtIds = new Set<number>();
    Object.keys(mockCaughtAt).forEach((k) => delete mockCaughtAt[Number(k)]);
  });

  it("renders list and FilterBar when data is loaded", () => {
    render(<Home />);

    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("charmander")).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by pokémon name/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /my pokédex/i })).toBeInTheDocument();
  });

  it("calls addCaught when user clicks Catch on a Pokémon", () => {
    render(<Home />);

    const catchButtons = screen.getAllByRole("button", { name: /catch/i });
    fireEvent.click(catchButtons[0]);

    expect(mockAddCaught).toHaveBeenCalledTimes(1);
    expect(mockAddCaught).toHaveBeenCalledWith(1);
  });

  it("calls removeCaught when user clicks Release on a caught Pokémon", () => {
    mockCaughtIds = new Set([1]);
    mockCaughtAt[1] = "2025-02-01T12:00:00Z";

    render(<Home />);

    const releaseButton = screen.getByRole("button", { name: /release/i });
    fireEvent.click(releaseButton);

    const confirmReleaseButton = screen.getByRole("button", {
      name: /release/i,
    });
    fireEvent.click(confirmReleaseButton);

    expect(mockRemoveCaught).toHaveBeenCalledTimes(1);
    expect(mockRemoveCaught).toHaveBeenCalledWith(1);
  });
});
