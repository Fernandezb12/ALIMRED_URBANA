import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        fondo: "hsl(var(--fondo))",
        texto: "hsl(var(--texto))",
        panel: "hsl(var(--panel))",
        borde: "hsl(var(--borde))",
        vino: {
          DEFAULT: "hsl(var(--vino))",
          foreground: "hsl(var(--vino-foreground))"
        },
        exito: "hsl(var(--exito))",
        alerta: "hsl(var(--alerta))",
        info: "hsl(var(--info))"
      },
      boxShadow: {
        suave: "0 12px 30px -14px rgba(10, 10, 10, 0.22)"
      },
      borderRadius: {
        xl: "1rem"
      }
    }
  },
  plugins: []
};

export default config;
