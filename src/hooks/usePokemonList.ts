import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchPokemonList, fetchPokemonListPage } from "@/services/pokeapi";
import type { Pokemon } from "@/types/pokemon";

const PAGE_SIZE = 20;

export function usePokemonList(limit: number = 20) {
  return useQuery<Pokemon[], Error>({
    queryKey: ["pokemon", "list", limit],
    queryFn: () => fetchPokemonList(limit),
  });
}

export function usePokemonListInfinite() {
  const query = useInfiniteQuery({
    queryKey: ["pokemon", "list", "infinite"],
    queryFn: ({ pageParam }) =>
      fetchPokemonListPage(PAGE_SIZE, pageParam as number),
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
