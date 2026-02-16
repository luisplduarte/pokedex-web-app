 "use client";

import { useState } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { getTypeIconUrl } from "@/features/filters/typeIcons";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

/** Row shape for the Pokédex table (list item + caught/note data) */
export interface PokedexTableRow {
  id: number;
  name: string;
  imageUrl: string | null;
  types: string[];
  caughtAt?: string;
  note?: string;
  height?: number;
  weight?: number;
}

interface PokedexTableProps {
  data: PokedexTableRow[];
  onRemove: (id: number) => void;
}

const columnHelper = createColumnHelper<PokedexTableRow>();

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

/** Height in API is in decimetres; display in m */
function formatHeight(dm?: number): string {
  if (dm == null) return "—";
  return `${(dm / 10).toFixed(1)} m`;
}

/** Weight in API is in hectograms; display in kg */
function formatWeight(hg?: number): string {
  if (hg == null) return "—";
  return `${(hg / 10).toFixed(1)} kg`;
}

export function PokedexTable({ data, onRemove }: PokedexTableProps) {
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ row }) => (
        <Link
          href={`/pokemon/${row.original.id}`}
          className="font-medium capitalize text-blue-600 hover:underline dark:text-blue-400"
        >
          {row.original.name}
        </Link>
      ),
    }),
    columnHelper.accessor("imageUrl", {
      header: "Image",
      cell: ({ row }) =>
        row.original.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- external API URL
          <img
            src={row.original.imageUrl}
            alt=""
            className="h-10 w-10 object-contain"
          />
        ) : (
          <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800" aria-hidden />
        ),
    }),
    columnHelper.accessor("types", {
      header: "Types",
      cell: ({ getValue }) => {
        const types = getValue();

        if (!types?.length) {
          return "—";
        }

        return (
          <div className="flex flex-wrap items-center gap-1.5">
            {types.map((type: string) => {
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
            })}
          </div>
        );
      },
    }),
    columnHelper.accessor("height", {
      header: "Height",
      cell: ({ row }) => formatHeight(row.original.height),
    }),
    columnHelper.accessor("weight", {
      header: "Weight",
      cell: ({ row }) => formatWeight(row.original.weight),
    }),
    columnHelper.accessor("caughtAt", {
      header: "Caught at",
      cell: ({ row }) => formatCaughtAt(row.original.caughtAt),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const isConfirming = confirmingId === row.original.id;

        return (
          <>
            <div className="flex items-center gap-2">
              <Link
                href={`/pokemon/${row.original.id}`}
                className="inline-flex items-center justify-center rounded-md p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-zinc-800"
                aria-label={`View details for ${row.original.name}`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M1.5 8s2.25-4.5 6.5-4.5S14.5 8 14.5 8s-2.25 4.5-6.5 4.5S1.5 8 1.5 8Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="8"
                    cy="8"
                    r="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </Link>
              <button
                type="button"
                onClick={() => setConfirmingId(row.original.id)}
                className="inline-flex items-center justify-center text-red-500 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-900"
                aria-label={`Remove ${row.original.name} from Pokédex`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M5 7h14M10 11v6M14 11v6M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M7 7h10l-.8 11.2A1 1 0 0 1 15.2 19H8.8a1 1 0 0 1-.998-.8L7 7Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <ConfirmDialog
              open={isConfirming}
              title="Release from Pokédex"
              description={
                <span>
                  Are you sure you want to release{" "}
                  <span className="font-semibold capitalize">
                    {row.original.name}
                  </span>{" "}
                  from your Pokédex?
                </span>
              }
              confirmLabel="Release"
              cancelLabel="Cancel"
              onConfirm={() => {
                onRemove(row.original.id);
                setConfirmingId(null);
              }}
              onCancel={() => setConfirmingId(null)}
            />
          </>
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-700">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  className="px-3 py-2 font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-3 py-2 text-zinc-900 dark:text-zinc-100"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
