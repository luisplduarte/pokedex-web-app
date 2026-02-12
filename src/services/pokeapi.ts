import type { Pokemon } from "@/types/pokemon";
import type {
  PokemonDetailApiResponse,
  PokemonListApiResponse,
} from "@/types/api";
import { POKEAPI_BASE_URL } from "@/lib/constants";

function getPokemonIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, "").split("/");
  return parseInt(parts[parts.length - 1] ?? "0", 10);
}

function mapDetailToPokemon(detail: PokemonDetailApiResponse): Pokemon {
  return {
    id: detail.id,
    name: detail.name,
    imageUrl: detail.sprites.front_default ?? null,
    types: detail.types.map((t) => t.type.name),
  };
}

/**
 * Fetches the Pokémon list from PokéAPI. 
 * Each list entry is resolved via the detail endpoint to get imageUrl and types.
 */
export async function fetchPokemonList(
  limit: number = 20
): Promise<Pokemon[]> {
  const listRes = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}`);
  if (!listRes.ok) {
    throw new Error(`Failed to fetch list: ${listRes.status}`);
  }
  const listData: PokemonListApiResponse = await listRes.json();
  const ids = listData.results.map((r) => getPokemonIdFromUrl(r.url));

  const details = await Promise.all(
    ids.map((id) =>
      fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`).then(async (res) => {
        if (!res.ok) throw new Error(`Failed to fetch pokemon ${id}`);
        return res.json() as Promise<PokemonDetailApiResponse>;
      })
    )
  );

  return details.map(mapDetailToPokemon);
}
