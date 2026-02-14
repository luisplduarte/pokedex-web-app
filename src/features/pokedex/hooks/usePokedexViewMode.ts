"use client";

import { useEffect, useState } from "react";
import { POKEDEX_VIEW_MODE_KEY } from "@/lib/constants";

export type PokedexViewMode = "table" | "grid";

const VALID_VIEW_MODES: PokedexViewMode[] = ["table", "grid"];

function getStoredViewMode(): PokedexViewMode {
  if (typeof window === "undefined") return "grid";
  try {
    const raw = localStorage.getItem(POKEDEX_VIEW_MODE_KEY);
    if (raw != null && VALID_VIEW_MODES.includes(raw as PokedexViewMode)) {
      return raw as PokedexViewMode;
    }
  } catch {
  }
  return "grid";
}

export function usePokedexViewMode(): {
  viewMode: PokedexViewMode;
  setViewMode: (mode: PokedexViewMode) => void;
} {
  const [viewMode, setViewModeState] = useState<PokedexViewMode>("grid");

  // Hydrate from localStorage on mount (client-only)
  useEffect(() => {
    setViewModeState(getStoredViewMode());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(POKEDEX_VIEW_MODE_KEY, viewMode);
    } catch {
    }
  }, [viewMode]);

  return {
    viewMode,
    setViewMode: setViewModeState,
  };
}
