"use client";

import { useState } from "react";

export function useToastSimple() {
  const [mensaje, setMensaje] = useState<string | null>(null);

  return {
    mensaje,
    mostrar: (texto: string) => {
      setMensaje(texto);
      setTimeout(() => setMensaje(null), 2600);
    }
  };
}
