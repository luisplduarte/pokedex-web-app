/**
 * Type icon URLs from PokeAPI sprites repo (generation VI X/Y).
 * Gen VI includes Fairy (18); Gen III only has types 1–17.
 */
const TYPE_ICON_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y";

const TYPE_ID: Record<string, number> = {
  normal: 1,
  fighting: 2,
  flying: 3,
  poison: 4,
  ground: 5,
  rock: 6,
  bug: 7,
  ghost: 8,
  steel: 9,
  fire: 10,
  water: 11,
  grass: 12,
  electric: 13,
  psychic: 14,
  ice: 15,
  dragon: 16,
  dark: 17,
  fairy: 18,
};

export function getTypeIconUrl(typeName: string): string {
  const id = TYPE_ID[typeName.toLowerCase()];
  return id ? `${TYPE_ICON_BASE}/${id}.png` : "";
}
