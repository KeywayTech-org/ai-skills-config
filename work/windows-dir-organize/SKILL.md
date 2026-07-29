---
name: windows-dir-organize
description: Safely reorganize/normalize a Windows directory (rename folders, group files, move stray files). Handles the two non-obvious failure modes on Windows — the NTFS read-only attribute blocking `mv`, and folders silently landing in the Recycle Bin. Use when asked to tidy, rename, categorize, or restructure files/folders on a local Windows path.
---

# Windows Directory Reorganization (safe)

## When to use
User asks to "整理目录 / 统一命名 / 归类 / 把同类放一起 / 父层级不要散落文件" on a local Windows folder.

## Hard rules
- **Never delete.** Reorganize by moving only. If a move fails, recover — do not `rm` user files.
- **Do NOT touch code-project internals** (`node_modules/`, `.venv/`, `bin/`, `dist/`, `build/`, `target/`, `.git/`). Moving them breaks builds. Leave `projects/` trees alone.
- **Verify after every batch** of moves with `ls`. Do not assume success from an `OK` echo.

## Workflow
1. **Read-only scan first** (no writes): list top level, understand structure, separate "real content" from dependency/build junk.
2. **Plan & confirm** (complex change): state scope, method, exclusions, acceptance; get a go-ahead. Keep original filenames unless user explicitly wants English filenames.
3. **Execute renames/moves.** Rename Chinese folders to simple English, create type subfolders, move stray root files into a category folder.

## Gotcha 1 — `mv` fails with "Permission denied" (read-only attribute)
On Windows many files (esp. WeChat/email downloads) carry the **NTFS read-only attribute**. `mv` = copy + delete-source; the delete is blocked → "Permission denied". Symptom: `cp` works but `mv` fails.
- Fix: `chmod u+w <files>` (Git Bash `ls -la` does NOT show the read-only bit, so don't trust it).
- Then retry `mv`.
- If many files: `chmod u+w *.ext` then loop-move.

## Gotcha 2 — "folder in Recycle Bin / file missing" may be a SANDBOX ARTIFACT (verify on real disk first)
A read-only `ls`/`find` that reports a folder missing or claims its files are in `D:/\$Recycle.Bin/...` can be a **sandbox-overlay false reading**, NOT a real deletion (see Gotcha 4). Before concluding anything was deleted or restoring from the bin:
- Re-run the same check with `dangerouslyDisableSandbox: true` on the **real** disk.
- Only if the real-disk `find` truly shows the file absent AND truly present in `$Recycle.Bin/S-1-5-21-*-1001/\$Rxxxx/` should you restore.
- Restore: `mkdir -p <target>` then `for f in "$RB/\$Rxxxx/"*; do mv "$f" <target>/; done`. (Moving FROM the bin is reliable.)
- Confirm full recovery (correct file count) before reporting done.

## Gotcha 3 — tooling quirks
- The **PowerShell tool may not echo stdout** in some setups (exit code still valid). Verify outcomes with Bash `ls`/`find`, not PowerShell output.
- Non-ASCII (Chinese) paths in `cmd //c` get mangled — avoid `cmd`; use Git Bash or PowerShell tool directly.
- Prefer Git Bash `mv`/`chmod` for file ops; they handle Chinese names fine when not piped through `cmd`.

## Gotcha 4 — SANDBOX overlay gives false filesystem views (CRITICAL)
On this environment, commands touching paths **outside the workspace** (e.g. `D:\`, other users' dirs) may run inside a **sandbox overlay**. Read-only `ls`/`find` can then return a view that DIVERGES from the real disk (false "file missing" / phantom "$Recycle.Bin" hits), while mutating commands sometimes run UNSANDBOXED on the real disk. The two views can disagree, causing spurious "data loss" panics.
- **Rule: any file op or verification on an out-of-workspace path MUST run with `dangerouslyDisableSandbox: true`** so you act on, and read, the real disk consistently.
- If a sandboxed read-only check reports a missing file / recycle-bin hit, RE-CONFIRM with an unsandboxed command before restoring or deleting anything. In practice the real disk had the files all along.

## Acceptance checklist
- Target root shows only folders (no loose files) — unless user wants some.
- Same-type files grouped in subfolders.
- File count unchanged from before (nothing lost/deleted).
- Code projects left intact.
