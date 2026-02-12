/** List item shape for Pokémon list view */
export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string | null;
  types: string[];
}
