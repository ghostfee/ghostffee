/**
 * Tokens de diseño del sitio.
 * Fuente de verdad para colores, tipografía y reglas del modo grabación.
 * Usar estos valores en componentes; no hardcodear colores.
 */

export const colors = {
  // Superficie del sitio
  siteBg:        "#0F172A", // slate-900
  panelBg:       "#1E293B", // slate-800
  border:        "#334155", // slate-700

  // Texto
  textPrimary:   "#F1F5F9", // slate-100
  textSecondary: "#94A3B8", // slate-400

  // Acentos funcionales
  accent:        "#22D3EE", // cian-400  — estado activo
  warning:       "#FBBF24", // amber-400 — rangos / advertencias
  error:         "#F87171", // red-400   — errores / NaN

  // Modo grabación — fondos planos del panel
  recordWhite:   "#FFFFFF",
  recordChroma:  "#00FF00",
} as const;

export const fonts = {
  heading: "var(--font-space-grotesk)",
  body:    "var(--font-source-serif)",
  mono:    "var(--font-ibm-plex-mono)",
} as const;

/**
 * Presets del modo grabación disponibles en el toggle del panel de simulación.
 * El texto adapta contraste automáticamente según el preset elegido.
 */
export const recordingPresets = [
  {
    id:         "white",
    label:      "Blanco",
    bg:         colors.recordWhite,
    textColor:  "#0F172A",
  },
  {
    id:         "chroma",
    label:      "Chroma",
    bg:         colors.recordChroma,
    textColor:  "#0F172A",
  },
] as const;

export type RecordingPresetId = (typeof recordingPresets)[number]["id"];
