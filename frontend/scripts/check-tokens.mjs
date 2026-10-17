// Fails if a token from app/styles/_tokens.scss is not exposed to Tailwind.
// Compiles xp-theme.scss (the :root generator) and checks that every
// --xp-* var it emits is referenced in app/tailwind.css's @theme block.
import { readFileSync } from "node:fs";
import * as sass from "sass";

const css = sass.compile("app/styles/xp-theme.scss", {
  loadPaths: ["app/styles"],
}).css;
const tailwind = readFileSync("app/tailwind.css", "utf8");

const vars = [...css.matchAll(/(--xp-[a-z0-9-]+)\s*:/g)].map((m) => m[1]);
const missing = vars.filter((v) => !tailwind.includes(`var(${v})`));

if (missing.length) {
  console.error("Tokens missing from app/tailwind.css @theme:\n  " + missing.join("\n  "));
  process.exit(1);
}
console.log(`OK: all ${vars.length} tokens are mapped into Tailwind.`);
