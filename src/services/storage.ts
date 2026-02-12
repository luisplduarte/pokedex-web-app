import { POKEDEX_STORAGE_KEY } from "@/lib/constants";
import type { PokedexPersistedState } from "@/types/pokedex";

function isPersistedState(value: unknown): value is PokedexPersistedState {
  if (value == null || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  if (!Array.isArray(o.caught)) return false;
  return o.caught.every(
    (c: unknown) =>
      c != null &&
      typeof c === "object" &&
      typeof (c as { pokemonId?: unknown }).pokemonId === "number" &&
      typeof (c as { caughtAt?: unknown }).caughtAt === "string"
  );
}

export function load(): PokedexPersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(POKEDEX_STORAGE_KEY);
    if (raw == null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isPersistedState(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function save(state: PokedexPersistedState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(POKEDEX_STORAGE_KEY, JSON.stringify(state));
  } catch {
    
  }
}
