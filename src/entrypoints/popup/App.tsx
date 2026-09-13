import type { Annotation } from "@/types/annotation";
import { AnnotationRow } from "@/ui/AnnotationRow";
import { DomainGroupRow } from "@/ui/DomainGroupRow";
import { ClearIcon, SearchIcon } from "@/ui/icons";
import { NoteEditor } from "@/ui/NoteEditor";
import { groupByDomain, searchAnnotations, sortAnnotations } from "@/util/annotations";
import { useAnnotations } from "@/util/storage";
import { useMemo, useState } from "react";
import "./style.css";

type View = "all" | "by-website";

export default function App() {
    const { annotations, loading } = useAnnotations();
    const [query, setQuery] = useState("");
    const [view, setView] = useState<View>("all");
    const [editing, setEditing] = useState<Annotation | null>(null);

    const matches = useMemo(() => sortAnnotations(searchAnnotations(annotations, query)), [annotations, query]);
    const groups = useMemo(() => groupByDomain(matches), [matches]);

    return (
        <div className="popup">
            <header className="topbar">
                <div className="search">
                    <span className="search__icon">
                        <SearchIcon />
                    </span>
                    <input
                        className="search__input"
                        type="search"
                        value={query}
                        autoFocus
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
            </header>

            <main className="list">
                {loading ? null : matches.length === 0 ? (
                    <Empty searching={query.length > 0} />
                ) : view === "all" ? (
                    <ul className="list__items">
                        {matches.map(annotation => (
                            <AnnotationRow key={annotation.id} annotation={annotation} onEditNote={setEditing} />
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
