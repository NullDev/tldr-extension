import Loader from "./loader.js";

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

        Loader.stopLoader();
        output.innerHTML = "Error: API key not set. Click on the gear icon on the top right to set the key.";
        return;
    }

    Loader.startLoader();

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    const data = {
        contents: [{
            parts: [{
                text: `Question: ${question}\n\nWebsite Data: ${pageData}`,
            }],
        }],
        safetySettings: [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_NONE",
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_NONE",
            },
            {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_NONE",
            },
            {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_NONE",
            },
        ],
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

    const output = document.getElementById("output");
    if (!output) return;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((res) => res.json());

        const res = response?.candidates[0]?.content?.parts[0]?.text;
        if (!res){
            output.innerHTML = "Error: No response from the API.";
            Loader.stopLoader();
            return;
        }
        output.innerHTML = res;
    }

    catch (e){
        output.innerHTML = "Incorrect API key or API limit reached.";
        console.error(e);
    }

    finally {
        Loader.stopLoader();
    }
};

export default apiCall;
