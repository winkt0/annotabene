import { useEffect, useState } from "react";
import { themeStore } from "./storage";

export type Appearance = "system" | "light" | "dark";

export interface Palette {
    id: string;
    name: string;
    // Hue of the neutral ramp, in oklch degrees
    surfaceHue: number;
    // How far the neutrals drift from grey
    surfaceChroma: number;
    accentHue: number;
    // 0–1 multiplier on accent saturation
    accentSaturation?: number;
}

export const PALETTES: Palette[] = [
    { id: "manila", name: "Manila", surfaceHue: 95, surfaceChroma: 0.005, accentHue: 288 },
    { id: "slate", name: "Slate", surfaceHue: 250, surfaceChroma: 0.008, accentHue: 248 },
    { id: "moss", name: "Moss", surfaceHue: 135, surfaceChroma: 0.006, accentHue: 155 },
    { id: "rose", name: "Rose", surfaceHue: 25, surfaceChroma: 0.007, accentHue: 18 },
    { id: "graphite", name: "Graphite", surfaceHue: 0, surfaceChroma: 0, accentHue: 265, accentSaturation: 0.28 },
];

export interface ThemeSettings {
    appearance: Appearance;
    paletteId: string;
}

export const DEFAULT_SETTINGS: ThemeSettings = { appearance: "system", paletteId: "manila" };

export function buildStyleVariables(palette: Palette, dark: boolean): Record<string, string> {
    const { surfaceHue: h, surfaceChroma: c } = palette;

    const tone = (lightness: number, chromaScale = 1, alpha?: number) => {
        const chroma = (c * chromaScale).toFixed(4);
        return `oklch(${lightness}% ${chroma} ${h}${alpha == null ? "" : ` / ${alpha}`})`;
    };

    const accentChroma = (dark ? 0.14 : 0.17) * (palette.accentSaturation ?? 1);
    const accent = dark
        ? `oklch(72% ${accentChroma.toFixed(4)} ${palette.accentHue})`
        : `oklch(45% ${accentChroma.toFixed(4)} ${palette.accentHue})`;

    const styleVariables = {
        "--accent": accent,
        "--accent-wash": `color-mix(in srgb, ${accent} ${dark ? 16 : 12}%, transparent)`,
        // The folder stays manila whatever the palette does. Folders are manila
        "--folder": dark ? "#c79e60" : "#e3be86",
        "--folder-back": dark ? "#a9834b" : "#cfa568",
        "--folder-edge": dark ? "#bb9257" : "#d9b078",
    };

    if (dark) {
        return {
            ...styleVariables,
            "--paper": tone(16.5, 0.8),
            "--sheet": tone(23, 0.9),
            "--ink": tone(94.5, 0.3),
            "--ink-2": tone(69, 0.5),
            "--ink-3": tone(53, 0.5),
            "--rule": "oklch(100% 0 0 / 0.08)",
            "--rule-strong": "oklch(100% 0 0 / 0.14)",
            "--on-accent": "oklch(18% 0 0)",
            "--leaf-1": tone(44, 1.4),
            "--leaf-2": tone(53, 1.4),
            "--leaf-3": tone(62, 1.4),
            "--lift": "0 1px 1px rgba(0, 0, 0, 0.4), 0 14px 28px -16px rgba(0, 0, 0, 0.8)",
        };
    }

    return {
        ...styleVariables,
        "--paper": tone(96.4),
        "--sheet": "#ffffff",
        "--ink": tone(21, 0.7),
        "--ink-2": tone(51, 0.6),
        "--ink-3": tone(68, 0.5),
        "--rule": tone(21, 0.7, 0.075),
        "--rule-strong": tone(21, 0.7, 0.12),
        "--on-accent": "#ffffff",
        "--leaf-1": tone(86.5, 1.2),
        "--leaf-2": tone(91.5, 1.2),
        "--leaf-3": tone(96, 1.2),
        "--lift": "0 1px 1px rgba(17, 17, 26, 0.03), 0 12px 26px -16px rgba(17, 17, 26, 0.5)",
    };
}

export function paletteById(id: string): Palette {
    return PALETTES.find(palette => palette.id === id) ?? PALETTES[0]!;
}

export function useThemeSettings() {
    const [themeSettings, setTheme] = useState<ThemeSettings>(DEFAULT_SETTINGS);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        themeStore.getValue().then(value => setTheme(value ?? DEFAULT_SETTINGS));
        return themeStore.watch(value => setTheme(value ?? DEFAULT_SETTINGS));
    }, []);

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        const apply = () => {
            const dark = themeSettings.appearance === "system" ? media.matches : themeSettings.appearance === "dark";
            const root = document.documentElement;

            for (const [token, value] of Object.entries(
                buildStyleVariables(paletteById(themeSettings.paletteId), dark),
            )) {
                root.style.setProperty(token, value);
            }
            root.style.colorScheme = dark ? "dark" : "light";
            setIsDark(dark);
        };

        apply();
        media.addEventListener("change", apply);
        return () => media.removeEventListener("change", apply);
    }, [themeSettings]);

    function update(patch: Partial<ThemeSettings>) {
        const next = { ...themeSettings, ...patch };
        setTheme(next);
        themeStore.setValue(next);
    }

    return { themeSettings, isDark, update };
}
