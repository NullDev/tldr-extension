import "./style/content.scss";

/* ========================= */
/* = Copyright (c) NullDev = */
/* ========================= */

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
        sendResponse({
            content: getPageContent(),
        });
    }
});
