import type { Pokemon } from "@/types/pokemon";

export interface ShareablePokemonOptions {
  /** Base URL for the detail link (e.g. window.location.origin). Required in SSR/tests. */
  baseUrl?: string;
}

export interface ShareablePokemonResult {
  url: string;
  text: string;
}

function getDefaultBaseUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "";
}

/**
 * Build shareable URL and text for one Pokémon. Both url and text are the detail link.
 */
export function buildShareablePokemon(
  pokemon: Pick<Pokemon, "id">,
  options?: ShareablePokemonOptions
): ShareablePokemonResult {
  const baseUrl = options?.baseUrl ?? getDefaultBaseUrl();
  const path = `/pokemon/${Number(pokemon.id)}`;
  const url = baseUrl ? `${baseUrl.replace(/\/$/, "")}${path}` : path;
  return { url, text: url };
}
