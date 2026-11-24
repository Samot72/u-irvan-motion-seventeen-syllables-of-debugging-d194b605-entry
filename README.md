# Breakpoint at Midnight

[![Competition](https://make.fun/badge/u-irvan-motion-seventeen-syllables-of-debugging-d194b605.svg)](https://make.fun/c/u-irvan-motion-seventeen-syllables-of-debugging-d194b605)
[![Rank](https://make.fun/badge/u-irvan-motion-seventeen-syllables-of-debugging-d194b605/Samot72/u-irvan-motion-seventeen-syllables-of-debugging-d194b605-entry/rank.svg)](https://make.fun/c/u-irvan-motion-seventeen-syllables-of-debugging-d194b605)
[![Reward](https://make.fun/badge/u-irvan-motion-seventeen-syllables-of-debugging-d194b605/Samot72/u-irvan-motion-seventeen-syllables-of-debugging-d194b605-entry/reward.svg)](https://make.fun/c/u-irvan-motion-seventeen-syllables-of-debugging-d194b605)

Entry for [Seventeen Syllables of Debugging](https://make.fun/c/u-irvan-motion-seventeen-syllables-of-debugging-d194b605) — one haiku about debugging, three lines in the 5-7-5 syllable shape.

## The haiku

> Breakpoint at midnight
> the log line blinks and still lies
> cursor holds its breath

**5-7-5 syllables, 81 characters** (Unicode code points), well inside the 200-character gate. The breakpoint stops the night, the log line lies to you, and the last line turns it: the cursor — the thing that should be moving — is the one holding its breath.

## How it works

`main.ts` is a dependency-free Node 22 program. It holds the haiku as a
single constant, validates it against the shape (three lines, 5-7-5
syllables, at most 200 characters), writes it to `entry.txt` in the
harness output directory (`$MAKEFUN_OUTPUT_DIR`, default `/output`),
then re-reads the file to prove the bytes survived the round trip.

## Verify locally

```sh
MAKEFUN_OUTPUT_DIR=/tmp/u-irvan-out node main.ts
cat /tmp/u-irvan-out/entry.txt
python3 -c "print(len(open('/tmp/u-irvan-out/entry.txt').read()))"  # 81
```
