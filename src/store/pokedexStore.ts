import { create } from "zustand";
import * as storage from "@/services/storage";
import type { PokedexPersistedState } from "@/types/pokedex";

export interface PokedexStoreState {
  caughtIds: Set<number>;
  caughtAt: Record<number, string>;
  notes: Record<number, string>;
  addCaught: (id: number, caughtAt?: string) => void;
  removeCaught: (id: number) => void;
  removeMany: (ids: number[]) => void;
  setNote: (id: number, text: string) => void;
  getNote: (id: number) => string;
  hydrate: () => void;
}

function toPersisted(
  caughtIds: Set<number>,
  caughtAt: Record<number, string>,
  notes: Record<number, string>
): PokedexPersistedState {
  const notesPayload: Record<string, string> = {};
  for (const [k, v] of Object.entries(notes)) {
    if (v != null && v !== "") notesPayload[k] = v;
  }
  return {
    caught: Array.from(caughtIds).map((pokemonId) => ({
      pokemonId,
      caughtAt: caughtAt[pokemonId] ?? new Date().toISOString(),
    })),
    notes: Object.keys(notesPayload).length > 0 ? notesPayload : undefined,
  };
}

export const usePokedexStore = create<PokedexStoreState>()((set, get) => ({
  caughtIds: new Set(),
  caughtAt: {},
  notes: {},

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
      const nextNotes = { ...state.notes };
      delete nextNotes[id];
      return { caughtIds: nextIds, caughtAt: nextCaughtAt, notes: nextNotes };
    });
  },

  removeMany: (ids) => {
    set((state) => {
      const nextIds = new Set(state.caughtIds);
      const nextCaughtAt = { ...state.caughtAt };
      const nextNotes = { ...state.notes };
      for (const id of ids) {
        nextIds.delete(id);
        delete nextCaughtAt[id];
        delete nextNotes[id];
      }
      return { caughtIds: nextIds, caughtAt: nextCaughtAt, notes: nextNotes };
    });
  },

  setNote: (id, text) => {
    set((state) => ({
      notes: { ...state.notes, [id]: text },
    }));
  },

  getNote: (id) => {
    return get().notes[id] ?? "";
  },

  hydrate: () => {
    const persisted = storage.load();
    if (persisted == null) return;
    const caughtIds = new Set<number>();
    const caughtAt: Record<number, string> = {};
    const notes: Record<number, string> = {};
    if (persisted.caught?.length) {
      for (const c of persisted.caught) {
        caughtIds.add(c.pokemonId);
        caughtAt[c.pokemonId] = c.caughtAt;
      }
    }
    if (persisted.notes && typeof persisted.notes === "object") {
      for (const [key, value] of Object.entries(persisted.notes)) {
        const num = Number(key);
        if (Number.isInteger(num) && typeof value === "string") {
          notes[num] = value;
        }
      }
    }
    set({ caughtIds, caughtAt, notes });
  },
}));

// Persist to storage on every store change
usePokedexStore.subscribe((state) => {
  storage.save(toPersisted(state.caughtIds, state.caughtAt, state.notes));
});
