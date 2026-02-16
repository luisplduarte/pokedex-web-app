"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layouts/MainLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { PokemonDetail, usePokemonDetail } from "@/features/pokemon";
import { PokemonNote } from "@/features/notes";
import { usePokedexStore } from "@/store/pokedexStore";
import { getCachedPokemon } from "@/services/pokemonCache";

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id;
  const id =
    typeof idParam === "string" && /^\d+$/.test(idParam)
      ? parseInt(idParam, 10)
      : null;

  const { data: pokemon, isLoading, error } = usePokemonDetail(id);
  const cached = useMemo(
    () => (id != null ? getCachedPokemon(id) : null),
    [id]
  );
  const { caughtIds, caughtAt, addCaught, removeCaught, getNote } =
    usePokedexStore();
  const isCaught = id !== null && caughtIds.has(id);
  const caughtAtDate = id != null ? caughtAt[id] : undefined;

  const displayPokemon = pokemon ?? cached;
  const isFromCache = !pokemon && cached != null;

  return (
    <MainLayout>
      <PageHeader title={displayPokemon ? displayPokemon.name : "Pokémon"}>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.push("/");
            }
          }}
          className="inline-block text-left text-sm text-blue-600 hover:underline dark:text-blue-400"
          aria-label="Back to list"
        >
          ← Back to list
        </button>
      </PageHeader>
      {isLoading && !cached && (
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
          <Spinner />
          <span>Loading…</span>
        </div>
      )}
      {error && !cached && (
        <ErrorMessage
          message={
            error instanceof Error ? error.message : "Failed to load Pokémon"
          }
        />
      )}
      {error && !cached && (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Your Pokédex data is saved.{" "}
          <Link href="/pokedex" className="text-blue-600 hover:underline dark:text-blue-400">
            View your caught Pokémon
          </Link>
          .
        </p>
      )}
      {displayPokemon && (
        <>
          <PokemonDetail
            pokemon={displayPokemon}
            isCaught={isCaught}
            caughtAt={caughtAtDate}
            onCatch={id != null ? () => addCaught(id) : undefined}
            onRelease={id != null ? () => removeCaught(id) : undefined}
            shareNote={id != null ? getNote(id) : undefined}
            isFromCache={isFromCache}
          />
          {id != null && (
            <div className="mt-4">
              <PokemonNote pokemonId={id} />
            </div>
          )}
        </>
      )}
      {!isLoading && !displayPokemon && id == null && (
        <ErrorMessage message="Invalid Pokémon ID" />
      )}
    </MainLayout>
  );
}
