import { readFileSync, readdirSync, statSync } from 'fs';
import path from 'path';

type Violation = {
  file: string;
  line: number;
  rule: string;
  snippet: string;
};

const ROOT = process.cwd();
const SCAN_DIRS = ['app', 'components'];
const FILE_EXTENSIONS = new Set(['.tsx', '.ts']);

const SKIP_PATH_PARTS = [
  `${path.sep}marketing${path.sep}_archive${path.sep}`,
  `${path.sep}marketing${path.sep}hero${path.sep}`,
  `${path.sep}ui${path.sep}animated-shiny-button.tsx`,
  `${path.sep}auth${path.sep}auth-icons.tsx`,
  `${path.sep}FloatingNodes.tsx`,
  `${path.sep}particle-background.tsx`,
  `${path.sep}static-component-preview.tsx`,
  `${path.sep}code-preview.tsx`,
  `${path.sep}shiki-code-block.tsx`,
  // Marketing before/after mockups: deliberately render the un-themed "grey AI
  // default" (raw hex grays + default blue) as page content, not UI chrome.
  `${path.sep}site${path.sep}home${path.sep}problem.tsx`,
  `${path.sep}site${path.sep}methode${path.sep}methode-client.tsx`,
];

const CLASSNAME_HEX = /(className\s*=\s*["'`][^"'`]*#[0-9A-Fa-f]{3,8}[^"'`]*["'`])/;
const CLASSNAME_GRAY = /(className\s*=\s*["'`][^"'`]*(?:text|bg|border)-gray-\d+[^"'`]*["'`])/;

/**
 * Builds a regex that catches the given token pattern inside any of:
 *   className="..."  className='...'  className=`...`
 *   className={... "..." ...}  (ternaries, template literals)
 *   cn(... "..." ...)          (utility-class helper calls)
 */
function buildClassnameRegex(tokenPattern: string): RegExp {
  return new RegExp(
    // Static className string
    `className\\s*=\\s*["'\`][^"'\`]*${tokenPattern}` +
    `|` +
    // className={...} with an inline string literal (ternaries, cn(), etc.)
    `className\\s*=\\s*\\{[^{}\\n]*["'\`][^"'\`]*${tokenPattern}` +
    `|` +
    // Bare cn() call on the same line
    `\\bcn\\s*\\([^)\\n]*["'\`][^"'\`]*${tokenPattern}`
  );
}

const CLASSNAME_HEAVY_FONT = buildClassnameRegex('font-(?:extrabold|black)');
const CLASSNAME_COLORED_SHADOW = buildClassnameRegex('shadow-(?:blue|indigo|violet|purple|emerald|sky|teal|cyan|accent)[/-]');
const CLASSNAME_HARDCODED_BLUE = buildClassnameRegex('(?:text|bg|border|ring)-(?:blue|indigo)-\\d+');
const CLASSNAME_SIDE_STRIPE = buildClassnameRegex('border-(?:l|r)-(?:2|4|8)(?!\\s)');
const CLASSNAME_BG_CLIP_TEXT = buildClassnameRegex('bg-clip-text');
const EM_DASH = />[^<]*—[^<]*</;

function walk(dir: string): string[] {
  const full = path.join(ROOT, dir);
  const entries = readdirSync(full, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const next = path.join(full, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(path.join(dir, entry.name)));
      continue;
    }

    if (!entry.isFile()) continue;
    if (!FILE_EXTENSIONS.has(path.extname(entry.name))) continue;
    files.push(path.join(dir, entry.name));
  }

  return files;
}

function isSkipped(file: string) {
  const normalized = `${path.sep}${file.split(path.sep).join(path.sep)}`;
  if (file === 'app/globals.css') return true;
  return SKIP_PATH_PARTS.some((part) => normalized.includes(part));
}

function addViolations(file: string, regex: RegExp, rule: string, lines: string[], out: Violation[]) {
  lines.forEach((line, index) => {
    if (line.includes('design-gate: ignore')) return;
    if (regex.test(line)) {
      out.push({
        file,
        line: index + 1,
        rule,
        snippet: line.trim(),
      });
    }
  });
}

const files = SCAN_DIRS.flatMap(walk).filter((file) => !isSkipped(file));
const violations: Violation[] = [];

for (const file of files) {
  const full = path.join(ROOT, file);
  if (!statSync(full).isFile()) continue;
  const source = readFileSync(full, 'utf8');
  const lines = source.split('\n');

  addViolations(file, CLASSNAME_GRAY, 'Use semantic tokens instead of gray utility classes.', lines, violations);
  addViolations(file, CLASSNAME_HEX, 'Avoid raw hex colors inside className strings.', lines, violations);
  addViolations(file, CLASSNAME_HEAVY_FONT, 'Avoid font-extrabold/font-black; use font-semibold for headings, font-medium for labels/buttons.', lines, violations);
  addViolations(file, CLASSNAME_COLORED_SHADOW, 'Avoid colored utility shadows; use neutral shadows or hover:brightness-110 instead.', lines, violations);
  addViolations(file, CLASSNAME_HARDCODED_BLUE, 'Use bg-accent/text-accent instead of hardcoded blue/indigo scale classes.', lines, violations);
  addViolations(file, CLASSNAME_SIDE_STRIPE, 'Impeccable: No side-stripe borders (border-l/r > 1px) used as accents.', lines, violations);
  addViolations(file, CLASSNAME_BG_CLIP_TEXT, 'Impeccable: No decorational gradient text (bg-clip-text). Use solid colors.', lines, violations);
  addViolations(file, EM_DASH, 'Impeccable: No em dashes (—) allowed in copy.', lines, violations);
}

if (violations.length > 0) {
  console.error('verify:design found violations:\n');
  for (const violation of violations) {
    console.error(`${violation.file}:${violation.line}  ${violation.rule}`);
    console.error(`  ${violation.snippet}`);
  }
  process.exit(1);
}

console.log(`verify:design passed (${files.length} files scanned).`);
