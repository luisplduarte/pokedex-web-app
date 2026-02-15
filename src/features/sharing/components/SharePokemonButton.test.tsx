import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SharePokemonButton } from "./SharePokemonButton";

const mockCopyToClipboard = vi.fn();

vi.mock("../utils/copyToClipboard", () => ({
  copyToClipboard: (text: string) => mockCopyToClipboard(text),
}));

describe("SharePokemonButton", () => {
  beforeEach(() => {
    mockCopyToClipboard.mockReset();
    mockCopyToClipboard.mockResolvedValue(true);
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
    });
  });

  it("renders Share button", () => {
    render(
      <SharePokemonButton
        pokemon={{ id: 25, name: "pikachu", types: ["electric"] }}
        baseUrl="https://example.com"
      />
    );
    expect(screen.getByRole("button", { name: /share pikachu/i })).toBeInTheDocument();
  });

  it("calls copyToClipboard with URL and summary when Share is clicked", async () => {
    render(
      <SharePokemonButton
        pokemon={{ id: 25, name: "pikachu", types: ["electric"] }}
        baseUrl="https://example.com"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /share pikachu/i }));

    await waitFor(() => expect(mockCopyToClipboard).toHaveBeenCalledTimes(1));
    const [text] = mockCopyToClipboard.mock.calls[0];
    expect(text).toContain("https://example.com/pokemon/25");
    expect(text).toContain("pikachu");
    expect(text).toContain("electric");
  });

  it("includes note in copied text when provided", async () => {
    render(
      <SharePokemonButton
        pokemon={{ id: 1, name: "bulbasaur", types: ["grass", "poison"] }}
        note="First catch"
        baseUrl="https://app.com"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /share bulbasaur/i }));

    await waitFor(() => expect(mockCopyToClipboard).toHaveBeenCalledTimes(1));
    const [text] = mockCopyToClipboard.mock.calls[0];
    expect(text).toContain("First catch");
  });

  it("shows Copied! after successful copy", async () => {
    render(
      <SharePokemonButton
        pokemon={{ id: 25, name: "pikachu", types: [] }}
        baseUrl="https://example.com"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /share pikachu/i }));

    await screen.findByText("Copied!");
    expect(screen.getByRole("status")).toHaveTextContent("Copied!");
  });

  it("calls navigator.share with title and url when Web Share is available", async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", {
      value: mockShare,
      configurable: true,
    });

    render(
      <SharePokemonButton
        pokemon={{ id: 25, name: "pikachu", types: ["electric"] }}
        baseUrl="https://example.com"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /share pikachu/i }));

    await waitFor(() => expect(mockShare).toHaveBeenCalledWith({
      title: "pikachu",
      url: "https://example.com/pokemon/25",
    }));
  });
});
