"use client";

import { Suspense, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePokemonList } from "@/hooks/usePokemonList";
import { usePokedexStore } from "@/store/pokedexStore";
import { MainLayout } from "@/components/layouts/MainLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";
import {
  PokedexTable,
  PokedexCardGrid,
  PokedexViewToggle,
  PokedexProgress,
  usePokedexViewMode,
  type PokedexTableRow,
} from "@/features/pokedex";
import { FilterBar, useFilters } from "@/features/filters";
import {
  filterByName,
  filterByType,
  sortBy,
} from "@/utils/filters";
import { buildCsv, type CsvExportRow } from "@/utils/csvExport";
import { downloadCsv } from "@/utils/downloadCsv";
import type { Pokemon } from "@/types/pokemon";

type ListItem = Pokemon & { caughtAt?: string };

const LIST_LIMIT = 151;

function PokedexContent() {
  const { data, isLoading, error } = usePokemonList(LIST_LIMIT);
  const allPokemon = data?.pokemon ?? [];
  const totalFromApi = data?.total;
  const caughtIds = usePokedexStore((s) => s.caughtIds);
  const caughtAt = usePokedexStore((s) => s.caughtAt);
  const getNote = usePokedexStore((s) => s.getNote);
  const removeCaught = usePokedexStore((s) => s.removeCaught);

  const filters = useFilters();
  const { nameQuery, selectedTypes, sortKey, sortDir } = filters;
  const { viewMode, setViewMode } = usePokedexViewMode();

  const caughtPokemon = useMemo(
    () => allPokemon.filter((p) => caughtIds.has(p.id)),
    [allPokemon, caughtIds]
  );

  const tableRows = useMemo((): PokedexTableRow[] => {
    const withCaughtAt: ListItem[] = caughtPokemon.map((p) => ({
      ...p,
      caughtAt: caughtAt[p.id],
    }));
    const byName = filterByName(withCaughtAt, nameQuery);
    const byType = filterByType(byName, selectedTypes);
    const sorted = sortBy(byType, sortKey, sortDir);
    return sorted.map((p) => ({
      id: p.id,
      name: p.name,
      imageUrl: p.imageUrl,
      types: p.types,
      height: p.height,
      weight: p.weight,
      caughtAt: caughtAt[p.id],
      note: getNote(p.id),
    }));
  }, [caughtPokemon, caughtAt, getNote, nameQuery, selectedTypes, sortKey, sortDir]);

  const noCaught = caughtIds.size === 0;

  const handleExportCsv = useCallback(() => {
    const caught = allPokemon.filter((p) => caughtIds.has(p.id));
    const rows: CsvExportRow[] = caught.map((p) => ({
      id: p.id,
      name: p.name,
      types: p.types,
      caughtAt: caughtAt[p.id],
      note: getNote(p.id),
    }));
    const csv = buildCsv(rows);
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(csv, `pokedex-${date}.csv`);
  }, [allPokemon, caughtIds, caughtAt, getNote]);

  return (
    <MainLayout>
      <PageHeader title="My Pokédex">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleExportCsv}
            aria-label="Export Pokédex as CSV"
          >
            Export CSV
          </Button>
        </div>
        <Link
          href="/"
          className="mt-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to all Pokémon
        </Link>
      </PageHeader>
      {totalFromApi != null && (
        <div className="mt-4 flex justify-center">
          <PokedexProgress total={totalFromApi} />
        </div>
      )}
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
          <FilterBar {...filters}>
            <PokedexViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          </FilterBar>
          {viewMode === "table" ? (
            <PokedexTable data={tableRows} onRemove={removeCaught} />
          ) : (
            <PokedexCardGrid data={tableRows} onRemove={removeCaught} />
          )}
        </>
      )}
    </MainLayout>
  );
}

export default function PokedexPage() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <PageHeader title="My Pokédex">
            <Link
              href="/"
              className="mt-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              ← Back to all Pokémon
            </Link>
          </PageHeader>
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <Spinner />
            <span>Loading…</span>
          </div>
        </MainLayout>
      }
    >
      <PokedexContent />
    </Suspense>
  );
}
