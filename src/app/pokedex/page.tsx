"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePokemonList } from "@/hooks/usePokemonList";
import { usePokedexStore } from "@/store/pokedexStore";
import { MainLayout } from "@/components/layouts/MainLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
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
  const [confirmExportOpen, setConfirmExportOpen] = useState(false);

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
      height: p.height,
      weight: p.weight,
      caughtAt: caughtAt[p.id],
      note: getNote(p.id),
    }));
    const csv = buildCsv(rows);
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(csv, `pokedex-${date}.csv`);
  }, [allPokemon, caughtIds, caughtAt, getNote]);

  return (
    <MainLayout>
      <header className="mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            My Pokédex
          </h1>
          <button
            type="button"
            onClick={() => setConfirmExportOpen(true)}
            aria-label="Export Pokédex as CSV"
            className="ml-1 inline-flex cursor-pointer items-center justify-center rounded-none border-none bg-transparent p-1 text-zinc-900 hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-zinc-100 dark:hover:text-zinc-300"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M6 9.5L10 13.5L14 9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 3.5V13.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M4.75 15.5H15.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <Link
          href="/"
          className="mt-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to all Pokémon
        </Link>
      </header>
      <ConfirmDialog
        open={confirmExportOpen}
        title="Export Pokédex"
        description="Do you want to download your Pokédex as a CSV file?"
        confirmLabel="Export"
        cancelLabel="Cancel"
        confirmTone="primary"
        onConfirm={() => {
          handleExportCsv();
          setConfirmExportOpen(false);
        }}
        onCancel={() => setConfirmExportOpen(false)}
      />
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
