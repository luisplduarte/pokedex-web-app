import type { PokemonDetail } from "@/types/pokemon";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getTypeIconUrl } from "@/features/filters/typeIcons";
import { Trash2 } from "lucide-react";

interface PokemonDetailProps {
  pokemon: PokemonDetail;
  /** When true, show "Caught at {date}" and allow release. */
  isCaught?: boolean;
  caughtAt?: string;
  onCatch?: () => void;
  onRelease?: () => void;
}

const heightInM = (dm: number) => dm / 10;
const weightInKg = (hg: number) => hg / 10;

const STAT_LABELS: Record<keyof PokemonDetail["stats"], string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Special Attack",
  "special-defense": "Special Defense",
  speed: "Speed",
};

function formatCaughtAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function PokemonDetail({
  pokemon,
  isCaught = false,
  caughtAt,
  onCatch,
  onRelease,
}: PokemonDetailProps) {
  const statsEntries = Object.entries(pokemon.stats) as [
    keyof PokemonDetail["stats"],
    number
  ][];

  return (
    <div className="space-y-4">
      <Card className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start">
        {pokemon.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- external API URL
          <img
            src={pokemon.imageUrl}
            alt=""
            className="h-32 w-32 object-contain sm:h-40 sm:w-40"
          />
        ) : (
          <div className="h-32 w-32 bg-zinc-100 dark:bg-zinc-800 sm:h-40 sm:w-40" />
        )}
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-2xl font-bold capitalize text-zinc-900 dark:text-zinc-100">
              {pokemon.name}
            </h1>
            {isCaught && onRelease && (
              <button
                type="button"
                onClick={onRelease}
                className="inline-flex items-center justify-center text-red-500 hover:text-red-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                aria-label={`Release ${pokemon.name}`}
              >
                <Trash2 className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5 sm:justify-start">
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
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                —
              </span>
            )}
          </div>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <div>
              <dt className="inline font-medium text-zinc-500 dark:text-zinc-400">
                Height:{" "}
              </dt>
              <dd className="inline text-zinc-900 dark:text-zinc-100">
                {heightInM(pokemon.height)} m
              </dd>
            </div>
            <div>
              <dt className="inline font-medium text-zinc-500 dark:text-zinc-400">
                Weight:{" "}
              </dt>
              <dd className="inline text-zinc-900 dark:text-zinc-100">
                {weightInKg(pokemon.weight)} kg
              </dd>
            </div>
            {isCaught && caughtAt && (
              <div>
                <dt className="inline font-medium text-zinc-500 dark:text-zinc-400">
                  Caught at:{" "}
                </dt>
                <dd className="inline text-zinc-900 dark:text-zinc-100">
                  {formatCaughtAt(caughtAt)}
                </dd>
              </div>
            )}
          </dl>
          {!isCaught && onCatch && (
            <div className="mt-4">
              <Button
                onClick={onCatch}
                aria-label={`Catch ${pokemon.name}`}
              >
                Catch
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Base stats
        </h2>
        <dl className="space-y-2">
          {statsEntries.map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <dt className="text-zinc-600 dark:text-zinc-400">
                {STAT_LABELS[key]}
              </dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
