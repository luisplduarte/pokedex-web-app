"use client";

import { Card } from "@/components/ui/Card";
import { usePokedexStore } from "@/store/pokedexStore";

interface PokemonNoteProps {
  pokemonId: number;
}

export function PokemonNote({ pokemonId }: PokemonNoteProps) {
  const note = usePokedexStore((state) => state.notes[pokemonId] ?? "");
  const setNote = usePokedexStore((state) => state.setNote);

  return (
    <Card className="p-6">
      <label
        htmlFor={`pokemon-note-${pokemonId}`}
        className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Note
      </label>
      <textarea
        id={`pokemon-note-${pokemonId}`}
        value={note}
        onChange={(e) => setNote(pokemonId, e.target.value)}
        placeholder="Add a note for this Pokémon…"
        rows={3}
        className="w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
      />
    </Card>
  );
}
