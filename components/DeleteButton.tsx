"use client";

import { useState, useTransition } from "react";

interface Props {
  action: () => Promise<void>;
  confirmMessage?: string;
}

export default function DeleteButton({
  action,
  confirmMessage = "¿Eliminar este elemento?",
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function handleConfirm() {
    setConfirming(false);
    startTransition(async () => {
      await action();
    });
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="text-sm text-red-600">{confirmMessage}</span>
        <button
          onClick={handleConfirm}
          className="text-sm text-red-600 hover:text-red-700 font-semibold underline"
        >
          Sí
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-sm text-gray-500 hover:text-gray-700 font-semibold underline"
        >
          No
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      disabled={isPending}
      className="text-sm text-red-500 hover:text-red-600 disabled:opacity-40 font-medium transition-colors"
    >
      {isPending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
