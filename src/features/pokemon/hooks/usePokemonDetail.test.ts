import { describe, it, expect, vi, beforeEach } from "vitest";
import { createElement } from "react";
import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePokemonDetail } from "./usePokemonDetail";
import type { PokemonDetail } from "@/types/pokemon";

const mockDetail: PokemonDetail = {
  id: 1,
  name: "bulbasaur",
  imageUrl: "https://example.com/1.png",
  types: ["grass", "poison"],
  height: 7,
  weight: 69,
  stats: {
    hp: 45,
    attack: 49,
    defense: 49,
    "special-attack": 65,
    "special-defense": 65,
    speed: 45,
  },
};

vi.mock("@/services/pokeapi", () => ({
  fetchPokemonById: vi.fn(),
}));

async function getFetchPokemonById() {
  const { fetchPokemonById } = await import("@/services/pokeapi");
  return fetchPokemonById as ReturnType<typeof vi.fn>;
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe("usePokemonDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not fetch when id is null", async () => {
    const fetchPokemonById = await getFetchPokemonById();
    const wrapper = createWrapper();

    renderHook(() => usePokemonDetail(null), { wrapper });

    await waitFor(() => {
      expect(fetchPokemonById).not.toHaveBeenCalled();
    });
  });

  it("does not fetch when id is undefined", async () => {
    const fetchPokemonById = await getFetchPokemonById();
    const wrapper = createWrapper();

    renderHook(() => usePokemonDetail(undefined), { wrapper });

    await waitFor(() => {
      expect(fetchPokemonById).not.toHaveBeenCalled();
    });
  });

  it("returns loading then data on success", async () => {
    const fetchPokemonById = await getFetchPokemonById();
    fetchPokemonById.mockResolvedValue(mockDetail);
    const wrapper = createWrapper();

    const { result } = renderHook(() => usePokemonDetail(1), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockDetail);
    expect(fetchPokemonById).toHaveBeenCalledWith(1);
  });

  it("returns error when fetch fails", async () => {
    const fetchPokemonById = await getFetchPokemonById();
    const networkError = new Error("Failed to fetch pokemon 1: 404");
    fetchPokemonById.mockRejectedValue(networkError);
    const wrapper = createWrapper();

    const { result } = renderHook(() => usePokemonDetail(1), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(networkError);
    expect(fetchPokemonById).toHaveBeenCalledWith(1);
  });
});
