"use client";

import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layouts/MainLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { PokemonDetail, usePokemonDetail } from "@/features/pokemon";
import { PokemonNote } from "@/features/notes";
import { SharePokemonButton } from "@/features/sharing";
import { usePokedexStore } from "@/store/pokedexStore";

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id;
  const id =
    typeof idParam === "string" && /^\d+$/.test(idParam)
      ? parseInt(idParam, 10)
      : null;

  const { data: pokemon, isLoading, error } = usePokemonDetail(id);
  const { caughtIds, caughtAt, addCaught, removeCaught, getNote } =
    usePokedexStore();
  const isCaught = id !== null && caughtIds.has(id);
  const caughtAtDate = id != null ? caughtAt[id] : undefined;

  return (
    <MainLayout>
      <PageHeader title={pokemon ? pokemon.name : "Pokémon"}>
        <div className="flex flex-wrap items-center gap-3">
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
          >
            ← Back to list
          </button>
          {pokemon && (
            <SharePokemonButton
              pokemon={pokemon}
              note={id != null ? getNote(id) : undefined}
            />
          )}
        </div>
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
      {!isLoading && !error && pokemon && (
        <>
          <PokemonDetail
            pokemon={pokemon}
            isCaught={isCaught}
            caughtAt={caughtAtDate}
            onCatch={id != null ? () => addCaught(id) : undefined}
            onRelease={id != null ? () => removeCaught(id) : undefined}
          />
          {id != null && (
            <div className="mt-4">
              <PokemonNote pokemonId={id} />
            </div>
          )}
        </>
      )}
      {!isLoading && !error && !pokemon && id == null && (
        <ErrorMessage message="Invalid Pokémon ID" />
      )}
    </MainLayout>
  );
}
