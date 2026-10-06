/**
 * wizlink: a tiny, fast link shortener that runs on a Cloudflare Worker.
 * ----------------------------------------------------------------------
 * Point a domain at this Worker and `yourdomain.com/<slug>` instantly teleports
 * the visitor to a full URL. It's a real 302 redirect resolved at Cloudflare's edge
 * in a few milliseconds. No "please wait" page, no third-party hop, no database.
 *
 * You almost never edit THIS file. Your links live in `links.json`, and that's the
 * spellbook. This file is just the magic that reads it. Even the fallback (where
 * unknown slugs go) is a line in `links.json`: the one whose slug is "*".
 *
 * A 302 (not 301) is used on purpose: browsers never permanently cache a 302, so
 * you can change where any slug points at any time and it takes effect immediately.
 */

import LINKS from "./links.json";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Normalise the path into a slug: strip leading/trailing slashes, lowercase.
    const slug = url.pathname.replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();

    // Only the slugs written in links.json count. Without the hasOwn check, paths like
    // /constructor would match properties every JavaScript object has built in.
    const dest = (Object.hasOwn(LINKS, slug) && LINKS[slug]) || LINKS["*"];

    if (!dest) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: env.PASS_QUERY === "true" ? withQuery(dest, url) : dest,
        "Cache-Control": "no-store",
      },
    });
  },
};

// Copy the visitor's query string onto the destination, so
// yourdomain.com/flyer?utm_medium=poster arrives with utm_medium=poster. A parameter
// in the visitor's link replaces one of the same name in the destination.
function withQuery(dest, url) {
  if (!url.search) return dest;
  const out = new URL(dest);
  for (const key of new Set(url.searchParams.keys())) out.searchParams.delete(key);
  for (const [key, value] of url.searchParams) out.searchParams.append(key, value);
  return out.href;
}
