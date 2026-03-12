import { test, expect } from "vitest";
import { normalizeURL, getHeadingFromHTML, getFirstParagraphFromHTML, getURLsFromHTML, getImagesFromHTML } from "./crawl";

test("normalizeURL protocol", () => {
    const input = "https://crawler-test.com/path";
    const actual = normalizeURL(input);
    const expected = "crawler-test.com/path";
    expect(actual).toEqual(expected);
});

test("normalizeURL slash", () => {
    const input = "https://crawler-test.com/path/";
    const actual = normalizeURL(input);
    const expected = "crawler-test.com/path";
    expect(actual).toEqual(expected);
});

test("normalizeURL capitals", () => {
    const input = "https://CRAWLER-TEST.com/path";
    const actual = normalizeURL(input);
    const expected = "crawler-test.com/path";
    expect(actual).toEqual(expected);
});

test("normalizeURL http", () => {
    const input = "http://CRAWLER-TEST.com/path";
    const actual = normalizeURL(input);
    const expected = "crawler-test.com/path";
    expect(actual).toEqual(expected);
});


test("getHeadingFromHTML basic", () => {
    const inputBody = `<html><body><h1>Test Title</h1></body></html>`;
    const actual = getHeadingFromHTML(inputBody);
    const expected = "Test Title";
    expect(actual).toEqual(expected);
});

test("getHeadingFromHTML h2 fallback", () => {
    const inputBody = `<html><body><h2>Fallback Title</h2></body></html>`;
    const actual = getHeadingFromHTML(inputBody);
    const expected = "Fallback Title";
    expect(actual).toEqual(expected);
});

test("getFirstParagraphFromHTML main priority", () => {
    const inputBody = `
    <html><body>
      <p>Outside paragraph.</p>
      <main>
        <p>Main paragraph.</p>
      </main>
    </body></html>`;
    const actual = getFirstParagraphFromHTML(inputBody);
    const expected = "Main paragraph.";
    expect(actual).toEqual(expected);
});

test("getFirstParagraphFromHTML fallback to first p", () => {
    const inputBody = `
    <html><body>
      <p>First outside paragraph.</p>
      <p>Second outside paragraph.</p>
    </body></html>`;
    const actual = getFirstParagraphFromHTML(inputBody);
    const expected = "First outside paragraph.";
    expect(actual).toEqual(expected);
});

test("getFirstParagraphFromHTML no paragraphs", () => {
    const inputBody = `<html><body><h1>Title</h1></body></html>`;
    const actual = getFirstParagraphFromHTML(inputBody);
    const expected = "";
    expect(actual).toEqual(expected);
});

test("getURLsFromHTML absolute", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `<html><body><a href="https://crawler-test.com"><span>Boot.dev</span></a></body></html>`;
    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = ["https://crawler-test.com/"];
    expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `<html><body><a href="/path/one"><span>Boot.dev</span></a></body></html>`;
    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = ["https://crawler-test.com/path/one"];
    expect(actual).toEqual(expected);
});

test("getURLsFromHTML both absolute and relative", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody =
        `<html><body>` +
        `<a href="/path/one"><span>Boot.dev</span></a>` +
        `<a href="https://other.com/path/one"><span>Boot.dev</span></a>` +
        `</body></html>`;
    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = [
        "https://crawler-test.com/path/one",
        "https://other.com/path/one",
    ];
    expect(actual).toEqual(expected);
});

test("getImagesFromHTML absolute", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `<html><body><img src="https://crawler-test.com/logo.png" alt="Logo"></body></html>`;
    const actual = getImagesFromHTML(inputBody, inputURL);
    const expected = ["https://crawler-test.com/logo.png"];
    expect(actual).toEqual(expected);
});

test("getImagesFromHTML relative", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `<html><body><img src="/logo.png" alt="Logo"></body></html>`;
    const actual = getImagesFromHTML(inputBody, inputURL);
    const expected = ["https://crawler-test.com/logo.png"];
    expect(actual).toEqual(expected);
});

test("getImagesFromHTML multiple", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody =
        `<html><body>` +
        `<img src="/logo.png" alt="Logo">` +
        `<img src="https://cdn.boot.dev/banner.jpg">` +
        `</body></html>`;
    const actual = getImagesFromHTML(inputBody, inputURL);
    const expected = [
        "https://crawler-test.com/logo.png",
        "https://cdn.boot.dev/banner.jpg",
    ];
    expect(actual).toEqual(expected);
});