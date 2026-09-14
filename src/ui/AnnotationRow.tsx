import { browser } from "#imports";
import type { Annotation } from "@/types/annotation";
import { formatSaved, hostOf } from "@/util/annotations";
import { PencilIcon } from "./icons";

interface Props {
    annotation: Annotation;
    // Hide the host line when the row already sits inside a domain group.
    showHost?: boolean;
    onEditNote: (annotation: Annotation) => void;
}

export function AnnotationRow({ annotation: Annotation, showHost = true, onEditNote }: Props) {
    const host = hostOf(Annotation.url);

    function open(event: React.MouseEvent<HTMLAnchorElement>) {
        // Let modifier-clicks and middle-clicks behave the way the browser expects
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        browser.tabs.create({ url: Annotation.url });
        window.close();
    }

    function concat_url_and_title() {
        return showHost ? host + ": " + Annotation.website_title : Annotation.website_title;
    }

    return (
        <li className="row">
            <a className="row__link" href={Annotation.url} onClick={open}>
                <Favicon annotation={Annotation} host={host} />

                <span className="row__body">
                    {Annotation.note ? (
                        <span className="row__note">{Annotation.note}</span>
                    ) : (
                        <span className="row__note row__note--empty">No note yet</span>
                    )}

                    <span className="row__annotated_text">{Annotation.annotated_text}</span>

                    <span className="row__meta">
                        <span className="row__source">
                            <span className="row__source-text">{concat_url_and_title()}</span>
                        </span>
                        <time className="row__date" dateTime={new Date(Annotation.createdAt).toISOString()}>
                            {formatSaved(Annotation.createdAt)}
                        </time>
                    </span>
                </span>
            </a>

            <button
                type="button"
                className="row__edit"
                title={Annotation.note ? "Edit note" : "Add note"}
                aria-label={`${Annotation.note ? "Edit" : "Add"} note for ${Annotation.website_title}`}
                onClick={() => onEditNote(Annotation)}
            >
                <PencilIcon />
            </button>
        </li>
    );
}

function Favicon({ annotation: Annotation, host }: { annotation: Annotation; host: string }) {
    if (Annotation.favicon) {
        return <img className="row__icon" src={Annotation.favicon} alt="" width={16} height={16} />;
    }
    return (
        <span className="row__icon row__icon--letter" aria-hidden="true">
            {host.charAt(0).toUpperCase()}
        </span>
    );
}
