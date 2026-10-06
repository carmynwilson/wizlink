# Editing your links

You don't need to install anything or understand any code. Everything here happens on
the GitHub website, in your browser. You only ever edit **one file: `links.json`**.

When you save a change, your site updates within a minute or two (if your repo is
connected to Cloudflare). Every change gets checked before it goes live. If you make a
mistake, Cloudflare refuses that version and the old one stays live, so you can't take
your links down. Don't be afraid to try.

---

## What a link looks like

Open **`links.json`**. Each link is one line that looks like this:

```json
  "rsvp": "https://yourdomain.com/events/rsvp/",
```

- The part in the **first** set of quotes (`rsvp`) is the **slug**, the bit after the
  slash. This line means **yourdomain.com/rsvp** sends people to that full URL.
- The part in the **second** set of quotes is the **destination**, where people go.

Two lines are special:

- **`"*"`** is the fallback. Anyone who types a slug that doesn't exist lands here.
  Keep this line. Point it at your homepage.
- **`""`** (empty quotes, optional) is your bare domain, `yourdomain.com` with nothing
  after the slash. Without this line, the bare domain uses the `"*"` fallback.

---

## To change where a link points

1. Open the repo on GitHub and click the **`links.json`** file.
2. Click the **pencil icon** ("Edit this file") near the top right.
3. Find the slug you want. Replace the **destination URL** (the second set of quotes)
   with the new one. Leave the slug, the quotes, and the commas alone.
4. Scroll down and click the green **Commit changes** button, then **Commit changes**
   again in the popup.
5. Done. Wait a minute or two, then test the link in your browser.

## To add a new link

1. Edit **`links.json`** (pencil icon, same as above).
2. Add a new line. The easiest way: copy an existing line, paste it below, and change
   both parts. For example, to make **yourdomain.com/sale** point to a shop page:

   ```json
     "sale": "https://yourshop.com/summer-sale/",
   ```

3. The only rules to get right:
   - Each line needs **both quote marks**, around the slug *and* around the URL.
   - Put a **comma at the end of every line except the last one** in the file.
   - Keep the slug lowercase with no spaces (use hyphens, like `summer-sale`).
   - Start every destination with `https://`.
   - Use each slug only once.
4. Commit changes (green button, twice). Wait a minute, then test **yourdomain.com/sale**.

> **Tip:** add new links in the **middle** of the list rather than the very end. Then
> you never have to think about the "no comma on the last line" rule.

## To remove a link

1. Edit **`links.json`** and delete the whole line for that slug.
2. Make sure the line that's now last in the file does **not** end with a comma.
3. Commit changes. That slug will now quietly send people to your `"*"` fallback
   instead.

---

## If something looks wrong

- **The link didn't update after a couple of minutes:** look at the little mark next
  to your most recent commit. A red X means Cloudflare refused that edit. Click it, then
  **Details**, to open the build log in Cloudflare (you'll need to be signed in). The
  log names the exact line and what's wrong with it (a missing comma, a capital letter
  in a slug, a link without `https://`, a slug used twice).
  Fix that line in `links.json` and commit again. Your live links were never affected.
- **Not sure your file is valid?** Copy everything in `links.json` and paste it into
  [jsonlint.com](https://jsonlint.com). It points to the exact line with the problem.

That's the whole job. Edit a line, commit, done.
