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
        host_permissions: ["*://*/"],
        description: "Annotate text, see a list of all your annotations in the extension's popup",
        permissions: ["contextMenus", "scripting", "storage", "activeTab"],
        version: "1.0",
        browser_specific_settings: {
            gecko: {
                id: "extensionname@example.org",
                data_collection_permissions: {
                    required: ["none"],
                },
            },
        },
    },
});
