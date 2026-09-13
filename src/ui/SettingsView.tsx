import {
    buildStyleVariables,
    DEFAULT_SETTINGS,
    PALETTES,
    type Appearance,
    type Palette,
    type ThemeSettings,
} from "@/util/theme";
import { BackIcon, CheckIcon } from "./icons";

const APPEARANCES: { id: Appearance; label: string }[] = [
    { id: "system", label: "System" },
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
];

interface Props {
    themeSettings: ThemeSettings;
    isDark: boolean;
    onUpdate: (patch: Partial<ThemeSettings>) => void;
    onBack: () => void;
}

export function SettingsView({ themeSettings: theme, isDark, onUpdate, onBack }: Props) {
    const activeIndex = APPEARANCES.findIndex(option => option.id === theme.appearance);
    const isDefault =
        theme.appearance === DEFAULT_SETTINGS.appearance && theme.paletteId === DEFAULT_SETTINGS.paletteId;

    return (
        <div className="settings">
            <header className="settings__head">
                <button type="button" className="iconbtn" aria-label="Back to Annotations" onClick={onBack}>
                    <BackIcon />
                </button>
                <h1 className="settings__title">Settings</h1>
            </header>

            <div className="settings__body">
                <section className="field">
                    <h2 className="field__label">Appearance</h2>
                    <div className="seg" style={{ "--active": activeIndex } as React.CSSProperties}>
                        <span className="seg__pill" aria-hidden="true" />
                        {APPEARANCES.map(option => (
                            <button
                                key={option.id}
                                type="button"
                                className={`seg__option${theme.appearance === option.id ? " is-active" : ""}`}
                                aria-pressed={theme.appearance === option.id}
                                onClick={() => onUpdate({ appearance: option.id })}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="field">
                    <h2 className="field__label">Palette</h2>
                    <ul className="palette">
                        {PALETTES.map(palette => (
                            <PaletteOption
                                key={palette.id}
                                palette={palette}
                                isDark={isDark}
                                selected={palette.id === theme.paletteId}
                                onSelect={() => onUpdate({ paletteId: palette.id })}
                            />
                        ))}
                    </ul>
                </section>

                {!isDefault && (
                    <button type="button" className="settings__reset" onClick={() => onUpdate(DEFAULT_SETTINGS)}>
                        Reset to defaults
                    </button>
                )}
            </div>
        </div>
    );
}

function PaletteOption({
    palette,
    isDark,
    selected,
    onSelect,
}: {
    palette: Palette;
    isDark: boolean;
    selected: boolean;
    onSelect: () => void;
}) {
    const styleVariables = buildStyleVariables(palette, isDark);

    return (
        <li>
            <button
                type="button"
                className={`palette__option${selected ? " is-selected" : ""}`}
                aria-pressed={selected}
                onClick={onSelect}
            >
                <span className="palette__swatch" aria-hidden="true">
                    <span className="palette__dot" style={{ background: styleVariables["--paper"] }} />
                    <span className="palette__dot" style={{ background: styleVariables["--ink-2"] }} />
                    <span className="palette__dot" style={{ background: styleVariables["--accent"] }} />
                </span>

                <span className="palette__name">{palette.name}</span>

                <span className="palette__check" aria-hidden="true">
                    {selected && <CheckIcon />}
                </span>
            </button>
        </li>
    );
}
