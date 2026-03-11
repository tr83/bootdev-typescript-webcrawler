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

test("getHeadingFromHTML returns H1 tag content", () => {
    const input = "<html><head><title>Test</title></head><body><h1>Heading</h1></body></html>";
    const actual = getHeadingFromHTML(input);
    const expected = "Heading";
    expect(actual).toEqual(expected);
});

test("getHeadingFromHTML returns H1 tag content, ignoring H2", () => {
    const input = "<html><head><title>Test</title></head><body><h1>Heading</h1><h2>Subheading</h2></body></html>";
    const actual = getHeadingFromHTML(input);
    const expected = "Heading";
    expect(actual).toEqual(expected);
});

test("getHeadingFromHTML returns H2 tag content as fallback if H1 is not present", () => {
    const input = "<html><head><title>Test</title></head><body><h2>Heading H2</h2></body></html>";
    const actual = getHeadingFromHTML(input);
    const expected = "Heading H2";
    expect(actual).toEqual(expected);
});

test("getHeadingFromHTML returns empty string if neither an <h1> nor an <h2> tag is found", () => {
    const input = "<html><head><title>Test</title></head><body><p>Content</p></body></html>";
    const actual = getHeadingFromHTML(input);
    const expected = "";
    expect(actual).toEqual(expected);
});

test("getFirstParagraphFromHTML returns the main-element's first paragraph", () => {
    const input = "<html><head><title>Test</title></head><body><main><p>First paragraph</p><p>Second paragraph</p></main></body></html>";
    const actual = getFirstParagraphFromHTML(input);
    const expected = "First paragraph";
    expect(actual).toEqual(expected);
});

test("getFirstParagraphFromHTML returns the first paragraph if the main element is not found", () => {
    const input = "<html><head><title>Test</title></head><body><p>First paragraph</p><p>Second paragraph</p></body></html>";
    const actual = getFirstParagraphFromHTML(input);
    const expected = "First paragraph";
    expect(actual).toEqual(expected);
});

test("getFirstParagraphFromHTML returns the first paragraph even if it's further down the page", () => {
    const input = "<html><head><title>Test</title></head><body><div><a>Anchor</a></div><div><p>First paragraph</p><p>Second paragraph</p></div></body></html>";
    const actual = getFirstParagraphFromHTML(input);
    const expected = "First paragraph";
    expect(actual).toEqual(expected);
});