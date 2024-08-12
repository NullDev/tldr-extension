import "./style/content.scss";
import scanner from "./util/scannerData.js";

/* ========================= */
/* = Copyright (c) NullDev = */
/* ========================= */

/**
 * Start the loader
 *
 * @return {void}
 */
const startLoader = function(){
    const sc = document.getElementById("__f1fc290aff698d18__SCAN_WRAPPER__");
    if (sc) return;

    document.body.insertAdjacentHTML("beforeend", scanner);
};

/**
 * Get the content of the page
 *
 * @return {string|null}
 */
const getPageContent = function(){
    function getTextFromNode(node){
        if (node.nodeType === Node.TEXT_NODE){
            return node.textContent.trim();
        }
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "SCRIPT" && node.tagName !== "STYLE"){
            let text = "";
            for (const child of node.childNodes){
                text += " " + getTextFromNode(child);
            }
            return text.trim();
        }
        return "";
    }

    return getTextFromNode(document.body);
};

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.type === "getPageContent"){
        startLoader();

        sendResponse({
            content: getPageContent(),
        });
    }
});


chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "stopLoader"){
        const sc = document.getElementById("__f1fc290aff698d18__SCAN_WRAPPER__");
        if (sc) sc.remove();
    }
});
