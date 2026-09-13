import { storage } from "#imports";
import type { Annotation } from "@/types/annotation";
import { useEffect, useState } from "react";
import { DEFAULT_SETTINGS, type ThemeSettings } from "./theme";

export const annotationsStore = storage.defineItem<Annotation[]>("local:annotabene:annotations", {
    fallback: [],
    version: 1,
});

export function useAnnotations() {
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        annotationsStore.getValue().then(value => {
            if (!active) return;
            setAnnotations(value ?? []);
            setLoading(false);
        });

        const unwatch = annotationsStore.watch(value => setAnnotations(value ?? []));

        return () => {
            active = false;
            unwatch();
        };
    }, []);

    return { annotations, loading };
}

export async function saveNote(id: string, note: string) {
    const current = await annotationsStore.getValue();
    await annotationsStore.setValue(
        current.map(annotation => (annotation.id === id ? { ...annotation, note, updatedAt: Date.now() } : annotation)),
    );
}

export async function removeAnnotation(id: string) {
    const current = await annotationsStore.getValue();
    await annotationsStore.setValue(current.filter(annotation => annotation.id !== id));
}

export const themeStore = storage.defineItem<ThemeSettings>("local:annotabene:theme", {
    fallback: DEFAULT_SETTINGS,
    version: 1,
});
