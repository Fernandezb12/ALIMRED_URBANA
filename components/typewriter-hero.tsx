"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  frases: string[];
  className?: string;
};

export function TypewriterHero({ frases, className }: Props) {
  const [fraseIndex, setFraseIndex] = useState(0);
  const [texto, setTexto] = useState("");
  const [borrando, setBorrando] = useState(false);

  const fraseActual = frases[fraseIndex] ?? "";
  const anchoChars = useMemo(() => Math.max(...frases.map((f) => f.length)), [frases]);

  useEffect(() => {
    const completada = texto === fraseActual;
    const vacia = texto.length === 0;

    const base = borrando ? 45 : 85;
    const pausa = completada ? 1300 : vacia && borrando ? 320 : base;

    const t = setTimeout(() => {
      if (!borrando && !completada) {
        setTexto(fraseActual.slice(0, texto.length + 1));
        return;
      }

      if (!borrando && completada) {
        setBorrando(true);
        return;
      }

      if (borrando && !vacia) {
        setTexto(fraseActual.slice(0, texto.length - 1));
        return;
      }

      if (borrando && vacia) {
        setBorrando(false);
        setFraseIndex((prev) => (prev + 1) % frases.length);
      }
    }, pausa);

    return () => clearTimeout(t);
  }, [borrando, fraseActual, frases.length, texto]);

  return (
    <span className={className} style={{ minWidth: `${anchoChars}ch` }}>
      {texto}
      <span className="ml-1 inline-block h-[1.05em] w-[2px] animate-caret bg-vino align-[-0.1em]" aria-hidden="true" />
    </span>
  );
}
