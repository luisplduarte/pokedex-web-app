import type { Pokemon, PokemonDetail } from "@/types/pokemon";
import type {
  PokemonDetailApiResponse,
  PokemonListApiResponse,
} from "@/types/api";
import { POKEAPI_BASE_URL } from "@/lib/constants";

const STAT_NAMES: (keyof PokemonDetail["stats"])[] = [
  "hp",
  "attack",
  "defense",
  "special-attack",
  "special-defense",
  "speed",
];

function getPokemonIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, "").split("/");
  return parseInt(parts[parts.length - 1] ?? "0", 10);
}

function mapStatsFromApi(
  stats: PokemonDetailApiResponse["stats"]
): PokemonDetail["stats"] {
  const byName = Object.fromEntries(
    stats.map((s) => [s.stat.name, s.base_stat])
  );
  return STAT_NAMES.reduce(
    (acc, key) => {
      acc[key] = Number(byName[key]) || 0;
      return acc;
    },
    {} as PokemonDetail["stats"]
  );
}

function mapDetailToPokemon(detail: PokemonDetailApiResponse): Pokemon {
  return {
    id: detail.id,
    name: detail.name,
    imageUrl: detail.sprites.front_default ?? null,
    types: detail.types.map((t) => t.type.name),
  };
}

function mapDetailResponseToPokemonDetail(
  detail: PokemonDetailApiResponse
): PokemonDetail {
  return {
    ...mapDetailToPokemon(detail),
    height: detail.height,
    weight: detail.weight,
    stats: mapStatsFromApi(detail.stats),
  };
}

/**
 * Fetches the Pokémon list from PokéAPI.
 * Each list entry is resolved via the detail endpoint to get imageUrl and types.
 */
export async function fetchPokemonList(
  limit: number = 20
): Promise<Pokemon[]> {
  const { results } = await fetchPokemonListPage(limit, 0);
  return results;
}

/**
 * Fetches one page of the Pokémon list (for pagination).
 * Returns results and total count from the API.
 */
export async function fetchPokemonListPage(
  limit: number,
  offset: number
): Promise<{ results: Pokemon[]; total: number }> {
  const listRes = await fetch(
    `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );
  if (!listRes.ok) {
    throw new Error(`Failed to fetch list: ${listRes.status}`);
  }
  const listData: PokemonListApiResponse = await listRes.json();
  const ids = listData.results.map((r) => getPokemonIdFromUrl(r.url));
  const total = listData.count ?? 0;

  const details = await Promise.all(
    ids.map((id) =>
      fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`).then(async (res) => {
        if (!res.ok) throw new Error(`Failed to fetch pokemon ${id}`);
        return res.json() as Promise<PokemonDetailApiResponse>;
      })
    )
  );

  return { results: details.map(mapDetailToPokemon), total };
}

/**
 * Fetches a single Pokémon by id from PokéAPI.
 * Returns full detail: height, weight, stats, plus list fields.
 */
export async function fetchPokemonById(id: number): Promise<PokemonDetail> {
  const res = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch pokemon ${id}: ${res.status}`);
  }
  const data: PokemonDetailApiResponse = await res.json();
  return mapDetailResponseToPokemonDetail(data);
}
