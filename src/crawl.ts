import { JSDOM } from 'jsdom'

export function normalizeURL(url: string) {
    const urlObj = new URL(url);
    let fullPath = `${urlObj.host}${urlObj.pathname}`;

    if (fullPath.slice(-1) === "/") {
        fullPath = fullPath.slice(0, -1);
    }

    return fullPath;
}

export function getHeadingFromHTML(html: string) {
    const dom = new JSDOM(html);
    const h1 = dom.window.document.querySelector("h1");

    if (h1) {
        return h1.textContent;
    }

    const h2 = dom.window.document.querySelector("h2");

    if (h2) {
        return h2.textContent;
    }

    return '';
}

export function getFirstParagraphFromHTML(html: string) {
    const dom = new JSDOM(html);
    const main = dom.window.document.querySelector("main");

    if (main) {
        const p = main.querySelector("p");
        if (p) {
            return p.textContent;
        }
    }

    const p = dom.window.document.querySelector("p");
    return p ? p.textContent : '';
}