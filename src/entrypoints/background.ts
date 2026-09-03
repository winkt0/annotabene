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
    await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: annotateSelection,
      args: [color],
    });
  });

  function annotateSelection(color: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.style.color = color;
    span.appendChild(range.extractContents());
    range.insertNode(span);
    selection.removeAllRanges();
  }
});
