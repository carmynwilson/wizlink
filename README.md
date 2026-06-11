# wizlink

**A tiny, fast link shortener you run on your own domain.**

wizlink turns `yourdomain.com/<slug>` into an instant redirect to any URL you want —
`yourdomain.com/sale`, `yourdomain.com/rsvp`, `yourdomain.com/discord`. It runs on a
single [Cloudflare Worker](https://workers.cloudflare.com/) at the edge, so each link
resolves in a few milliseconds with a real `302` redirect. No interstitial page, no
third-party shortener, no database, no monthly fee.

Your links live in one plain file — `links.json` — so editing them is as easy as
changing a line of text on GitHub. Every change auto-deploys.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/carmynwilson/wizlink)

---

## Why wizlink?

- **Fast.** A true edge `302` in tens of milliseconds. Great for QR codes and printed
  flyers, where a slow redirect makes people give up.
- **Yours.** Links live on *your* domain, not a shortener's. If you ever move off
  wizlink, you still own every link.
- **Free.** Runs comfortably inside Cloudflare's free Workers tier for typical use.
- **No-code edits.** Add or change a link by editing `links.json` in your browser. A
  typo can't take your links down — a bad commit fails the build, and the last good
  version keeps serving.
- **Trackable.** Bake UTM parameters into your destination URLs and your existing
  analytics does the rest.

## How it works

```
visitor scans/clicks         Cloudflare Worker              the real page
  yourdomain.com/rsvp   ->   look up "rsvp" in    ->  302 ->  yourdomain.com/events/rsvp?utm_source=flyer
                             links.json (the edge)         (a few milliseconds, worldwide)
```

Two files do all the work:

| File | What it is |
|------|------------|
| **`links.json`** | Your links — `"slug": "destination URL"`. This is the only file you edit day to day. |
| **`worker.js`** | The redirect logic. Reads `links.json` and sends the redirect. You rarely touch it. |

Anything not in `links.json` (a typo, a deleted link) falls back to a homepage you set
in `worker.js`, so visitors never hit a dead end.

---

## Get started

There are three ways to set this up, easiest first.

### Option A — One-click deploy (fastest)

1. Click the **Deploy to Cloudflare** button above.
2. Cloudflare walks you through cloning this repo into *your* GitHub account and
   deploying the Worker. It also wires up auto-deploy, so future edits to your copy of
   `links.json` go live automatically.
3. When it finishes, you'll get a free `https://<name>.<your-subdomain>.workers.dev` URL.
   Test it: visit `…workers.dev/hello` and you should be redirected.
4. Edit `links.json` in your new repo, then [add your own domain](#add-your-own-domain).

### Option B — Use this template, connect by hand

1. Click **Use this template → Create a new repository** at the top of this page.
2. In the [Cloudflare dashboard](https://dash.cloudflare.com/): **Workers & Pages →
   Create → Workers → Connect to Git**, and pick your new repo.
3. Set the build to run `npx wrangler deploy` (Cloudflare usually detects this
   automatically from `wrangler.toml`). Branch: `main`.
4. Deploy. Test the `…workers.dev/hello` URL, then
   [add your own domain](#add-your-own-domain).

### Option C — Local command line (for developers)

```bash
# 1. Clone your copy
git clone https://github.com/<you>/<your-repo>.git
cd <your-repo>

# 2. Log in to Cloudflare and deploy
npx wrangler login
npx wrangler deploy
```

Edit `links.json`, run `npx wrangler deploy` again, done. (Or connect the repo to
Cloudflare with Option B so pushes auto-deploy and you never run the CLI again.)

---

## Add your own domain

By default you get a `*.workers.dev` URL. To use your real domain (the whole point):

1. Your domain needs to be on Cloudflare (added as a site in your Cloudflare account).
2. **Workers & Pages → your worker → Settings → Domains & Routes → Add → Custom Domain.**
3. Add both `yourdomain.com` and `www.yourdomain.com` if you want both to work.
4. That's it — Cloudflare creates the DNS records for you. The binding persists across
   deploys, so you never have to redo it.
5. (Optional) set `workers_dev = false` in `wrangler.toml` to turn off the
   `.workers.dev` URL once your domain works.

> **Tip:** a short domain makes the best shortener. Many people register a brand-y
> domain just for this and point it at their wizlink Worker.

---

## Editing your links

Day to day, you only ever edit **`links.json`**. Full no-code, step-by-step instructions
(add / change / remove a link straight from the GitHub website) are in
**[EDITING-LINKS.md](EDITING-LINKS.md)**.

The short version:

```json
{
  "rsvp": "https://yourdomain.com/events/rsvp/",
  "discord": "https://discord.gg/your-invite",
  "sale": "https://yourshop.com/sale?utm_source=flyer&utm_medium=print"
}
```

Each line is `"slug": "destination"`. Commit the change and (if you connected the repo
to Cloudflare) it auto-deploys in a minute or two.

## Set your fallback

Open `worker.js` and change this line to your own homepage:

```js
const FALLBACK = "https://example.com/";
```

Any slug that doesn't exist redirects here instead of erroring.

## Tracking clicks

wizlink keeps the Worker dead simple and doesn't count clicks itself. The easy way to
track campaigns is to add [UTM parameters](https://en.wikipedia.org/wiki/UTM_parameters)
to your destination URLs in `links.json` — your existing site analytics (Google
Analytics, Plausible, etc.) will then attribute the visits. Want per-slug counters at
the edge instead? Cloudflare Workers KV or Analytics Engine can be added later.

---

## FAQ

**Why a 302 and not a 301?**
A `301` is "permanent" and browsers cache it aggressively — change the destination and
people who clicked before keep going to the *old* place. A `302` is never cached, so
your links stay editable forever.

**Can I break my links with a bad edit?**
If you connected the repo to Cloudflare, a malformed `links.json` fails the build and
your previous working version keeps serving. So no — fix it and commit again.

**Does this cost anything?**
Cloudflare's free Workers tier covers a lot of redirects. Heavy traffic may need a paid
plan, but most personal and organization use stays free. You do need to own a domain.

**Is my data private?**
The only thing in this repo is your list of slugs and destination URLs. There are no
secrets, API keys, or visitor data stored here — which is why it's safe to keep public.

---

## License

MIT — see [LICENSE](LICENSE). Use it, fork it, ship it.
