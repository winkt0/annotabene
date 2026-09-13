import type { Annotation } from "./annotation";

export interface DomainGroup {
    // Base domain, e.g. 'xyz.com'
    domain: string;
    annotations: Annotation[];
    // = createdAt of the latest annotation, for now
    lastSaved: number;
}
