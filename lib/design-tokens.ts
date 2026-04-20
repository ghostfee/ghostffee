/**
 * Tokens de diseño del sitio.
 * Fuente de verdad para colores, tipografía y reglas del modo grabación.
 * Usar estos valores en componentes; no hardcodear colores.
 */

export const colors = {
  // Superficie del sitio (tema claro)
  siteBg:        "#f0f4ff", // fondo general suave
  panelBg:       "#ffffff", // tarjetas y paneles blancos
  border:        "#e5e7eb", // gray-200

  // Texto
  textPrimary:   "#111827", // gray-900
  textSecondary: "#4b5563", // gray-600

  // Acentos funcionales
  accent:        "#4f46e5", // indigo-600 — principal
  accentLight:   "#6366f1", // indigo-500 — hover / gradiente
  warning:       "#f97316", // orange-500 — moneda / highlight
  error:         "#ef4444", // red-500    — errores / NO

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
