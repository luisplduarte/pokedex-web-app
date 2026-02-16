import { useQuery } from "@tanstack/react-query";
import { fetchPokemonById } from "@/services/pokeapi";
import { setCachedPokemon } from "@/services/pokemonCache";
import type { PokemonDetail } from "@/types/pokemon";

export function usePokemonDetail(id: number | null | undefined) {
  return useQuery<PokemonDetail, Error>({
    queryKey: ["pokemon", "detail", id],
    queryFn: async () => {
      const data = await fetchPokemonById(id!);
      setCachedPokemon(data);
      return data;
    },
    enabled: id != null && id > 0,
  });
}
