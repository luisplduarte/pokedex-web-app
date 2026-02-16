import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PokemonDetail } from "./PokemonDetail";
import type { PokemonDetail as PokemonDetailType } from "@/types/pokemon";

const mockPokemon: PokemonDetailType = {
  id: 1,
  name: "bulbasaur",
  imageUrl: "https://example.com/1.png",
  types: ["grass", "poison"],
  height: 7,
  weight: 69,
  stats: {
    hp: 45,
    attack: 49,
    defense: 49,
    "special-attack": 65,
    "special-defense": 65,
    speed: 45,
  },
};

describe("PokemonDetail", () => {
  it("renders name, types, height, weight, and base stats", () => {
    render(<PokemonDetail pokemon={mockPokemon} />);

    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    expect(screen.getByAltText(/grass/i)).toBeInTheDocument();
    expect(screen.getByAltText(/poison/i)).toBeInTheDocument();
    expect(screen.getByText(/0.7 m/)).toBeInTheDocument();
    expect(screen.getByText(/6.9 kg/)).toBeInTheDocument();
    expect(screen.getByText("Base stats")).toBeInTheDocument();
    expect(screen.getByText("HP")).toBeInTheDocument();
    expect(screen.getByText("Attack")).toBeInTheDocument();
    expect(screen.getByText("Speed")).toBeInTheDocument();
    // Stats values: HP and Speed 45, Attack and Defense 49
    expect(screen.getAllByText("45")).toHaveLength(2);
    expect(screen.getAllByText("49")).toHaveLength(2);
  });

  it("does not show Caught at when not caught", () => {
    render(<PokemonDetail pokemon={mockPokemon} />);

    expect(screen.queryByText(/Caught at/)).not.toBeInTheDocument();
  });

  it("shows Catch button when onCatch provided and not caught", () => {
    render(
      <PokemonDetail pokemon={mockPokemon} onCatch={vi.fn()} onRelease={vi.fn()} />
    );

    expect(screen.getByRole("button", { name: /catch/i })).toBeInTheDocument();
  });

  it("shows Caught at and Release button when caught", () => {
    const caughtAt = "2025-02-10T14:30:00.000Z";
    render(
      <PokemonDetail
        pokemon={mockPokemon}
        isCaught
        caughtAt={caughtAt}
        onRelease={vi.fn()}
      />
    );

    expect(screen.getByText(/Caught at/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /release/i })).toBeInTheDocument();
  });

  it("calls onCatch when Catch is clicked", () => {
    const onCatch = vi.fn();
    render(
      <PokemonDetail pokemon={mockPokemon} onCatch={onCatch} onRelease={vi.fn()} />
    );

    fireEvent.click(screen.getByRole("button", { name: /catch/i }));

    expect(onCatch).toHaveBeenCalledTimes(1);
  });

  it("calls onRelease when Release is clicked", () => {
    const onRelease = vi.fn();
    render(
      <PokemonDetail
        pokemon={mockPokemon}
        isCaught
        caughtAt="2025-02-10T14:30:00.000Z"
        onCatch={vi.fn()}
        onRelease={onRelease}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /release/i }));

    expect(onRelease).toHaveBeenCalledTimes(1);
  });
});
