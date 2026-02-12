"use client";

import { useEffect, useState } from "react";
import { fetchPokemonList } from "@/services/pokeapi";
import type { Pokemon } from "@/types/pokemon";

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPokemonList(20)
      .then((list) => {
        if (!cancelled) setPokemon(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <main className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Pokémon
        </h1>
        {loading && (
          <p className="text-zinc-600 dark:text-zinc-400">Loading…</p>
        )}
        {error && (
          <p className="text-red-600 dark:text-red-400">Failed to load</p>
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
                <div>
                  <p className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
                    {p.name}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {p.types.length ? p.types.join(", ") : "—"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
