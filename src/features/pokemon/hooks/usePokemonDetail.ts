import { useQuery } from "@tanstack/react-query";
import { fetchPokemonById } from "@/services/pokeapi";
import type { PokemonDetail } from "@/types/pokemon";

export function usePokemonDetail(id: number | null | undefined) {
  return useQuery<PokemonDetail, Error>({
    queryKey: ["pokemon", "detail", id],
    queryFn: () => fetchPokemonById(id!),
    enabled: id != null && id > 0,
  });
}
