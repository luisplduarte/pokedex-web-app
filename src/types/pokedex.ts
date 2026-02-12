/** Single caught entry persisted in storage */
export interface CaughtEntry {
  pokemonId: number;
  caughtAt: string;
}

/** Shape of the JSON persisted under the storage key */
export interface PokedexPersistedState {
  caught: CaughtEntry[];
}
