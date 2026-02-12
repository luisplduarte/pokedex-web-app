"use client";

import { usePokemonList } from "@/hooks/usePokemonList";
import { usePokedexStore } from "@/store/pokedexStore";
import { MainLayout } from "@/components/layouts/MainLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Card } from "@/components/ui/Card";

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
        <ul className="grid gap-4 sm:grid-cols-2">
          {pokemon.map((p) => (
            <li key={p.id}>
              <Card className="flex items-center gap-4 p-4">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- external API URL; next/image config in later phase
                  <img
                    src={p.imageUrl}
                    alt=""
                    className="h-16 w-16 object-contain"
                  />
                ) : (
                  <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
                    {p.name}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {p.types.length ? p.types.join(", ") : "—"}
                  </p>
                </div>
                <Button
                  onClick={() => toggleCaught(p.id, caughtIds.has(p.id))}
                >
                  {caughtIds.has(p.id) ? "Release" : "Catch"}
                </Button>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </MainLayout>
  );
}
