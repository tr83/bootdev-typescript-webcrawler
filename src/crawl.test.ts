import { test, expect } from "vitest";
import { normalizeURL, getHeadingFromHTML, getFirstParagraphFromHTML } from "./crawl";

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