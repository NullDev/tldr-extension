# tl;dr
[![License](https://img.shields.io/github/license/NullDev/tldr-extension?label=License&logo=Creative%20Commons)](https://github.com/NullDev/tldr-extension/blob/master/LICENSE) [![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/NullDev/tldr-extension?logo=Cachet)](https://github.com/NullDev/tldr-extension/issues?q=is%3Aissue+is%3Aclosed) [![ESLint](https://github.com/NullDev/tldr-extension/actions/workflows/eslint.yml/badge.svg)](https://github.com/NullDev/tldr-extension/actions/workflows/eslint.yml) ![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/NullDev/tldr-extension/master?label=version)

<p align="center"><img height="250" width="auto" src="/icons/icon128.png" /></p>
<p align="center"><b>tl;dr - Ask websites anything</b></p>
<hr>

## :question: What does it do?

This is a Chrome Extension that allows users to asks websites specific questions about their content. The page content is sanitized and sent to Gemini along with the question of the user. <br><br>
It is my submission for the Google AI Competition

**Demo Video:** https://www.youtube.com/watch?v=1dtRHrxl8lc

<hr>

## :star: Downloading the extension

The extension can be downloaded from the official Chrome store: <br>
https://chromewebstore.google.com/detail/tldr/ceoomcdkamoifgcdeflofkdmpjmmcnka

<hr>

## :diamond_shape_with_a_dot_inside: Feature requests & Issues

Feature request or discovered a bug? Please [open an Issue](https://github.com/NullDev/tldr-extension/issues/new/choose) here on GitHub.

<hr>

## :wrench: Building yourself [DEV ONLY]

0. Open up your favourite terminal (and navigate somewhere you want to download the repository to). <br><br>
1. Make sure you have NodeJS installed. Test by entering <br>
$ `node -v` <br>
If this returns a version number, NodeJS is installed. **If not**, get NodeJS <a href="https://nodejs.org/en/download/package-manager/">here</a>. <br><br>
2. Clone the repository and navigate to it. If you have Git installed, type <br>
$ `git clone https://github.com/NullDev/tldr-extension.git && cd tldr-extension` <br>
If not, download it <a href="https://github.com/NullDev/tldr-extension/archive/master.zip">here</a> and extract the ZIP file.<br>
Then navigate to the folder.<br><br>
3. Install all dependencies by typing <br>
$ `npm install`<br><br>
3. Build it by typing <br>
$ `npm run build`<br><br>
3.1 Or debug it by typing <br>
$ `npm run dev`<br><br>
4. Once built, in Chrome, go to `chrome://extensions/`, click "load unpacked" and select the dist folder in the repo. <br><br>
5. Click on the extension, click the gear icon, and paste your gemini key. Then hit save <br><br>
6. Done!

<hr>

## :satellite: Using prepacked extension [DEV ONLY]

1. Download the [latest crx from the release page](https://github.com/NullDev/tldr-extension/releases) <br><br>
2. Either go to `chrome://extensions/` and drag-n-drop the crx in there, or open the crx with chrome. Then enable it (!) which might require enabling dev mode
3. Once the extension is loaded: Click on it, then click the gear icon and paste your gemini key. Then hit save <br><br>
4. All done! You can now use tl;dr :) 

If that does not work, see [Building yourself](#wrench-building-yourself).

<hr>

## :lock: Data Protection Disclaimer

This extension does not store any personal data. However website content that might include personal data is sent to Google Gemini AI when a question is submitted.
