import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PokemonNote } from "./PokemonNote";
import { usePokedexStore } from "@/store/pokedexStore";

vi.mock("@/store/pokedexStore", () => ({
  usePokedexStore: vi.fn(),
}));

function mockStore(note: string, setNote: (id: number, text: string) => void) {
  (usePokedexStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    (selector: (state: unknown) => unknown) => {
      const state = {
        notes: { 7: note },
        setNote,
      };
      return selector(state);
    }
  );
}

describe("PokemonNote", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders label and textarea with current note", () => {
    mockStore("existing note", vi.fn());
    render(<PokemonNote pokemonId={7} />);

    expect(screen.getByLabelText("Note")).toBeInTheDocument();
    const textarea = screen.getByPlaceholderText(/Add a note/);
    expect(textarea).toHaveValue("existing note");
  });

  it("renders empty textarea when no note", () => {
    (usePokedexStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = { notes: {}, setNote: vi.fn() };
        return selector(state);
      }
    );
    render(<PokemonNote pokemonId={7} />);

    expect(screen.getByPlaceholderText(/Add a note/)).toHaveValue("");
  });

  it("calls setNote when user types", () => {
    const setNote = vi.fn();
    mockStore("", setNote);
    render(<PokemonNote pokemonId={7} />);

    const textarea = screen.getByPlaceholderText(/Add a note/);
    fireEvent.change(textarea, { target: { value: "new text" } });

    expect(setNote).toHaveBeenCalledWith(7, "new text");
  });
});
