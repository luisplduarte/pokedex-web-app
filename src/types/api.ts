/** PokéAPI list endpoint: GET /pokemon?limit=... */
export interface PokemonListApiResponse {
  results: Array<{ name: string; url: string }>;
}

/** PokéAPI detail endpoint: GET /pokemon/{id} — only fields we use for list */
export interface PokemonDetailApiResponse {
  id: number;
  name: string;
  sprites: { front_default: string | null };
  types: Array<{ type: { name: string } }>;
}
