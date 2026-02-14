import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { usePokedexViewMode } from "./usePokedexViewMode";
import { POKEDEX_VIEW_MODE_KEY } from "@/lib/constants";

describe("usePokedexViewMode", () => {
  beforeEach(() => {
    localStorage.removeItem(POKEDEX_VIEW_MODE_KEY);
  });

  it("returns grid by default when localStorage is empty", async () => {
    const { result } = renderHook(() => usePokedexViewMode());

    await waitFor(() => {
      expect(result.current.viewMode).toBe("grid");
    });
  });

  it("setViewMode updates viewMode and persists to localStorage", async () => {
    const { result } = renderHook(() => usePokedexViewMode());

    await waitFor(() => {
      expect(result.current.viewMode).toBe("grid");
    });

    act(() => {
      result.current.setViewMode("table");
    });

    expect(result.current.viewMode).toBe("table");
    expect(localStorage.getItem(POKEDEX_VIEW_MODE_KEY)).toBe("table");
  });

  it("hydrates from localStorage on mount", async () => {
    localStorage.setItem(POKEDEX_VIEW_MODE_KEY, "table");

    const { result } = renderHook(() => usePokedexViewMode());

    await waitFor(() => {
      expect(result.current.viewMode).toBe("table");
    });
  });

  it("falls back to grid when stored value is invalid", async () => {
    localStorage.setItem(POKEDEX_VIEW_MODE_KEY, "invalid");

    const { result } = renderHook(() => usePokedexViewMode());

    await waitFor(() => {
      expect(result.current.viewMode).toBe("grid");
    });
  });
});
