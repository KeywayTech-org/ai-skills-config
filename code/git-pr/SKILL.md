---
name: git-pr
description: "Use when the user says '提交pr', asks to submit a PR, or asks Codex to finish a git change through GitHub: inspect all local changes, group them into commits, push the current branch, create a PR to main, wait for CI, rebase-merge the PR, sync local main, and clean only the PR branch."
---

# Git PR

## Workflow

1. Inspect state first.
   - Run `git status --short --branch`, `git remote -v`, and inspect recent history.
   - Identify the current branch, upstream branch, default remote, and every local modification.
   - Inspect all modified, deleted, renamed, and untracked files before staging.
   - Stop and ask the user if any change appears incorrect, destructive, secret-bearing, generated accidentally, or impossible to classify.

2. Commit all valid local changes.
   - Group all valid local changes by functional task, even if Codex did not create them.
   - Create one separate commit per functional task.
   - Derive each Conventional Commit message from the actual content of that group.
   - Stage only the files for the current group before each commit.
   - Let hooks run by default.
   - Use `--no-verify` only when a hook would incorrectly stage or mutate unrelated files; then run the equivalent verification manually.

3. Verify before PR.
   - Prefer the repository full gate when one exists.
   - If no full gate exists, run the meaningful tests, typecheck, lint, and build checks for the committed changes.
   - Fix verification failures before continuing.

4. Push and create PR.
   - Push the current branch to the GitHub remote.
   - Create a PR targeting `main` unless the user explicitly names another base.
   - Use a concise title, summary, and verification plan based on the commits.
   - Never push directly to remote `main` unless the user explicitly asks for direct push.

5. Wait for CI and mergeability.
   - Poll the PR until all required remote checks complete.
   - Continue only when all required checks pass and the PR is mergeable.
   - Fix failures or conflicts when possible; stop and report only when user input is required.
   - Avoid force-push unless the user explicitly authorizes it.

6. Merge PR.
   - Use rebase merge by default.
   - Delete the remote PR branch during merge when GitHub allows it.

7. Update local repository after merge.
   - Switch to local `main`.
   - Fetch and fast-forward pull from `origin/main`.
   - Delete only the local branch used for this PR.
   - Do not delete the branch if the PR was submitted from local `main`.
   - Do not delete unrelated local branches.
   - Prune stale remote-tracking branches with `git fetch --prune`.
   - Confirm the working tree is clean and local `main` matches `origin/main`.

## Guardrails

- Never force-push without explicit authorization.
- Never delete a branch that contains unmerged work unless the user explicitly confirms.
- Never commit secrets, `.env` files, or credentials.
- Never bypass branch protection.
- Never merge while required checks are failing, pending, missing, or blocked.
- Never delete unrelated local branches.
- Treat `提交pr` and equivalent user requests as permission to run this full workflow automatically.
