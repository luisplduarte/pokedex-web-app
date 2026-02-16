import Link from "next/link";
import type { Pokemon } from "@/types/pokemon";
import { Card } from "@/components/ui/Card";
import { getTypeIconUrl } from "@/features/filters/typeIcons";

interface PokemonListItemProps {
  pokemon: Pokemon;
  isCaught: boolean;
  onToggle: () => void;
  /** When false, the Catch/Release button is hidden (e.g. on Pokédex page). Default true. */
  showCatchButton?: boolean;
  /** When true, show a Release button that calls onRemove (e.g. on Pokédex page). */
  showRemoveButton?: boolean;
  onRemove?: () => void;
}

export function PokemonListItem({
  pokemon,
  isCaught,
  onToggle,
  showCatchButton = true,
  showRemoveButton = false,
  onRemove,
}: PokemonListItemProps) {
  return (
    <Card
      className={`flex items-center gap-4 p-4 ${
        isCaught ? "opacity-70" : ""
      }`}
    >
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
          <Link
            href={`/pokemon/${pokemon.id}`}
            className="text-white hover:underline dark:text-white"
          >
            {pokemon.name}
          </Link>
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {pokemon.types.length ? (
            pokemon.types.map((type) => {
              const iconUrl = getTypeIconUrl(type);
              return iconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- external sprite URL
                <img
                  key={type}
                  src={iconUrl}
                  alt={type}
                  width={30}
                  height={30}
                  className="shrink-0"
                />
              ) : (
                <span
                  key={type}
                  className="text-sm capitalize text-zinc-500 dark:text-zinc-400"
                >
                  {type}
                </span>
              );
            })
          ) : (
            <span className="text-sm text-zinc-500 dark:text-zinc-400">—</span>
          )}
        </div>
      </div>
      {showCatchButton && (
        <button
          type="button"
          onClick={onToggle}
          className={`shrink-0 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
            isCaught
              ? "border-red-500 bg-red-600 text-white hover:bg-red-700 dark:border-red-500 dark:bg-red-600 dark:hover:bg-red-700"
              : "border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-700 dark:border-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          }`}
          aria-label={isCaught ? `Release ${pokemon.name}` : `Catch ${pokemon.name}`}
        >
          {isCaught ? "Release" : "Catch"}
        </button>
      )}
      {showRemoveButton && onRemove && (
        <Button
          onClick={onRemove}
          variant="secondary"
          aria-label={`Release ${pokemon.name}`}
        >
          Release
        </Button>
      )}
    </Card>
  );
}
