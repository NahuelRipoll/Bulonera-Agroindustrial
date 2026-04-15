"use client";

import { useTransition } from "react";

interface Props {
  action: () => Promise<void>;
  confirmMessage?: string;
}

export default function DeleteButton({
  action,
  confirmMessage = "¿Estás seguro? Esta acción no se puede deshacer.",
}: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(confirmMessage)) return;
    startTransition(async () => {
      await action();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-sm text-red-500 hover:text-red-600 disabled:opacity-40 font-medium transition-colors"
    >
      {isPending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
