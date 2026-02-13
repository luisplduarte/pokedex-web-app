/** List item shape for Pokémon list view */
export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string | null;
  types: string[];
}

/** Full detail for Pokémon detail page; extends list item with height, weight, stats */
export interface PokemonDetail extends Pokemon {
  height: number;
  weight: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    "special-attack": number;
    "special-defense": number;
    speed: number;
  };
}
