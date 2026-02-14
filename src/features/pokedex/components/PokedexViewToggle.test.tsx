import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PokedexViewToggle } from "./PokedexViewToggle";

describe("PokedexViewToggle", () => {
  it("renders Table and Grid buttons with Table active when viewMode is table", () => {
    const setViewMode = vi.fn();
    render(<PokedexViewToggle viewMode="table" setViewMode={setViewMode} />);

    const tableBtn = screen.getByRole("button", { name: /table/i });
    const gridBtn = screen.getByRole("button", { name: /grid/i });

    expect(tableBtn).toHaveAttribute("aria-pressed", "true");
    expect(gridBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("renders Grid as active when viewMode is grid", () => {
    const setViewMode = vi.fn();
    render(<PokedexViewToggle viewMode="grid" setViewMode={setViewMode} />);

    expect(screen.getByRole("button", { name: /table/i })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(screen.getByRole("button", { name: /grid/i })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("calls setViewMode with table when Table is clicked", () => {
    const setViewMode = vi.fn();
    render(<PokedexViewToggle viewMode="grid" setViewMode={setViewMode} />);

    fireEvent.click(screen.getByRole("button", { name: /table/i }));

    expect(setViewMode).toHaveBeenCalledWith("table");
  });

  it("calls setViewMode with grid when Grid is clicked", () => {
    const setViewMode = vi.fn();
    render(<PokedexViewToggle viewMode="table" setViewMode={setViewMode} />);

    fireEvent.click(screen.getByRole("button", { name: /grid/i }));

    expect(setViewMode).toHaveBeenCalledWith("grid");
  });
});
