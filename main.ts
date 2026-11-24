// "Breakpoint at Midnight" — entry for
// u-irvan-motion-seventeen-syllables-of-debugging-d194b605.
//
// A tiny, dependency-free Node 22 program. It holds one haiku about
// debugging, checks it against the competition shape (three lines in
// 5-7-5 syllables, at most 200 characters total), then writes it to
// entry.txt inside the harness output directory and re-reads the file
// to prove the bytes survived the round trip.

import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { tmpdir } from "node:os";

// The haiku, exactly as it will be judged:
//   Breakpoint at midnight          (5)
//   the log line blinks and still lies  (7)
//   cursor holds its breath         (5)
const HAIKU = [
  "Breakpoint at midnight",
  "the log line blinks and still lies",
  "cursor holds its breath",
].join("\n");

const GATE_MAX = 200;
const SHAPE = [5, 7, 5];

// Syllable counts for the words this haiku uses. A generic vowel-group
// heuristic backs it up, so the check stays honest if a word changes.
const SYLLABLES: Record<string, number> = {
  breakpoint: 2,
  at: 1,
  midnight: 2,
  the: 1,
  log: 1,
  line: 1,
  blinks: 1,
  and: 1,
  still: 1,
  lies: 1,
  cursor: 2,
  holds: 1,
  its: 1,
  breath: 1,
};

function countSyllables(word: string): number {
  const lower = word.toLowerCase().replace(/[^a-z]/g, "");
  if (SYLLABLES[lower] !== undefined) return SYLLABLES[lower];
  const groups = lower.replace(/e$/, "").match(/[aeiouy]+/g);
  return Math.max(1, groups === null ? 1 : groups.length);
}

/** Enforce the shape: three lines, 5-7-5 syllables, at most 200 chars. */
function assertValid(haiku: string): number {
  const chars = Array.from(haiku).length;
  if (chars < 1 || chars > GATE_MAX) {
    throw new Error(`haiku must be 1-${GATE_MAX} characters, got ${chars}`);
  }
  if (haiku.trim() === "") {
    throw new Error("haiku must not be blank");
  }
  const lines = haiku.split("\n");
  if (lines.length !== 3) {
    throw new Error(`haiku must be exactly 3 lines, got ${lines.length}`);
  }
  lines.forEach((line, i) => {
    const count = line
      .split(/\s+/)
      .filter(Boolean)
      .reduce((sum, word) => sum + countSyllables(word), 0);
    if (count !== SHAPE[i]) {
      throw new Error(
        `line ${i + 1} must be ${SHAPE[i]} syllables, got ${count}: ${line}`,
      );
    }
  });
  return chars;
}

/** Reject trailing whitespace and control characters (except newline). */
function assertCleanText(haiku: string): void {
  for (const [i, line] of haiku.split("\n").entries()) {
    if (line !== line.trimEnd()) {
      throw new Error(`line ${i + 1} has trailing whitespace`);
    }
  }
  for (let i = 0; i < haiku.length; i++) {
    const code = haiku.charCodeAt(i);
    if ((code < 0x20 && haiku[i] !== "\n") || code === 0x7f) {
      throw new Error(`control character U+${code.toString(16)} at offset ${i}`);
    }
  }
}

/** Write the haiku twice to a scratch dir and prove the bytes match. */
function assertDeterministic(haiku: string): void {
  const scratch = mkdtempSync(resolve(tmpdir(), "haiku-check-"));
  try {
    const first = resolve(scratch, "first.txt");
    const second = resolve(scratch, "second.txt");
    writeFileSync(first, haiku, { encoding: "utf8" });
    writeFileSync(second, haiku, { encoding: "utf8" });
    if (readFileSync(first).compare(readFileSync(second)) !== 0) {
      throw new Error("determinism check failed: two writes differ");
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

function run(): void {
  const count = assertValid(HAIKU);
  assertCleanText(HAIKU);
  assertDeterministic(HAIKU);

  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const target = resolve(dir, "entry.txt");

  mkdirSync(dir, { recursive: true });
  writeFileSync(target, HAIKU, { encoding: "utf8" });

  const reread = readFileSync(target, "utf8");
  if (reread !== HAIKU) {
    throw new Error("verification failed: file content differs from the haiku");
  }

  console.log(`wrote ${target} (${count} characters)`);
  console.log(HAIKU);
}

run();
