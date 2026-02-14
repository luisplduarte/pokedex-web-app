/**
 * Row shape for CSV export (caught list + notes). Compatible with PokedexTableRow
 * minus imageUrl. Used by buildCsv only; no DOM or download logic here.
 */
export interface CsvExportRow {
  id: number;
  name: string;
  types: string[];
  height?: number;
  weight?: number;
  caughtAt?: string;
  note?: string;
}

const CSV_HEADERS = [
  "Id",
  "Name",
  "Types",
  "Height",
  "Weight",
  "Caught At",
  "Note",
] as const;

/**
 * Format ISO date string (e.g. 2026-02-14T19:16:59.212Z) to yyyy/mm/dd hh:mm:ss
 */
function formatCaughtAt(isoDate: string): string {
  if (!isoDate) return "";
  const [datePart, timePart] = isoDate.split("T");
  if (!datePart) return isoDate;
  const dateFormatted = datePart.replace(/-/g, "/");
  const timeFormatted = timePart ? timePart.replace(/\.\d+Z?$/i, "").replace("Z", "") : "00:00:00";
  return `${dateFormatted} ${timeFormatted}`;
}

/**
 * Escape a CSV field: wrap in double quotes if it contains comma, newline, or
 * double quote; double any internal double quotes.
 */
function escapeCsvField(value: string): string {
  const needsQuotes =
    value.includes(",") || value.includes("\n") || value.includes('"');
  if (!needsQuotes) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

function rowToCells(row: CsvExportRow): string[] {
  return [
    String(row.id),
    row.name,
    row.types.join(", "),
    row.height != null ? String(row.height) : "",
    row.weight != null ? String(row.weight) : "",
    row.caughtAt != null ? formatCaughtAt(row.caughtAt) : "",
    row.note ?? "",
  ];
}

/**
 * Build a CSV string from caught list + notes. Handles escaping (commas, quotes).
 * No DOM or download logic.
 */
export function buildCsv(rows: CsvExportRow[]): string {
  const headerLine = CSV_HEADERS.join(",");
  if (rows.length === 0) {
    return headerLine + "\n";
  }
  const dataLines = rows.map((row) =>
    rowToCells(row).map(escapeCsvField).join(",")
  );
  return [headerLine, ...dataLines].join("\n");
}
