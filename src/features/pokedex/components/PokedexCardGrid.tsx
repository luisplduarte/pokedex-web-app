 "use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { getTypeIconUrl } from "@/features/filters/typeIcons";
import { Trash2 } from "lucide-react";
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

interface PokedexCardRemoveProps {
  id: number;
  name: string;
  onRemove: (id: number) => void;
}

function PokedexCardRemove({ id, name, onRemove }: PokedexCardRemoveProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center justify-center text-red-500 hover:text-red-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        aria-label={`Remove ${name} from Pokédex`}
      >
        <Trash2 className="h-5 w-5" aria-hidden="true" />
      </button>
      <ConfirmDialog
        open={confirming}
        title="Release from Pokédex"
        description={
          <span>
            Are you sure you want to release{" "}
            <span className="font-semibold capitalize">{name}</span> from your
            Pokédex?
          </span>
        }
        confirmLabel="Release"
        cancelLabel="Cancel"
        onConfirm={() => {
          onRemove(id);
          setConfirming(false);
        }}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}

export function PokedexCardGrid({ data, onRemove }: PokedexCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((row) => (
        <Card key={row.id} className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded">
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
                <div className="flex items-center justify-between gap-2">
                  <p className="flex-1 font-medium capitalize text-zinc-900 dark:text-zinc-100">
                    <Link
                      href={`/pokemon/${row.id}`}
                      className="text-white hover:underline dark:text-white"
                    >
                      {row.name}
                    </Link>
                  </p>
                  <PokedexCardRemove
                    id={row.id}
                    name={row.name}
                    onRemove={onRemove}
                  />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  {row.types?.length ? (
                    row.types.map((type) => {
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
          </div>
        </Card>
      ))}
    </div>
  );
}
