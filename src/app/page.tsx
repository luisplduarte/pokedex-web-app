"use client";

import { usePokemonList } from "@/hooks/usePokemonList";
import { usePokedexStore } from "@/store/pokedexStore";

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
    <div className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <main className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Pokémon
        </h1>
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          Test caught count: {caughtCount}
        </p>
        {loading && (
          <p className="text-zinc-600 dark:text-zinc-400">Loading…</p>
        )}
        {error && (
          <p className="text-red-600 dark:text-red-400">
            {error instanceof Error ? error.message : "Failed to load"}
          </p>
        )}
        {!loading && !error && pokemon.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2">
            {pokemon.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
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
                <button
                  type="button"
                  onClick={() => toggleCaught(p.id, caughtIds.has(p.id))}
                  className="shrink-0 rounded-md border border-zinc-300 bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  {caughtIds.has(p.id) ? "Release" : "Catch"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
