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

const LIST_LIMIT = 151;

export default function PokedexPage() {
  const { data: allPokemon = [], isLoading, error } = usePokemonList(LIST_LIMIT);
  const caughtIds = usePokedexStore((s) => s.caughtIds);
  const caughtAt = usePokedexStore((s) => s.caughtAt);
  const removeCaught = usePokedexStore((s) => s.removeCaught);

  const filters = useFilters();
  const { nameQuery, selectedTypes, sortKey, sortDir } = filters;

  const caughtPokemon = useMemo(
    () => allPokemon.filter((p) => caughtIds.has(p.id)),
    [allPokemon, caughtIds]
  );

  const filteredAndSorted = useMemo((): Pokemon[] => {
    const withCaughtAt: ListItem[] = caughtPokemon.map((p) => ({
      ...p,
      caughtAt: caughtAt[p.id],
    }));
    const byName = filterByName(withCaughtAt, nameQuery);
    const byType = filterByType(byName, selectedTypes);
    return sortBy(byType, sortKey, sortDir);
  }, [caughtPokemon, caughtAt, nameQuery, selectedTypes, sortKey, sortDir]);

  const noCaught = caughtIds.size === 0;

  return (
    <MainLayout>
      <PageHeader title="My Pokédex">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {caughtIds.size} caught
        </p>
        <Link
          href="/"
          className="mt-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to all Pokémon
        </Link>
      </PageHeader>
      {isLoading && (
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
      {!isLoading && !error && noCaught && (
        <p className="text-zinc-600 dark:text-zinc-400">
          You haven&apos;t caught any Pokémon yet.{" "}
          <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
            Catch some on the list
          </Link>
          .
        </p>
      )}
      {!isLoading && !error && !noCaught && caughtPokemon.length > 0 && (
        <>
          <FilterBar {...filters} />
          <PokemonList
            pokemon={filteredAndSorted}
            caughtIds={caughtIds}
            onToggleCaught={() => {}}
            showCatchButton={false}
            showRemoveButton
            onRemove={removeCaught}
          />
        </>
      )}
    </MainLayout>
  );
}
