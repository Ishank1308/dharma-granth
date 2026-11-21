import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { expect, test, type Page } from '@playwright/test';

/**
 * The verse-of-the-day widget (public/embed.js, the snippet on /daily-verse/) is an iframe on other
 * people's sites. public/_headers lets /embed/* alone be framed by any origin; every other page keeps
 * X-Frame-Options: SAMEORIGIN and frame-ancestors 'self'. scripts/serve-dist.mjs applies those rules
 * the way Cloudflare Pages does, so this runs against the same headers as production.
 */
let blog: Server;
let blogOrigin = '';
let framedUrl = '';

// "Someone else's blog": a second origin (its own port) whose only page frames whatever framedUrl is.
test.beforeAll(async () => {
  blog = createServer((_req, res) => {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(`<!doctype html><title>Someone else's blog</title><iframe id="widget" src="${framedUrl}" width="600" height="400"></iframe>`);
  });
  await new Promise<void>((resolve) => blog.listen(0, 'localhost', resolve));
  blogOrigin = `http://localhost:${(blog.address() as AddressInfo).port}`;
});

test.afterAll(async () => {
  await new Promise((resolve) => blog.close(resolve));
});

async function frameFromAnotherSite(page: Page, baseURL: string, path: string) {
  framedUrl = new URL(path, baseURL).href;
  expect(new URL(framedUrl).origin).not.toBe(blogOrigin);
  await page.goto(blogOrigin);
  return page.frameLocator('#widget');
}

test('the verse-of-the-day widget loads inside another site', async ({ page, baseURL }) => {
  const frame = await frameFromAnotherSite(page, baseURL!, '/embed/verse-of-the-day/');
  await expect(frame.locator('.embed-card-root')).toBeVisible();
});

test('other pages still refuse to be framed by another site', async ({ page, baseURL }) => {
  const blocked = page.waitForEvent('requestfailed', (request) => request.url() === new URL('/', baseURL!).href);
  const frame = await frameFromAnotherSite(page, baseURL!, '/');
  // The browser discards the response, so none of the site's markup reaches the frame.
  await blocked;
  await expect(frame.locator('header, main, nav')).toHaveCount(0);
});
