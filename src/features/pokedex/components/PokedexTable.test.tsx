import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PokedexTable } from "./PokedexTable";
import type { PokedexTableRow } from "./PokedexTable";

const mockRows: PokedexTableRow[] = [
  {
    id: 1,
    name: "bulbasaur",
    imageUrl: "https://example.com/1.png",
    types: ["grass", "poison"],
    caughtAt: "2025-02-01T12:00:00Z",
    note: "First catch",
  },
  {
    id: 2,
    name: "charmander",
    imageUrl: null,
    types: ["fire"],
  },
];

describe("PokedexTable", () => {
  it("renders table with header and data rows", () => {
    const onRemove = vi.fn();
    render(<PokedexTable data={mockRows} onRemove={onRemove} />);

    expect(screen.getByRole("columnheader", { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /image/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /types/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /height/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /weight/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /caught at/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /note/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /actions/i })).toBeInTheDocument();

    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("charmander")).toBeInTheDocument();
    expect(screen.getByText("First catch")).toBeInTheDocument();
  });

  it("renders empty table when data is empty", () => {
    const onRemove = vi.fn();
    render(<PokedexTable data={[]} onRemove={onRemove} />);

    expect(screen.getByRole("columnheader", { name: /name/i })).toBeInTheDocument();
    expect(screen.queryByText("bulbasaur")).not.toBeInTheDocument();
  });
});
