import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
    modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
    autoIcons: {
        enabled: true,
        baseIconPath: "./assets/icon.svg",
    },
    srcDir: "src",
    manifest: {
        name: "annotabene",
        description: "Annotate text, add notes, see a list of all your annotations in the extension's popup",
        permissions: ["contextMenus", "scripting", "storage", "activeTab"],
    },
});
