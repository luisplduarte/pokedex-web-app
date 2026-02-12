import type { Pokemon } from "@/types/pokemon";
import { PokemonListItem } from "./PokemonListItem";

interface PokemonListProps {
  pokemon: Pokemon[];
  caughtIds: Set<number>;
  onToggleCaught: (id: number, isCaught: boolean) => void;
  /** When false, Catch/Release buttons are hidden. Default true. */
  showCatchButton?: boolean;
}

export function PokemonList({
  pokemon,
  caughtIds,
  onToggleCaught,
  showCatchButton = true,
}: PokemonListProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {pokemon.map((p) => (
        <li key={p.id}>
          <PokemonListItem
            pokemon={p}
            isCaught={caughtIds.has(p.id)}
            onToggle={() => onToggleCaught(p.id, caughtIds.has(p.id))}
            showCatchButton={showCatchButton}
          />
        </li>
      ))}
    </ul>
  );
}
