"use client";

import { usePokemonList } from "@/hooks/usePokemonList";
import { usePokedexStore } from "@/store/pokedexStore";
import { MainLayout } from "@/components/layouts/MainLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { PokemonList } from "@/features/pokemon";

export default function Home() {
  const { data: pokemon = [], isLoading: loading, error } = usePokemonList(20);
  const caughtIds = usePokedexStore((s) => s.caughtIds);
  const addCaught = usePokedexStore((s) => s.addCaught);
  const removeCaught = usePokedexStore((s) => s.removeCaught);
  const caughtCount = caughtIds.size;

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
        <PokemonList
          pokemon={pokemon}
          caughtIds={caughtIds}
          onToggleCaught={toggleCaught}
        />
      )}
    </MainLayout>
  );
}
