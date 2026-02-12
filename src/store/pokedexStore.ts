import { create } from "zustand";
import * as storage from "@/services/storage";
import type { PokedexPersistedState } from "@/types/pokedex";

export interface PokedexStoreState {
  caughtIds: Set<number>;
  caughtAt: Record<number, string>;
  addCaught: (id: number, caughtAt?: string) => void;
  removeCaught: (id: number) => void;
  hydrate: () => void;
}

function toPersisted(
  caughtIds: Set<number>,
  caughtAt: Record<number, string>
): PokedexPersistedState {
  return {
    caught: Array.from(caughtIds).map((pokemonId) => ({
      pokemonId,
      caughtAt: caughtAt[pokemonId] ?? new Date().toISOString(),
    })),
  };
}

export const usePokedexStore = create<PokedexStoreState>()((set) => ({
  caughtIds: new Set(),
  caughtAt: {},

  addCaught: (id, at) => {
    const caughtAt = at ?? new Date().toISOString();
    set((state) => {
      const nextIds = new Set(state.caughtIds);
      nextIds.add(id);
      return {
        caughtIds: nextIds,
        caughtAt: { ...state.caughtAt, [id]: caughtAt },
      };
    });
  },

  removeCaught: (id) => {
    set((state) => {
      const nextIds = new Set(state.caughtIds);
      nextIds.delete(id);
      const nextCaughtAt = { ...state.caughtAt };
      delete nextCaughtAt[id];
      return { caughtIds: nextIds, caughtAt: nextCaughtAt };
    });
  },

  hydrate: () => {
    const persisted = storage.load();
    if (!persisted?.caught?.length) return;
    const caughtIds = new Set<number>();
    const caughtAt: Record<number, string> = {};
    for (const c of persisted.caught) {
      caughtIds.add(c.pokemonId);
      caughtAt[c.pokemonId] = c.caughtAt;
    }
    set({ caughtIds, caughtAt });
  },
}));

// Persist to storage on every store change
usePokedexStore.subscribe((state) => {
  storage.save(toPersisted(state.caughtIds, state.caughtAt));
});
