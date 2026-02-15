"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { buildShareablePokemon } from "../utils/sharePayload";
import { copyToClipboard } from "../utils/copyToClipboard";
import type { Pokemon } from "@/types/pokemon";

const MESSAGE_DURATION_MS = 2500;

function canUseWebShare(): boolean {
  return typeof navigator !== "undefined" && Boolean(navigator.share);
}

export interface SharePokemonButtonProps {
  pokemon: Pick<Pokemon, "id" | "name" | "types">;
  note?: string;
  baseUrl?: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export function SharePokemonButton({
  pokemon,
  note,
  baseUrl,
  variant = "secondary",
  className = "",
}: SharePokemonButtonProps) {
  const [message, setMessage] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (message == null) return;
    const t = setTimeout(() => setMessage(null), MESSAGE_DURATION_MS);
    return () => clearTimeout(t);
  }, [message]);

  const showFeedback = useCallback((type: "success" | "error") => {
    setMessage(type);
  }, []);

  const handleShare = useCallback(async () => {
    const { url } = buildShareablePokemon(pokemon, { baseUrl });
    const summaryParts = [pokemon.name];
    if (pokemon.types.length) summaryParts.push(`(${pokemon.types.join(", ")})`);
    if (note?.trim()) summaryParts.push(`— ${note.trim()}`);
    const summaryLine = summaryParts.join(" ");
    // Put URL first so pasted content has a valid link on the first line
    const textToShare = summaryLine ? `${url}\n${summaryLine}` : url;

    if (canUseWebShare()) {
      try {
        await navigator.share({
          title: pokemon.name,
          url,
        });
        showFeedback("success");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          const copied = await copyToClipboard(textToShare);
          showFeedback(copied ? "success" : "error");
        }
      }
      return;
    }

    const copied = await copyToClipboard(textToShare);
    showFeedback(copied ? "success" : "error");
  }, [pokemon, note, baseUrl, showFeedback]);

  return (
    <span className="inline-flex items-center gap-2">
      <Button
        type="button"
        variant={variant}
        onClick={handleShare}
        className={className}
        aria-label={`Share ${pokemon.name}`}
      >
        Share
      </Button>
      {message === "success" && (
        <span className="text-sm text-green-600 dark:text-green-400" role="status">
          Copied!
        </span>
      )}
      {message === "error" && (
        <span className="text-sm text-red-600 dark:text-red-400" role="alert">
          Could not copy
        </span>
      )}
    </span>
  );
}
