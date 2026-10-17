// Keeps app/tailwind.css in sync with app/styles/_tokens.scss.
//
// Compiles xp-theme.scss (which emits one --xp-* var per token) and
// rewrites the generated color block of tailwind.css's @theme so every
// palette color gets a Tailwind name: --xp-blue -> bg-xp-blue etc.
// `--check` only verifies (exit 1 on drift) and also asserts that every
// non-color token (sizes, spacing, radii) is mapped by hand in @theme.
import { readFileSync, writeFileSync } from "node:fs";
import * as sass from "sass";

const check = process.argv.includes("--check");
const file = "app/tailwind.css";

const css = sass.compile("app/styles/xp-theme.scss", { loadPaths: ["app/styles"] }).css;
const vars = [...css.matchAll(/(--xp-[a-z0-9-]+)\s*:/g)].map((m) => m[1]);
const isOther = (v) => /^--xp-(font|space|radius)-|-shadow$/.test(v);
const colors = vars.filter((v) => !isOther(v));

const block =
  "  /* tokens:colors:start */\n" +
  colors.map((v) => `  --color-${v.slice(2)}: var(${v});`).join("\n") +
  "\n  /* tokens:colors:end */";

const current = readFileSync(file, "utf8");
const next = current.replace(/  \/\* tokens:colors:start \*\/[\s\S]*?\/\* tokens:colors:end \*\//, block);

const unmapped = vars.filter(isOther).filter((v) => !current.includes(`var(${v})`));
if (unmapped.length) {
  console.error(`Tokens not mapped in ${file} @theme:\n  ` + unmapped.join("\n  "));
  process.exit(1);
}

if (check) {
  if (next !== current) {
    console.error(`${file} is out of date with _tokens.scss: run \`npm run tokens:sync\`.`);
    process.exit(1);
  }
  console.log(`OK: all ${vars.length} tokens are mapped into Tailwind.`);
} else {
  writeFileSync(file, next);
  console.log(`Synced ${colors.length} colors into ${file}.`);
}
