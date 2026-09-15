import type { Annotation } from "@/types/annotation";
import { AnnotationRow } from "@/ui/AnnotationRow";
import { DomainGroupRow } from "@/ui/DomainGroupRow";
import { ClearIcon, SearchIcon, SlidersIcon } from "@/ui/icons";
import { NoteEditor } from "@/ui/NoteEditor";
import { SettingsView } from "@/ui/SettingsView";
import { groupByDomain, searchAnnotations, sortAnnotations } from "@/util/annotations";
import { useAnnotations } from "@/util/storage";
import { useThemeSettings } from "@/util/theme";
import { useMemo, useState } from "react";
import "./style.css";

type View = "all" | "by-website";

export default function App() {
    const { annotations, loading } = useAnnotations();
    const [query, setQuery] = useState("");
    const [view, setView] = useState<View>("all");
    const [editing, setEditing] = useState<Annotation | null>(null);

    const { themeSettings, isDark, update } = useThemeSettings();
    const [showSettings, setShowSettings] = useState(false);

    const matches = useMemo(() => sortAnnotations(searchAnnotations(annotations, query)), [annotations, query]);
    const groups = useMemo(() => groupByDomain(matches), [matches]);

    return (
        <div className="popup">
            {showSettings ? (
                <SettingsView
                    themeSettings={themeSettings}
                    isDark={isDark}
                    onUpdate={update}
                    onBack={() => setShowSettings(false)}
                />
            ) : (
                <>
                    <header className="topbar">
                        <div className="search">
                            <span className="search__icon">
                                <SearchIcon />
                            </span>
                            <input
                                name="search"
                                className="search__input"
                                type="search"
                                value={query}
                                placeholder="Search annotations, notes, dates"
                                onChange={event => setQuery(event.target.value)}
                            />
                            {query && (
                                <button
                                    type="button"
                                    className="search__clear"
                                    aria-label="Clear search"
                                    onClick={() => setQuery("")}
                                >
                                    <ClearIcon />
                                </button>
                            )}
                        </div>

                        <div className="topbar__row">
                            <nav className="tabs" style={{ "--active": view === "all" ? 0 : 1 } as React.CSSProperties}>
                                <span className="tabs__pill" aria-hidden="true" />
                                <button
                                    type="button"
                                    className={`tabs__tab${view === "all" ? " is-active" : ""}`}
                                    onClick={() => setView("all")}
                                >
                                    All
                                    <span className="tabs__count">{matches.length}</span>
                                </button>
                                <button
                                    type="button"
                                    className={`tabs__tab${view === "by-website" ? " is-active" : ""}`}
                                    onClick={() => setView("by-website")}
                                >
                                    By site
                                    <span className="tabs__count">{groups.length}</span>
                                </button>
                            </nav>

                            <button
                                type="button"
                                className="iconbtn"
                                aria-label="Settings"
                                onClick={() => setShowSettings(true)}
                            >
                                <SlidersIcon />
                            </button>
                        </div>
                    </header>

                    <main className="list">
                        {loading ? null : matches.length === 0 ? (
                            <Empty searching={query.length > 0} />
                        ) : view === "all" ? (
                            <ul className="list__items">
                                {matches.map(annotation => (
                                    <AnnotationRow
                                        key={annotation.id}
                                        annotation={annotation}
                                        onEditNote={setEditing}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <ul className="list__items">
                                {groups.map(group => (
                                    <DomainGroupRow key={group.domain} group={group} onEditNote={setEditing} />
                                ))}
                            </ul>
                        )}
                    </main>
                </>
            )}

            {editing && <NoteEditor annotation={editing} onClose={() => setEditing(null)} />}
        </div>
    );
}

function Empty({ searching }: { searching: boolean }) {
    return (
        <p className="empty">
            {searching ? "No Results" : "Annotate a page to start your collection. Your annotations will show up here."}
        </p>
    );
}
