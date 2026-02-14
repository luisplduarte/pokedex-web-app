"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { PokedexTableRow } from "./PokedexTable";

function formatCaughtAt(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function formatHeight(dm?: number): string {
  if (dm == null) return "—";
  return `${(dm / 10).toFixed(1)} m`;
}

function formatWeight(hg?: number): string {
  if (hg == null) return "—";
  return `${(hg / 10).toFixed(1)} kg`;
}

interface PokedexCardGridProps {
  data: PokedexTableRow[];
  onRemove: (id: number) => void;
}

export function PokedexCardGrid({ data, onRemove }: PokedexCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((row) => (
        <Card key={row.id} className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
                {row.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- external API URL
                  <img
                    src={row.imageUrl}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="h-full w-full" aria-hidden />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/pokemon/${row.id}`}
                  className="font-medium capitalize text-blue-600 hover:underline dark:text-blue-400"
                >
                  {row.name}
                </Link>
                {row.types?.length > 0 && (
                  <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                    {row.types.join(", ")}
                  </p>
                )}
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
              <dt className="text-zinc-500 dark:text-zinc-400">Height</dt>
              <dd>{formatHeight(row.height)}</dd>
              <dt className="text-zinc-500 dark:text-zinc-400">Weight</dt>
              <dd>{formatWeight(row.weight)}</dd>
              <dt className="text-zinc-500 dark:text-zinc-400">Caught at</dt>
              <dd>{formatCaughtAt(row.caughtAt)}</dd>
            </dl>

            {row.note?.trim() && (
              <div className="border-t border-zinc-100 pt-2 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2" title={row.note.trim()}>
                  {row.note.trim()}
                </p>
              </div>
            )}

            <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <Link
                href={`/pokemon/${row.id}`}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-md px-3 py-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                View
              </Link>
              <Button
                variant="secondary"
                onClick={() => onRemove(row.id)}
                aria-label={`Release ${row.name}`}
                className="min-h-[44px] min-w-[44px] shrink-0 px-3 py-2"
              >
                Release
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
