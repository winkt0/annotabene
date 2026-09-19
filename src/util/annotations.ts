import type { Annotation } from "@/types/annotation";
import type { DomainGroup } from "@/types/domainGroup";

export function hostOf(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
}

export function pathOf(url: string): string {
    try {
        const { pathname, search } = new URL(url);
        const tail = (pathname + search).replace(/\/$/, "");
        return tail;
    } catch {
        return "";
    }
}

// TODO: real search, maybe fuzzy ranking so title hit > note hit?
export function searchAnnotations(annotations: Annotation[], query: string): Annotation[] {
    const q = query.trim().toLowerCase();
    if (!q) return annotations;

    return annotations.filter(annotation =>
        [annotation.website_title, annotation.url, annotation.note].some(field => field?.toLowerCase().includes(q)),
    );
}

// TODO
export function sortAnnotations(annotations: Annotation[]): Annotation[] {
    return annotations.sort((a1, a2) => a2.createdAt - a1.createdAt);
}

export function groupByDomain(annotations: Annotation[]): DomainGroup[] {
    const buckets = new Map<string, Annotation[]>();

    for (const Annotation of annotations) {
        const domain = hostOf(Annotation.url);
        const bucket = buckets.get(domain);
        if (bucket) bucket.push(Annotation);
        else buckets.set(domain, [Annotation]);
    }

    return [...buckets.entries()]
        .map(([domain, items]) => {
            const ordered = [...items].sort((a, b) => b.createdAt - a.createdAt);
            const createdAt = ordered[0] ? ordered[0].createdAt : -1;
            return { domain, annotations: ordered, lastSaved: createdAt };
        })
        .sort((a, b) => b.lastSaved - a.lastSaved);
}

const DAY_IN_MS = 86_400_000;

// "just now", "4h", "3d", "6 Mar" / "6 Mar 2024"
export function formatSaved(timestamp: number, now = Date.now()): string {
    const diff = now - timestamp;

    if (diff < 60_000) return "just now";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
    if (diff < DAY_IN_MS) return `${Math.floor(diff / 3_600_000)}h`;
    if (diff < 7 * DAY_IN_MS) return `${Math.floor(diff / DAY_IN_MS)}d`;

    const date = new Date(timestamp);
    const sameYear = date.getFullYear() === new Date(now).getFullYear();

    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        ...(sameYear ? {} : { year: "numeric" }),
    });
}
