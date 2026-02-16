import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchPokemonListPage } from "@/services/pokeapi";
import { setCachedPokemonMany } from "@/services/pokemonCache";
import type { Pokemon } from "@/types/pokemon";

const PAGE_SIZE = 20;

interface PokemonListResult {
  pokemon: Pokemon[];
  total: number;
}

export function usePokemonList(limit: number = 20) {
  return useQuery<PokemonListResult, Error>({
    queryKey: ["pokemon", "list", limit],
    queryFn: async () => {
      const { results, total } = await fetchPokemonListPage(limit, 0);
      setCachedPokemonMany(results);
      return { pokemon: results, total };
    },
  });
}

export function usePokemonListInfinite() {
  const query = useInfiniteQuery({
    queryKey: ["pokemon", "list", "infinite"],
    queryFn: async ({ pageParam }) => {
      const page = await fetchPokemonListPage(PAGE_SIZE, pageParam as number);
      setCachedPokemonMany(page.results);
      return page;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.results.length, 0);
      return loaded < lastPage.total ? loaded : undefined;
    },
  });

  const pokemon = query.data?.pages.flatMap((p) => p.results) ?? [];

  return {
    ...query,
    pokemon,
  };
}
