/** PokéAPI list endpoint: GET /pokemon?limit=... */
export interface PokemonListApiResponse {
  results: Array<{ name: string; url: string }>;
}

/** PokéAPI detail endpoint: GET /pokemon/{id} — list + detail fields */
export interface PokemonDetailApiResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: { front_default: string | null };
  types: Array<{ type: { name: string } }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
}
