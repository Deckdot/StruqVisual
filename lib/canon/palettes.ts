// lib/canon/palettes.ts
//
// Color canon, ported 1:1 from DesignOS design-os/assets/palettes.yaml.
// 29 approved palette directions. Values are hex or oklch() — both render
// directly as CSS colors in swatches and previews.

import type { Palette } from './types';

export const CANON_PALETTES: Palette[] = [
  {
    id: "graphite-ivory",
    mood: "editorial premium",
    colors: {
      background: "#F3F0E8",
      surface: "#E8E1D5",
      text: "#353634",
      accent: "#9C532C",
      accentAlt: "#2B4A56",
    },
  },
  {
    id: "midnight-brass",
    mood: "executive authority",
    colors: {
      background: "#101218",
      surface: "#191C24",
      text: "#F7F3EA",
      accent: "#C69B5D",
      accentAlt: "#8E9AA8",
    },
  },
  {
    id: "stone-forest",
    mood: "quiet confidence",
    colors: {
      background: "#EEF0EA",
      surface: "#D8DDD3",
      text: "#162017",
      accent: "#2B5C45",
      accentAlt: "#7B6A58",
    },
  },
  {
    id: "terracotta-sand",
    mood: "warm earthy premium",
    colors: {
      background: "#F9F6F0",
      surface: "#EFE9DF",
      text: "#402218",
      accent: "#B85D3B",
      accentAlt: "#5C6B62",
    },
  },
  {
    id: "ocean-breeze",
    mood: "clean professional depth",
    colors: {
      background: "#EDF2F4",
      surface: "#D9E2EC",
      text: "#102A43",
      accent: "#0A6C74",
      accentAlt: "#486581",
    },
  },
  {
    id: "frontier-aperture-technical-dark",
    mood: "high-velocity technical dark",
    colors: {
      background: "oklch(0.16 0.012 248)",
      surface: "oklch(0.205 0.014 248)",
      text: "oklch(0.96 0.004 248)",
      accent: "oklch(0.87 0.21 128)",
      accentAlt: "oklch(0.30 0.018 248)",
    },
  },
  {
    id: "frontier-ferro-forge-dark",
    mood: "cinematic forge dark",
    colors: {
      background: "oklch(0.15 0.012 55)",
      surface: "oklch(0.19 0.014 55)",
      text: "oklch(0.95 0.008 75)",
      accent: "oklch(0.67 0.19 45)",
      accentAlt: "oklch(0.29 0.018 55)",
    },
  },
  {
    id: "frontier-field-cream-madder",
    mood: "restrained editorial paper",
    colors: {
      background: "oklch(0.965 0.012 85)",
      surface: "oklch(0.94 0.014 85)",
      text: "oklch(0.25 0.02 60)",
      accent: "oklch(0.49 0.13 30)",
      accentAlt: "oklch(0.86 0.02 85)",
    },
  },
  {
    id: "frontier-halo-saturated-blush",
    mood: "bold kinetic beauty",
    colors: {
      background: "oklch(0.965 0.018 38)",
      surface: "oklch(0.99 0.01 38)",
      text: "oklch(0.24 0.04 20)",
      accent: "oklch(0.62 0.21 22)",
      accentAlt: "oklch(0.22 0.04 18)",
    },
  },
  {
    id: "frontier-hollow-acid-tide",
    mood: "atmospheric near-black",
    colors: {
      background: "oklch(0.13 0.012 230)",
      surface: "oklch(0.17 0.014 230)",
      text: "oklch(0.93 0.01 210)",
      accent: "oklch(0.82 0.16 195)",
      accentAlt: "oklch(0.28 0.018 230)",
    },
  },
  {
    id: "frontier-kinetic-lime-cobalt",
    mood: "aggressive athletic duotone",
    colors: {
      background: "oklch(0.18 0.005 250)",
      surface: "oklch(0.22 0.006 250)",
      text: "oklch(0.96 0.008 95)",
      accent: "oklch(0.86 0.22 130)",
      accentAlt: "oklch(0.55 0.20 260)",
    },
  },
  {
    id: "frontier-lumen-firelit-flour",
    mood: "warm firelit editorial",
    colors: {
      background: "oklch(0.972 0.012 75)",
      surface: "oklch(0.995 0.006 75)",
      text: "oklch(0.24 0.02 55)",
      accent: "oklch(0.58 0.17 48)",
      accentAlt: "oklch(0.19 0.02 45)",
    },
  },
  {
    id: "frontier-marrow-bone-blood-orange",
    mood: "studio theatrical warm bone",
    colors: {
      background: "oklch(0.955 0.01 85)",
      surface: "oklch(0.975 0.008 85)",
      text: "oklch(0.17 0.008 85)",
      accent: "oklch(0.6 0.21 35)",
      accentAlt: "oklch(0.16 0.01 85)",
    },
  },
  {
    id: "frontier-meridian-signal-graphite",
    mood: "cool operational clarity",
    colors: {
      background: "oklch(0.965 0.005 250)",
      surface: "oklch(0.995 0.001 250)",
      text: "oklch(0.22 0.015 255)",
      accent: "oklch(0.56 0.15 152)",
      accentAlt: "oklch(0.2 0.015 255)",
    },
  },
  {
    id: "frontier-mizu-greige-bronze",
    mood: "slow ceramic restraint",
    colors: {
      background: "oklch(0.945 0.006 80)",
      surface: "oklch(0.92 0.008 80)",
      text: "oklch(0.27 0.012 80)",
      accent: "oklch(0.55 0.07 70)",
      accentAlt: "oklch(0.85 0.012 80)",
    },
  },
  {
    id: "frontier-numen-paper-cobalt",
    mood: "confident portfolio editorial",
    colors: {
      background: "oklch(0.949 0.012 92)",
      surface: "oklch(0.986 0.006 92)",
      text: "oklch(0.205 0.014 70)",
      accent: "oklch(0.50 0.20 250)",
      accentAlt: "oklch(0.64 0.17 250)",
    },
  },
  {
    id: "frontier-objet-gallery-brass",
    mood: "dark editorial commerce",
    colors: {
      background: "oklch(0.19 0.008 62)",
      surface: "oklch(0.235 0.009 62)",
      text: "oklch(0.93 0.012 82)",
      accent: "oklch(0.74 0.11 74)",
      accentAlt: "oklch(0.34 0.011 62)",
    },
  },
  {
    id: "frontier-olea-flour-terracotta",
    mood: "wood-fire neighborhood warmth",
    colors: {
      background: "oklch(0.96 0.014 75)",
      surface: "oklch(0.985 0.01 80)",
      text: "oklch(0.28 0.03 55)",
      accent: "oklch(0.58 0.16 40)",
      accentAlt: "oklch(0.27 0.03 50)",
    },
  },
  {
    id: "frontier-otterbrook-river-amber",
    mood: "deep charity data story",
    colors: {
      background: "oklch(0.23 0.045 195)",
      surface: "oklch(0.28 0.05 193)",
      text: "oklch(0.95 0.018 90)",
      accent: "oklch(0.78 0.14 75)",
      accentAlt: "oklch(0.41 0.05 189)",
    },
  },
  {
    id: "frontier-relay-brutalist-blue",
    mood: "brutalist conference energy",
    colors: {
      background: "oklch(0.96 0.005 110)",
      surface: "oklch(1 0 0)",
      text: "oklch(0.2 0.012 110)",
      accent: "oklch(0.47 0.29 270)",
      accentAlt: "oklch(0.22 0.01 110)",
    },
  },
  {
    id: "frontier-seve-bone-oxblood",
    mood: "restrained fashion editorial",
    colors: {
      background: "oklch(0.965 0.008 70)",
      surface: "oklch(0.995 0.004 70)",
      text: "oklch(0.18 0.012 40)",
      accent: "oklch(0.45 0.16 28)",
      accentAlt: "oklch(0.16 0.012 40)",
    },
  },
  {
    id: "frontier-solene-coastal-coral",
    mood: "sunlit coastal hospitality",
    colors: {
      background: "oklch(0.96 0.012 190)",
      surface: "oklch(0.99 0.006 190)",
      text: "oklch(0.28 0.045 200)",
      accent: "oklch(0.70 0.16 25)",
      accentAlt: "oklch(0.30 0.05 195)",
    },
  },
  {
    id: "frontier-stillwater-oat-sage",
    mood: "large-radius calming care",
    colors: {
      background: "oklch(0.96 0.014 110)",
      surface: "oklch(0.99 0.008 110)",
      text: "oklch(0.32 0.03 150)",
      accent: "oklch(0.62 0.1 50)",
      accentAlt: "oklch(0.3 0.03 150)",
    },
  },
  {
    id: "frontier-substrate-industrial-ice",
    mood: "industrial material dark",
    colors: {
      background: "oklch(0.17 0.009 64)",
      surface: "oklch(0.215 0.011 64)",
      text: "oklch(0.95 0.005 72)",
      accent: "oklch(0.78 0.12 235)",
      accentAlt: "oklch(0.31 0.015 64)",
    },
  },
  {
    id: "frontier-tessellate-mint-graphite",
    mood: "technical turquoise dark",
    colors: {
      background: "oklch(0.16 0.012 190)",
      surface: "oklch(0.21 0.016 190)",
      text: "oklch(0.97 0.01 185)",
      accent: "oklch(0.82 0.15 178)",
      accentAlt: "oklch(0.31 0.022 190)",
    },
  },
  {
    id: "frontier-thuispost-oat-petrol",
    mood: "warm human care",
    colors: {
      background: "oklch(0.975 0.012 75)",
      surface: "oklch(0.955 0.016 72)",
      text: "oklch(0.29 0.028 60)",
      accent: "oklch(0.62 0.15 32)",
      accentAlt: "oklch(0.78 0.13 60)",
    },
  },
  {
    id: "frontier-velar-graphite-scarlet",
    mood: "mechanical performance dark",
    colors: {
      background: "oklch(0.16 0.005 40)",
      surface: "oklch(0.205 0.006 40)",
      text: "oklch(0.96 0.004 60)",
      accent: "oklch(0.575 0.225 25)",
      accentAlt: "oklch(0.305 0.008 40)",
    },
  },
  {
    id: "frontier-velden-linen-forest",
    mood: "credentialed editorial care",
    colors: {
      background: "oklch(0.967 0.012 95)",
      surface: "oklch(0.985 0.008 95)",
      text: "oklch(0.30 0.025 150)",
      accent: "oklch(0.58 0.12 45)",
      accentAlt: "oklch(0.27 0.03 152)",
    },
  },
  {
    id: "frontier-voss-limestone-blueprint",
    mood: "structural architectural restraint",
    colors: {
      background: "oklch(0.955 0.003 250)",
      surface: "oklch(0.99 0.002 250)",
      text: "oklch(0.23 0.008 255)",
      accent: "oklch(0.55 0.13 245)",
      accentAlt: "oklch(0.21 0.012 255)",
    },
  },
];
