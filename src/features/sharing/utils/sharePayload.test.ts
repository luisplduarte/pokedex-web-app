import { describe, it, expect } from "vitest";
import { buildShareablePokemon } from "./sharePayload";

const baseUrl = "https://example.com";
const pikachu = { id: 25, name: "pikachu", types: ["electric"] };

describe("buildShareablePokemon", () => {
  it("returns correct URL and text (link only)", () => {
    const { url, text } = buildShareablePokemon(pikachu, { baseUrl });
    expect(url).toBe("https://example.com/pokemon/25");
    expect(text).toBe(url);
  });

  it("returns path-only url when baseUrl is empty", () => {
    const { url } = buildShareablePokemon(pikachu, { baseUrl: "" });
    expect(url).toBe("/pokemon/25");
  });

  it("strips trailing slash from baseUrl", () => {
    const { url } = buildShareablePokemon(pikachu, {
      baseUrl: "https://example.com/",
    });
    expect(url).toBe("https://example.com/pokemon/25");
  });
});
