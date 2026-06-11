# ✏️ Editing your links

You don't need to install anything or understand any code. Everything here happens on
the GitHub website, in your browser. You only ever edit **one file: `links.json`** — your
spellbook of links.

When you save a change, your site updates within a minute or two (if your repo is
connected to Cloudflare). If you make a typo that breaks the file, the old version stays
live — **you can't take your links down**, so don't be afraid to try.

---

## What a link looks like

Open **`links.json`**. Each link is one line that looks like this:

```json
  "rsvp": "https://yourdomain.com/events/rsvp/",
```

- The part in the **first** set of quotes (`rsvp`) is the **slug** — the bit after the
  slash. This line means **yourdomain.com/rsvp** sends people to that full URL.
- The part in the **second** set of quotes is the **destination** — where people go.

---

## ✦ To CHANGE where a link points

1. Open the repo on GitHub and click the **`links.json`** file.
2. Click the **pencil icon** (✏️ "Edit this file") near the top right.
3. Find the slug you want. Replace the **destination URL** (the second set of quotes)
   with the new one. Leave the slug, the quotes, and the commas alone.
4. Scroll down and click the green **Commit changes** button, then **Commit changes**
   again in the popup.
5. Done. Wait a minute or two, then test the link in your browser.

## ✦ To ADD a new link

1. Edit **`links.json`** (pencil icon, same as above).
2. Add a new line. Easiest way: copy an existing line, paste it below, and change both
   parts. For example, to make **yourdomain.com/sale** point to a shop page:

   ```json
     "sale": "https://yourshop.com/summer-sale/",
   ```

3. **The only rules to get right:**
   - Each line needs **both quote marks** — around the slug *and* around the URL.
   - Put a **comma at the end of every line EXCEPT the last one** in the file.
   - Keep the slug lowercase with no spaces (use hyphens, like `summer-sale`).
4. Commit changes (green button, twice). Wait a minute, then test **yourdomain.com/sale**.

> **Pro tip:** add new links in the **middle** of the list rather than the very end —
> then you never have to think about the "no comma on the last line" rule.

## ✦ To REMOVE a link

1. Edit **`links.json`** and delete the whole line for that slug.
2. Make sure the line that's now last in the file does **not** end with a comma.
3. Commit changes. That slug will now quietly send people to your fallback homepage
   instead.

---

## 😅 If something looks wrong

- **The link didn't update after a couple minutes:** look at the little dot next to your
  most recent commit (or the **Actions** tab). A red ✗ means your edit had a small typo —
  almost always a missing comma or quote. Open `links.json`, fix it, and commit again.
  Your live links were never affected.
- **Not sure your file is valid?** Copy everything in `links.json` and paste it into
  [jsonlint.com](https://jsonlint.com) — it points to the exact line with the problem.

That's the whole job. Edit a line, commit, done. 🪄
