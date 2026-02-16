"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { usePokemonListInfinite } from "@/hooks/usePokemonList";
import { usePokedexStore } from "@/store/pokedexStore";
import { MainLayout } from "@/components/layouts/MainLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { PokemonList } from "@/features/pokemon";
import { FilterBar, useFilters } from "@/features/filters";
import {
  filterByName,
  filterByType,
  filterByHeightRange,
  filterByWeightRange,
  sortBy,
} from "@/utils/filters";
import type { Pokemon } from "@/types/pokemon";

type ListItem = Pokemon & { caughtAt?: string };

function HomeContent() {
  const {
    pokemon,
    isLoading: loading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePokemonListInfinite();
  const caughtIds = usePokedexStore((s) => s.caughtIds);
  const caughtAt = usePokedexStore((s) => s.caughtAt);
  const addCaught = usePokedexStore((s) => s.addCaught);
  const removeCaught = usePokedexStore((s) => s.removeCaught);

  const filters = useFilters();
  const {
    nameQuery,
    selectedTypes,
    sortKey,
    sortDir,
    minHeight,
    maxHeight,
    minWeight,
    maxWeight,
  } = filters;

  const filteredAndSorted = useMemo((): Pokemon[] => {
    const withCaughtAt: ListItem[] = pokemon.map((p) => ({
      ...p,
      caughtAt: caughtAt[p.id],
    }));
    const byName = filterByName(withCaughtAt, nameQuery);
    const byType = filterByType(byName, selectedTypes);
    const byHeight = filterByHeightRange(byType, minHeight, maxHeight);
    const byWeight = filterByWeightRange(byHeight, minWeight, maxWeight);
    return sortBy(byWeight, sortKey, sortDir);
  }, [
    pokemon,
    caughtAt,
    nameQuery,
    selectedTypes,
    sortKey,
    sortDir,
    minHeight,
    maxHeight,
    minWeight,
    maxWeight,
  ]);

  const toggleCaught = (id: number, isCaught: boolean) => {
    if (isCaught) removeCaught(id);
    else addCaught(id);
  };

  return (
    <MainLayout>
      <PageHeader title="Pokémon">
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
      {!loading && !error && pokemon.length === 0 && (
        <p className="text-zinc-600 dark:text-zinc-400">No Pokémon found.</p>
      )}
      {!loading && !error && pokemon.length > 0 && (
        <>
          <FilterBar {...filters} />
          <PokemonList
            pokemon={filteredAndSorted}
            caughtIds={caughtIds}
            onToggleCaught={toggleCaught}
          />
          {hasNextPage && (
            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                variant="secondary"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="flex items-center gap-2"
              >
                {isFetchingNextPage ? (
                  <>
                    <Spinner />
                    Loading…
                  </>
                ) : (
                  "Load more"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <PageHeader title="Pokémon">
            <Link
              href="/pokedex"
              className="mt-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              My Pokédex →
            </Link>
          </PageHeader>
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <Spinner />
            <span>Loading…</span>
          </div>
        </MainLayout>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
