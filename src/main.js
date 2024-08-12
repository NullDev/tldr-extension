import "./style/style.scss"; // @ts-ignore
import scriptPath from "./content?script&module";

/* ========================= */
/* = Copyright (c) NullDev = */
/* ========================= */

/**
 * Start the loader
 *
 * @return {void}
 */
const startLoader = function(){
    const loader = document.getElementById("loader");
    if (!loader) return;

    const output = document.getElementById("output");
    if (!output) return;

    output.style.display = "none";
    loader.style.display = "grid";
};

/**
 * Stop the loader
 *
 * @return {void}
 */
const stopLoader = function(){
    const loader = document.getElementById("loader");
    if (!loader) return;

    const output = document.getElementById("output");
    if (!output) return;

    loader.style.display = "none";
    output.style.display = "block";
};

/**
 * Make an API call to get the answer
 *
 * @param {string} pageData
 * @param {string} question
 * @return {Promise<void>}
 */
const apiCall = async function(pageData, question){
    const apiKey = await new Promise((resolve) => {
        chrome.storage.sync.get(["apiKey"], (data) => {
            resolve(data.apiKey);
        });
    });

    if (!apiKey){
        const output = document.getElementById("output");
        if (!output){
            console.error("API key not set.");
            return;
        }

        output.innerHTML = "Error: API key not set. Click on the gear icon on the top right to set the key.";
        return;
    }

    startLoader();

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    const data = {
        contents: [{
            parts: [{
                text: `Question: ${question}\n\nWebsite Data: ${pageData}`,
            }],
        }],
        systemInstruction: {
            role: "user",
            parts: [{
                text: "You receive the content of a website and answer questions from users that will request specific information on the site. Only respond in text without markdown or special syntax.",
            }],
        },
        generationConfig: {
            temperature: 1,
            topK: 64,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        },
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());

    const output = document.getElementById("output");
    if (!output) return;

    const res = response?.candidates[0]?.content?.parts[0]?.text;
    if (!res){
        output.innerHTML = "Error: No response from the API.";
        return;
    }
    output.innerHTML = res;

    stopLoader();
};

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
        return;
    }

    const { content } = response;
    if (!content) return;

    apiCall(content, value).then(() => { // @ts-ignore
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

    const { value } = input;
    if (!value) return;

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
};

(() => {
    document.addEventListener("DOMContentLoaded", () => {
        init();
    });
})();
