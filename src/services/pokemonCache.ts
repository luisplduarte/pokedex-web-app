import { POKEMON_CACHE_KEY } from "@/lib/constants";
import type { CachedPokemon } from "@/types/pokemon";

function isCachedPokemon(value: unknown): value is CachedPokemon {
  if (value == null || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "number" &&
    typeof o.name === "string" &&
    Array.isArray(o.types)
  );
}

function loadRaw(): Record<string, CachedPokemon> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(POKEMON_CACHE_KEY);
    if (raw == null) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed == null || typeof parsed !== "object") return {};
    const out: Record<string, CachedPokemon> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (isCachedPokemon(value)) out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

export function getCachedPokemon(id: number): CachedPokemon | null {
  const all = loadRaw();
  const entry = all[String(id)];
  return entry ?? null;
}

export function getCachedPokemonMany(ids: number[]): CachedPokemon[] {
  const all = loadRaw();
  return ids
    .map((id) => all[String(id)])
    .filter((p): p is CachedPokemon => p != null);
}

export function setCachedPokemon(pokemon: CachedPokemon): void {
  if (typeof window === "undefined") return;
  try {
    const all = loadRaw();
    all[String(pokemon.id)] = pokemon;
    localStorage.setItem(POKEMON_CACHE_KEY, JSON.stringify(all));
  } catch {
  }
}

export function setCachedPokemonMany(pokemonList: CachedPokemon[]): void {
  if (typeof window === "undefined" || pokemonList.length === 0) return;
  try {
    const all = loadRaw();
    for (const p of pokemonList) {
      all[String(p.id)] = p;
    }
    localStorage.setItem(POKEMON_CACHE_KEY, JSON.stringify(all));
  } catch {
  }
}
