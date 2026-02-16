"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmTone?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmTone = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  const confirmButtonClasses =
    confirmTone === "danger"
      ? "shrink-0 cursor-pointer rounded-md border border-red-500 bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-red-600 dark:hover:bg-red-700 dark:focus-visible:ring-offset-zinc-900"
      : "shrink-0 cursor-pointer rounded-md border border-blue-500 bg-blue-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus-visible:ring-offset-zinc-900";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-sm rounded-lg bg-white p-4 shadow-lg dark:bg-zinc-900"
      >
        <h2
          id="confirm-dialog-title"
          className="text-base font-semibold text-zinc-900 dark:text-zinc-100"
        >
          {title}
        </h2>
        {description ? (
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Button
            variant="secondary"
            type="button"
            onClick={onCancel}
            className="cursor-pointer"
          >
            {cancelLabel}
          </Button>
          <button type="button" onClick={onConfirm} className={confirmButtonClasses}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

