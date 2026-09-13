import type { Annotation } from "@/types/annotation";
import { hostOf } from "@/util/annotations";
import { saveNote } from "@/util/storage";
import { useEffect, useRef, useState } from "react";

interface Props {
    annotation: Annotation;
    onClose: () => void;
}

export function NoteEditor({ annotation: Annotation, onClose }: Props) {
    const [draft, setDraft] = useState(Annotation.note);
    const [saving, setSaving] = useState(false);
    const textarea = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        textarea.current?.focus();
        textarea.current?.setSelectionRange(draft.length, draft.length);
    }, []);

    async function save() {
        setSaving(true);
        await saveNote(Annotation.id, draft.trim());
        onClose();
    }

    function onKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Escape") onClose();
        if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) save();
    }

    return (
        <div className="editor" onKeyDown={onKeyDown}>
            <div className="editor__scrim" onClick={onClose} />

            <div className="editor__sheet" role="dialog" aria-label={`Note for ${Annotation.website_title}`}>
                <div className="editor__head">
                    <span className="editor__title">{Annotation.website_title}</span>
                    <span className="editor__host">{hostOf(Annotation.url)}</span>
                </div>

                <textarea
                    ref={textarea}
                    className="editor__field"
                    value={draft}
                    rows={5}
                    placeholder="..."
                    onChange={event => setDraft(event.target.value)}
                />

                <div className="editor__actions">
                    <button type="button" className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="button" className="btn btn--primary" onClick={save} disabled={saving}>
                        {saving ? "Saving" : "Save note"}
                    </button>
                </div>
            </div>
        </div>
    );
}
