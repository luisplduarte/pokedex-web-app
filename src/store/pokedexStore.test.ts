import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as storage from "@/services/storage";
import { usePokedexStore } from "./pokedexStore";

vi.mock("@/services/storage", () => ({
  load: vi.fn(),
  save: vi.fn(),
}));

function resetStore() {
  vi.mocked(storage.load).mockReturnValue({ caught: [], notes: {} });
  usePokedexStore.getState().hydrate();
}

describe("pokedexStore notes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetStore();
  });

  it("getNote returns empty string when no note set", () => {
    expect(usePokedexStore.getState().getNote(1)).toBe("");
    expect(usePokedexStore.getState().getNote(99)).toBe("");
  });

  it("setNote and getNote round-trip", () => {
    usePokedexStore.getState().setNote(1, "my note");
    expect(usePokedexStore.getState().getNote(1)).toBe("my note");

    usePokedexStore.getState().setNote(1, "updated");
    expect(usePokedexStore.getState().getNote(1)).toBe("updated");
  });

  it("persists notes via storage.save when setNote is called", () => {
    usePokedexStore.getState().setNote(5, "hello");

    expect(storage.save).toHaveBeenCalledWith(
      expect.objectContaining({
        notes: { "5": "hello" },
      })
    );
  });

  it("removeCaught clears note for that id", () => {
    usePokedexStore.getState().addCaught(3);
    usePokedexStore.getState().setNote(3, "some note");
    expect(usePokedexStore.getState().getNote(3)).toBe("some note");

    usePokedexStore.getState().removeCaught(3);
    expect(usePokedexStore.getState().getNote(3)).toBe("");
  });

  it("hydrate restores notes from persisted state", () => {
    vi.mocked(storage.load).mockReturnValue({
      caught: [],
      notes: { "1": "restored note", "2": "another" },
    });
    usePokedexStore.getState().hydrate();

    expect(usePokedexStore.getState().getNote(1)).toBe("restored note");
    expect(usePokedexStore.getState().getNote(2)).toBe("another");
  });
});

describe("pokedexStore when offline", () => {
  const originalOnLine = Object.getOwnPropertyDescriptor(
    navigator,
    "onLine"
  ) as PropertyDescriptor | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    resetStore();
    Object.defineProperty(navigator, "onLine", {
      value: false,
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    if (originalOnLine) {
      Object.defineProperty(navigator, "onLine", originalOnLine);
    }
  });

  it("addCaught, setNote, and removeCaught update store and persist via storage when offline", () => {
    usePokedexStore.getState().addCaught(1);
    expect(usePokedexStore.getState().caughtIds.has(1)).toBe(true);
    expect(storage.save).toHaveBeenLastCalledWith(
      expect.objectContaining({
        caught: expect.arrayContaining([
          expect.objectContaining({ pokemonId: 1, caughtAt: expect.any(String) }),
        ]),
      })
    );

    usePokedexStore.getState().setNote(1, "offline note");
    expect(usePokedexStore.getState().getNote(1)).toBe("offline note");
    expect(storage.save).toHaveBeenLastCalledWith(
      expect.objectContaining({
        notes: { "1": "offline note" },
      })
    );

    usePokedexStore.getState().removeCaught(1);
    expect(usePokedexStore.getState().caughtIds.has(1)).toBe(false);
    expect(usePokedexStore.getState().getNote(1)).toBe("");
    expect(storage.save).toHaveBeenLastCalledWith(
      expect.objectContaining({
        caught: [],
      })
    );
  });
});
