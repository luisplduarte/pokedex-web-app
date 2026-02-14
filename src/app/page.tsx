"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePokemonList } from "@/hooks/usePokemonList";
import { usePokedexStore } from "@/store/pokedexStore";
import { MainLayout } from "@/components/layouts/MainLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { PokemonList } from "@/features/pokemon";
import { FilterBar, useFilters } from "@/features/filters";
import {
  filterByName,
  filterByType,
  sortBy,
} from "@/utils/filters";
import type { Pokemon } from "@/types/pokemon";

type ListItem = Pokemon & { caughtAt?: string };

export default function Home() {
  const { data: pokemon = [], isLoading: loading, error } = usePokemonList(20);
  const caughtIds = usePokedexStore((s) => s.caughtIds);
  const caughtAt = usePokedexStore((s) => s.caughtAt);
  const addCaught = usePokedexStore((s) => s.addCaught);
  const removeCaught = usePokedexStore((s) => s.removeCaught);
  const caughtCount = caughtIds.size;

  const filters = useFilters();
  const { nameQuery, selectedTypes, sortKey, sortDir } = filters;

  const filteredAndSorted = useMemo((): Pokemon[] => {
    const withCaughtAt: ListItem[] = pokemon.map((p) => ({
      ...p,
      caughtAt: caughtAt[p.id],
    }));
    const byName = filterByName(withCaughtAt, nameQuery);
    const byType = filterByType(byName, selectedTypes);
    return sortBy(byType, sortKey, sortDir);
  }, [pokemon, caughtAt, nameQuery, selectedTypes, sortKey, sortDir]);

  const toggleCaught = (id: number, isCaught: boolean) => {
    if (isCaught) removeCaught(id);
    else addCaught(id);
  };

  return (
    <MainLayout>
      <PageHeader title="Pokémon">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Test caught count: {caughtCount}
        </p>
        <Link
          href="/pokedex"
          className="mt-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          My Pokédex →
        </Link>
      </PageHeader>
      {loading && (
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
          <Spinner />
          <span>Loading…</span>
        </div>
      )}
      {error && (
        <ErrorMessage
          message={
            error instanceof Error ? error.message : "Failed to load Pokémon"
          }
        />
      )}
      {!loading && !error && pokemon.length > 0 && (
        <>
          <FilterBar {...filters} />
          <PokemonList
            pokemon={filteredAndSorted}
            caughtIds={caughtIds}
            onToggleCaught={toggleCaught}
          />
        </>
      )}
    </MainLayout>
  );
}
