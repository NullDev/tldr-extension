import "./style.scss";

/* ========================= */
/* = Copyright (c) NullDev = */
/* ========================= */

/**
 * Make an API call to get the answer
 *
 * @param {string} pageData
 * @param {string} question
 * @return {Promise<void>}
 */
const apiCall = async function(pageData, question){
    const res = await fetch("https://api.nulldev.org/tldr-ask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageData, question }),
    }).then(r => r.json());

    if (res.error){
        console.error(res.error);
        return;
    }

    const output = document.getElementById("output");
    if (!output) return;

    output.innerHTML = res.answer;
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

        chrome.tabs.sendMessage(activeTab.id, { type: "getPageContent" }, (response) => {
            if (chrome.runtime.lastError){
                console.error(chrome.runtime.lastError.message);
                return;
            }

            const { content } = response;
            if (!content) return;

            apiCall(content, value);
        });
    });
};

/**
 * Initialize the application
 *
 * @return {void}
 */
const init = function(){
    const askBtn = /** @type {HTMLButtonElement} */(document.getElementById("ask"));
    if (!askBtn) return;

    askBtn.addEventListener("click", () => ask());

    const input = /** @type {HTMLInputElement} */ (document.getElementById("input"));
    if (!input) return;
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter"){
            ask();
        }
    });
};

(() => {
    document.addEventListener("DOMContentLoaded", () => {
        init();
    });
})();
