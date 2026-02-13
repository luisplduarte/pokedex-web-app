import { describe, it, expect, beforeEach } from "vitest";
import { load, save } from "./storage";
import { POKEDEX_STORAGE_KEY } from "@/lib/constants";

describe("storage", () => {
  beforeEach(() => {
    localStorage.removeItem(POKEDEX_STORAGE_KEY);
  });

  it("load returns null when key is missing", () => {
    expect(load()).toBeNull();
  });

  it("load returns null when stored value is invalid JSON", () => {
    localStorage.setItem(POKEDEX_STORAGE_KEY, "not json");
    expect(load()).toBeNull();
  });

  it("load returns null when stored value has wrong shape (no caught array)", () => {
    localStorage.setItem(POKEDEX_STORAGE_KEY, JSON.stringify({ notes: {} }));
    expect(load()).toBeNull();
  });

  it("load returns null when notes is not an object", () => {
    localStorage.setItem(
      POKEDEX_STORAGE_KEY,
      JSON.stringify({ caught: [], notes: "invalid" })
    );
    expect(load()).toBeNull();
  });

  it("save and load round-trip state with notes", () => {
    const state = {
      caught: [{ pokemonId: 1, caughtAt: "2025-02-10T12:00:00.000Z" }],
      notes: { "1": "my note", "2": "another" },
    };
    save(state);
    expect(load()).toEqual(state);
  });

  it("save and load round-trip state without notes", () => {
    const state = { caught: [] };
    save(state);
    expect(load()).toEqual(state);
  });
});
