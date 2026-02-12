import type { Pokemon } from "@/types/pokemon";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface PokemonListItemProps {
  pokemon: Pokemon;
  isCaught: boolean;
  onToggle: () => void;
  /** When false, the Catch/Release button is hidden (e.g. on Pokédex page). Default true. */
  showCatchButton?: boolean;
}

export function PokemonListItem({
  pokemon,
  isCaught,
  onToggle,
  showCatchButton = true,
}: PokemonListItemProps) {
  return (
    <Card className="flex items-center gap-4 p-4">
      {pokemon.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- external API URL
        <img
          src={pokemon.imageUrl}
          alt=""
          className="h-16 w-16 object-contain"
        />
      ) : (
        <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800" />
      )}
      <div className="min-w-0 flex-1">
        <p className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
          {pokemon.name}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {pokemon.types.length ? pokemon.types.join(", ") : "—"}
        </p>
      </div>
      {showCatchButton && (
        <Button onClick={onToggle}>{isCaught ? "Release" : "Catch"}</Button>
      )}
    </Card>
  );
}
