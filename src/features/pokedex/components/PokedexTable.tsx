"use client";

import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";

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
        return types?.length ? (
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {types.join(", ")}
          </span>
        ) : (
          "—"
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
    columnHelper.accessor("note", {
      header: "Note",
      cell: ({ row }) => {
        const note = row.original.note?.trim();
        return note ? (
          <span className="max-w-[12rem] truncate block text-sm" title={note}>
            {note}
          </span>
        ) : (
          "—"
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/pokemon/${row.original.id}`}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            View
          </Link>
          <Button
            variant="secondary"
            onClick={() => onRemove(row.original.id)}
            aria-label={`Release ${row.original.name}`}
          >
            Release
          </Button>
        </div>
      ),
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
