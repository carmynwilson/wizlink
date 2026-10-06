/**
 * Checks links.json for mistakes before every deploy and every `wrangler dev`.
 * wrangler.toml runs it through its [build] command. If anything here fails, the
 * deploy stops and the links already live keep working exactly as they were.
 *
 * Run it yourself any time with:  npm run check
 *
 * Catches the mistakes a JSON syntax check can't: a destination missing https://,
 * a slug with capital letters or spaces (it could never be visited), the same slug
 * written twice (only the last one would work), and a missing "*" fallback line.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const file = fileURLToPath(new URL("../links.json", import.meta.url));
const text = readFileSync(file, "utf8");
const problems = [];

const lineAt = (index) => text.slice(0, index).split("\n").length;

let links;
try {
  links = JSON.parse(text);
} catch (err) {
  fail([
    `links.json isn't valid JSON: ${err.message}`,
    `This is almost always a missing comma at the end of a line, a missing quote, or an extra comma after the last link.`,
  ]);
}

if (links === null || typeof links !== "object" || Array.isArray(links)) {
  fail([`links.json must be one list of links wrapped in { and }.`]);
}

// JSON.parse quietly keeps only the last of two identical slugs, so find the slugs
// in the raw text: in a flat file of "slug": "url" lines, a key is any string that
// is followed by a colon.
const seen = new Map();
for (const match of text.matchAll(/"(?:[^"\\]|\\.)*"(?=\s*:)/g)) {
  const slug = JSON.parse(match[0]);
  const line = lineAt(match.index);
  if (seen.has(slug)) {
    problems.push(`Line ${line}: "${slug}" is already used on line ${seen.get(slug)}. Only the last one would work. Delete one of them.`);
  } else {
    seen.set(slug, line);
  }
}

for (const [slug, dest] of Object.entries(links)) {
  const where = `Line ${seen.get(slug) ?? "?"}: "${slug}"`;

  if (typeof dest !== "string") {
    problems.push(`${where} must point to a URL in quotes, like "https://example.com/".`);
    continue;
  }

  if (!/^https?:\/\//i.test(dest)) {
    problems.push(`${where} points to "${dest}", which is missing https:// at the start.`);
  } else {
    try {
      new URL(dest);
    } catch {
      problems.push(`${where} points to "${dest}", which isn't a complete web address.`);
    }
  }

  if (slug === "" || slug === "*") continue;

  if (slug !== slug.toLowerCase()) {
    problems.push(`${where} has capital letters. Slugs must be lowercase: "${slug.toLowerCase()}".`);
  } else if (/\s/.test(slug)) {
    problems.push(`${where} has a space in it. Use a hyphen instead: "${slug.trim().replace(/\s+/g, "-")}".`);
  } else if (slug.startsWith("/") || slug.endsWith("/")) {
    problems.push(`${where} starts or ends with a slash. Leave the slashes off: "${slug.replace(/^\/+|\/+$/g, "")}".`);
  } else if (!reachable(slug)) {
    problems.push(`${where} can't be visited as written. Stick to lowercase letters, numbers and hyphens.`);
  }
}

if (!Object.hasOwn(links, "*")) {
  problems.push(`There's no "*" line. Add one near the top, like  "*": "https://yourdomain.com/",  so unknown links have somewhere to go.`);
}

// Report top to bottom, the way someone reading the file will look for them.
const lineOf = (problem) => Number(problem.match(/^Line (\d+)/)?.[1] ?? Infinity);
if (problems.length) fail(problems.sort((a, b) => lineOf(a) - lineOf(b) || 0));

console.log(`links.json looks good (${Object.keys(links).length} entries).`);

// A slug is reachable when the Worker, given yourdomain.com/<slug>, would turn the
// path back into exactly that slug. Catches ?, #, %, accents and the like.
function reachable(slug) {
  const path = new URL(slug, "https://example.com/").pathname;
  return path.replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase() === slug;
}

function fail(lines) {
  console.error(`\nlinks.json has a problem, so this version was NOT deployed. Your live links did not change.\n`);
  for (const line of lines) console.error(`  ${line}`);
  console.error(`\nFix it in links.json and commit again.\n`);
  process.exit(1);
}
