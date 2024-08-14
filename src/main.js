import "./style/style.scss";
import gemini from "./util/gemini.js"; // @ts-ignore
import scriptPath from "./content?script&module";

/* ========================= */
/* = Copyright (c) NullDev = */
/* ========================= */

/**
 * Handle the response
 *
 * @param {Object} response
 * @param {chrome.tabs.Tab} activeTab
 * @param {string} value
 * @return {void}
 */
const handleResponse = function(response, activeTab, value){
    if (chrome.runtime.lastError){
        console.error(chrome.runtime.lastError.message);
        const output = document.getElementById("output");
        if (!output) return;
        output.innerHTML = "Error: Cannot execute on this page.";
        output.style.display = "block";
        return;
    }

    const { content } = response;
    if (!content) return;

    gemini(content, value).then(() => { // @ts-ignore
        chrome.tabs.sendMessage(activeTab.id, { type: "stopLoader" });
    });
};

/**
 * Ask the question
 *
 * @return {void}
 */
const ask = function(){
    const input = /** @type {HTMLInputElement} */ (document.getElementById("input"));
    if (!input) return;

    const output = document.getElementById("output");
    if (!output) return;

    const { value } = input;
    if (!value) return;

    try {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
            const activeTab = tabs[0];
            if (!activeTab || !activeTab.id) return;

            chrome.tabs.sendMessage(activeTab.id, { type: "ping" }, function(){
                if (chrome.runtime.lastError){
                    chrome.scripting.executeScript(
                        { // @ts-ignore
                            target: { tabId: activeTab.id },
                            files: [scriptPath],
                        },
                        () => { // @ts-ignore
                            chrome.tabs.sendMessage(activeTab.id, { type: "getPageContent" }, (response) => {
                                handleResponse(response, activeTab, value);
                            });
                        },
                    );
                }
                else { // @ts-ignore
                    chrome.tabs.sendMessage(activeTab.id, { type: "getPageContent" }, (response) => {
                        handleResponse(response, activeTab, value);
                    });
                }
            });
        });
    }
    catch (e){
        console.error(e);
        output.innerHTML = "Error: Cannot execute on this page.";
        output.style.display = "block";
    }
};

/**
 * Toggle the settings page
 *
 * @return {void}
 */
const toggleSettingsPage = function(){
    const settingsPage = document.getElementById("settings-page");
    if (!settingsPage) return;

    settingsPage.classList.toggle("hidden");
};

/**
 * Initialize the application
 *
 * @return {void}
 */
const init = function(){
    const settingsBtn = /** @type {HTMLLinkElement} */(document.getElementById("settings"));
    if (!settingsBtn) return;
    settingsBtn.addEventListener("click", () => toggleSettingsPage());

    const askBtn = /** @type {HTMLButtonElement} */(document.getElementById("ask"));
    if (!askBtn) return;
    askBtn.addEventListener("click", () => ask());

    const input = /** @type {HTMLInputElement} */ (document.getElementById("input"));
    if (!input) return;
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") ask();
    });

    const saveBtn = /** @type {HTMLButtonElement} */(document.getElementById("save"));
    const apiKey = /** @type {HTMLInputElement} */(document.getElementById("api-key"));
    if (!saveBtn) return;
    saveBtn.addEventListener("click", () => {
        if (!apiKey) return;

        const keyData = apiKey.value;
        if (!keyData) return;

        chrome.storage.sync.set({ apiKey: keyData }, () => {
            const pStatus = document.getElementById("status");
            if (!pStatus) return;

            pStatus.textContent = "Key saved.";
        });
    });

    chrome.storage.sync.get(["apiKey"], (data) => {
        if (!apiKey) return;
        apiKey.value = data.apiKey || "";
    });

    const cYear = /** @type {HTMLSpanElement} */ (document.getElementById("c-year"));
    if (!cYear) return;
    cYear.textContent = String(new Date().getFullYear());

    const version = /** @type {HTMLSpanElement} */ (document.getElementById("version"));
    if (!version) return;

    const manifestData = chrome.runtime.getManifest();
    version.textContent = manifestData.version;
};

(() => {
    document.addEventListener("DOMContentLoaded", () => {
        init();
    });
})();
