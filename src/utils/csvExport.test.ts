import { describe, it, expect } from "vitest";
import { buildCsv, type CsvExportRow } from "./csvExport";

const oneRow: CsvExportRow = {
  id: 1,
  name: "bulbasaur",
  types: ["grass", "poison"],
  height: 7,
  weight: 69,
  caughtAt: "2025-02-01T12:00:00Z",
  note: "First catch",
};

describe("buildCsv", () => {
  it("returns header line only for empty list", () => {
    const out = buildCsv([]);
    expect(out).toBe("Id,Name,Types,Height,Weight,Caught At,Note\n");
  });

  it("includes correct headers", () => {
    const out = buildCsv([oneRow]);
    const firstLine = out.split("\n")[0];
    expect(firstLine).toBe("Id,Name,Types,Height,Weight,Caught At,Note");
  });

  it("outputs one row with all fields and formats caughtAt as yyyy/mm/dd hh:mm:ss", () => {
    const out = buildCsv([oneRow]);
    const lines = out.split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[1]).toBe(
      "1,bulbasaur,\"grass, poison\",7,69,2025/02/01 12:00:00,First catch"
    );
  });

  it("outputs multiple rows with notes", () => {
    const rows: CsvExportRow[] = [
      oneRow,
      {
        id: 25,
        name: "pikachu",
        types: ["electric"],
        caughtAt: "2025-02-02T10:00:00Z",
        note: "Favorite",
      },
      {
        id: 6,
        name: "charizard",
        types: ["fire", "flying"],
        height: 17,
        weight: 905,
        note: "",
      },
    ];
    const out = buildCsv(rows);
    const lines = out.split("\n");
    expect(lines).toHaveLength(4);
    expect(lines[1]).toContain("bulbasaur");
    expect(lines[2]).toContain("pikachu");
    expect(lines[3]).toContain("charizard");
  });

  it("escapes commas in types (quoted field)", () => {
    const out = buildCsv([oneRow]);
    expect(out).toContain('"grass, poison"');
  });

  it("escapes double quotes in note", () => {
    const rows: CsvExportRow[] = [
      {
        ...oneRow,
        note: 'He said "hello"',
      },
    ];
    const out = buildCsv(rows);
    expect(out).toContain('""hello""');
  });

  it("escapes newlines in field", () => {
    const rows: CsvExportRow[] = [
      {
        ...oneRow,
        note: "Line one\nLine two",
      },
    ];
    const out = buildCsv(rows);
    // Quoted field contains newline, so it spans two lines in raw output
    expect(out).toContain('"Line one');
    expect(out).toContain('Line two"');
  });

  it("formats caughtAt with milliseconds as yyyy/mm/dd hh:mm:ss", () => {
    const rows: CsvExportRow[] = [
      {
        id: 1,
        name: "test",
        types: ["normal"],
        caughtAt: "2026-02-14T19:16:59.212Z",
      },
    ];
    const out = buildCsv(rows);
    expect(out).toContain("2026/02/14 19:16:59");
  });

  it("omits optional fields as empty", () => {
    const rows: CsvExportRow[] = [
      {
        id: 1,
        name: "minimal",
        types: [],
      },
    ];
    const out = buildCsv(rows);
    const line = out.split("\n")[1];
    expect(line).toBe("1,minimal,,,,,");
  });
});
