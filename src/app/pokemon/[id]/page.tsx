"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/layouts/MainLayout";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { PokemonDetail, usePokemonDetail } from "@/features/pokemon";

export default function PokemonDetailPage() {
  const params = useParams();
  const idParam = params?.id;
  const id =
    typeof idParam === "string" && /^\d+$/.test(idParam)
      ? parseInt(idParam, 10)
      : null;

  const { data: pokemon, isLoading, error } = usePokemonDetail(id);

  return (
    <MainLayout>
      <PageHeader title={pokemon ? pokemon.name : "Pokémon"}>
        <Link
          href="/"
          className="inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to list
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
      {!isLoading && !error && pokemon && <PokemonDetail pokemon={pokemon} />}
      {!isLoading && !error && !pokemon && id == null && (
        <ErrorMessage message="Invalid Pokémon ID" />
      )}
    </MainLayout>
  );
}
