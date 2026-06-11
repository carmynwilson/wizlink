/**
 * wizlink — a tiny, fast link shortener that runs on a Cloudflare Worker.
 * ----------------------------------------------------------------------
 * Point a domain at this Worker and `yourdomain.com/<slug>` instantly teleports
 * the visitor to a full URL — a real 302 redirect resolved at Cloudflare's edge in
 * a few milliseconds. No interstitial, no third-party hop, no database.
 *
 * You almost never edit THIS file. Your links live in `links.json` — that's the
 * spellbook. This file is just the magic that reads it.
 *
 * A 302 (not 301) is used on purpose: browsers never permanently cache a 302, so
 * you can change where any slug points at any time and it takes effect immediately.
 */

import LINKS from "./links.json";

// Where unknown or mistyped slugs land. Set this to your own homepage.
const FALLBACK = "https://example.com/";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Normalise the path into a slug: strip leading/trailing slashes, lowercase.
    const slug = url.pathname.replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();

    const dest = LINKS[slug] || FALLBACK;

    return new Response(null, {
      status: 302,
      headers: {
        Location: dest,
        "Cache-Control": "no-store",
      },
    });
  },
};
