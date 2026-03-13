import { JSDOM } from 'jsdom'
import { ExtractedPageData } from './types';

export function normalizeURL(url: string) {
    const urlObj = new URL(url);
    let fullPath = `${urlObj.host}${urlObj.pathname}`;

    if (fullPath.slice(-1) === "/") {
        fullPath = fullPath.slice(0, -1);
    }

    return fullPath;
}

export function getHeadingFromHTML(html: string): string {
    try {
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        const h1 = doc.querySelector("h1") ?? doc.querySelector("h2");
        return (h1?.textContent ?? "").trim();
    } catch {
        return "";
    }
}

export function getFirstParagraphFromHTML(html: string): string {
    try {
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        const main = doc.querySelector("main");
        const p = main?.querySelector("p") ?? doc.querySelector("p");
        return (p?.textContent ?? "").trim();
    } catch {
        return "";
    }
}

export function getURLsFromHTML(html: string, baseURL: string): string[] {
    const urls: string[] = [];
    try {
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        const anchors = doc.querySelectorAll("a");

        anchors.forEach((anchor) => {
            const href = anchor.getAttribute("href");
            if (!href) return;

            try {
                const absoluteURL = new URL(href, baseURL).toString();
                urls.push(absoluteURL);
            } catch (err) {
                console.error(`invalid href '${href}':`, err);
            }
        });
    } catch (err) {
        console.error("failed to parse HTML:", err);
    }
    return urls;
}

export function getImagesFromHTML(html: string, baseURL: string): string[] {
    const imageURLs: string[] = [];
    try {
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        const images = doc.querySelectorAll("img");

        images.forEach((img) => {
            const src = img.getAttribute("src");
            if (!src) return;

            try {
                const absoluteURL = new URL(src, baseURL).toString();
                imageURLs.push(absoluteURL);
            } catch (err) {
                console.error(`invalid src '${src}':`, err);
            }
        });
    } catch (err) {
        console.error("failed to parse HTML:", err);
    }
    return imageURLs;
}

export function extractPageData(html: string, pageURL: string): ExtractedPageData {
    return {
        url: pageURL,
        heading: getHeadingFromHTML(html),
        first_paragraph: getFirstParagraphFromHTML(html),
        outgoing_links: getURLsFromHTML(html, pageURL),
        image_urls: getImagesFromHTML(html, pageURL)
    };
}