import type { Annotation } from "@/types/annotation";
import type { DomainGroup } from "@/types/domainGroup";
import { formatSaved } from "@/util/annotations";
import { useState } from "react";
import { AnnotationRow } from "./AnnotationRow";
import { ChevronIcon } from "./icons";

interface Props {
    group: DomainGroup;
    onEditNote: (annotation: Annotation) => void;
}

export function DomainGroupRow({ group, onEditNote }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <li className={`group${open ? " is-open" : ""}`}>
            <button
                type="button"
                className="group__header"
                aria-expanded={open}
                onClick={() => setOpen(wasOpen => !wasOpen)}
            >
                <Folder />

                <span className="group__body">
                    <span className="group__domain">{group.domain}</span>
                    <span className="group__meta">
                        <span>
                            {group.annotations.length} {group.annotations.length === 1 ? "page" : "pages"}
                        </span>
                        <time dateTime={new Date(group.lastSaved).toISOString()}>{formatSaved(group.lastSaved)}</time>
                    </span>
                </span>

                <span className="group__chevron">
                    <ChevronIcon />
                </span>
            </button>

            {open && (
                <ul className="group__items">
                    {group.annotations.map(annotation => (
                        <AnnotationRow
                            key={annotation.id}
                            annotation={annotation}
                            showHost={false}
                            onEditNote={onEditNote}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

function Folder() {
    return (
        <span className="folder" aria-hidden="true">
            <span className="folder__back">
                <span className="folder__tab" />
                <span className="folder__sheet folder__sheet--1" />
                <span className="folder__sheet folder__sheet--2" />
                <span className="folder__sheet folder__sheet--3" />
                <span className="folder__flap folder__flap--left" />
                <span className="folder__flap folder__flap--right" />
            </span>
        </span>
    );
}
