"use client";

import { useEffect } from "react";
import { usePokedexStore } from "@/store/pokedexStore";

/** Runs once on mount to load persisted pokedex state into the store. */
export function PokedexHydrate() {
  const hydrate = usePokedexStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return null;
}
