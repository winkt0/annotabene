import { storage } from "#imports";
import { type Annotation } from "@/types/annotation";

export default defineBackground(() => {
    browser.runtime.onInstalled.addListener(() => {
        browser.contextMenus.create({
            id: "annotate",
            title: "annotate text",
            contexts: ["selection"],
        });
    });

    browser.contextMenus.onClicked.addListener(async (info, tab) => {
        if (info.menuItemId !== "annotate" || !tab?.id) return;
        const color = "#e11d48";
        const [injection] = await browser.scripting.executeScript({
            target: { tabId: tab.id },
            func: annotateSelection,
            args: [color, tab],
        });
        const annotation = injection?.result as Annotation | undefined;
        if (!annotation) return;
        storage
            .getItem<Annotation[]>(`local:annotabene:annotations`, {
                fallback: [],
            })
            .then(list => {
                list.push(annotation);
                storage.setItem<Annotation[]>(`local:annotabene:annotations`, list);
            });
    });

    function annotateSelection(color: string, tab: globalThis.Browser.tabs.Tab | undefined): Annotation | undefined {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
        const range = selection.getRangeAt(0);
        const span = document.createElement("span");
        span.style.color = color;
        span.appendChild(range.extractContents());
        range.insertNode(span);
        selection.removeAllRanges();

        // Can't access the document object outside this function, so for now we'll get the current URL here
        const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
        const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.content;

        let url = location.href;
        if (canonical) {
            url = canonical;
        } else if (ogUrl) {
            try {
                url = new URL(ogUrl, location.href).href;
            } catch {
                // malformed og:url, keep location.href
            }
        }
        const favIconUrl = tab?.favIconUrl;
        const annotation: Annotation = {
            url,
            annotated_text: range.toString(),
            createdAt: Date.now(),
            favicon: favIconUrl,
            id: Math.random().toString(36),
            website_title: document.title,
            note: "",
        };
        return annotation;
    }
});
