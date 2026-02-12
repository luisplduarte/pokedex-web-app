import { useQuery } from "@tanstack/react-query";
import { fetchPokemonList } from "@/services/pokeapi";
import type { Pokemon } from "@/types/pokemon";

export function usePokemonList(limit: number = 20) {
  return useQuery<Pokemon[], Error>({
    queryKey: ["pokemon", "list", limit],
    queryFn: () => fetchPokemonList(limit),
  });
}
