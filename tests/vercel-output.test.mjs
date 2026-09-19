import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import handler from "../.vercel/output/functions/__server.func/index.mjs";

const output = new URL("../.vercel/output/", import.meta.url);

test("Vercel output routes requests to a working server and includes page assets", async () => {
  const config = JSON.parse(await readFile(new URL("config.json", output), "utf8"));
  assert.equal(config.version, 3);
  assert.ok(config.routes.some((route) => route.dest === "/__server"));

  for (const path of ["/", "/book", "/book/privacy", "/book/terms"]) {
    const response = await handler.fetch(new Request(`https://www.arushkukreja.com${path}`), { waitUntil() {} });
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /Arush Kukreja/);
    assert.match(html, /href="\/book\/privacy"/);
    assert.match(html, /href="\/book\/terms"/);

    const assets = [...html.matchAll(/(?:src|href)="([^"?]+)(?:\?[^"]*)?"/g)]
      .map((match) => match[1]).filter((url) => url.startsWith("/_next/static/") || /\.(png|jpg|svg)$/.test(url));
    assert.ok(assets.length > 0, `No assets in ${path}`);
    for (const asset of assets) {
      assert.ok((await stat(new URL(`static${asset}`, output))).isFile(), asset);
    }
  }
});

test("unconfigured Vercel booking returns a usable error rather than a missing route", async () => {
  const response = await handler.fetch(new Request("https://www.arushkukreja.com/api/booking/availability"), { waitUntil() {} });
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /email Arush/);
  assert.equal(response.headers.get("cache-control"), "no-store");
});
