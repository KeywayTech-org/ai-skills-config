# TODO Planning Rules

## Purpose

`TODO.md` is an execution contract for future AI agents and humans. It must contain enough task-local context for an agent to perform one task correctly without relying on hidden chat history.

## Required Document Shape

Use this top-level structure:

```markdown
# TODO

## Planning Rules

Short rules plus links to this reference when available.

## Evidence Snapshot

Observed project facts and source references used to build the plan.

## Milestones

Ordered groups of work. Keep milestones outcome-based, not time-based.

## Atomic Tasks

Task list using the schema below.

## Done

Append completed task IDs, commit hashes, and verification evidence.
```

## Atomic Task Schema

Each task must include:

```markdown
### T-001: Imperative task title

- Status: todo
- Goal: One concrete outcome.
- Context: Facts and file references needed to execute this task.
- Scope: Files, modules, routes, APIs, or docs that may be touched.
- Out of scope: Explicit non-goals and forbidden changes.
- Steps:
  1. Read specific files or commands.
  2. Make the smallest coherent change.
  3. Update task-relevant docs if needed.
- Verify: Exact commands or observable UI checks, with expected result.
- Acceptance: Conditions that prove the task is complete.
- Rollback: How to revert only this task safely.
- Commit: Conventional Commit type and suggested subject.
```

## Atomicity Rules

- One task equals one coherent change with one main owner.
- A task must be independently executable and independently verifiable.
- Split tasks when they touch unrelated modules, require different expertise, or need different verification.
- Do not combine implementation and broad refactor unless the refactor is required for that implementation.
- Do not include vague tasks such as "clean up code", "improve UX", or "optimize performance" without measurable scope and acceptance.
- Prefer 30 to 120 minute implementation units for coding tasks.

## Context Rules

Every task must include enough local context:

- Current behavior and target behavior.
- Relevant source files and line references when known.
- Contracts or invariants that must hold.
- Existing tests and gaps.
- Risks and compatibility boundaries.
- Whether legacy paths should remain, shrink, or be removed.

Do not rely on phrases like "as discussed above" or "from the review". Inline the specific finding and file references.

## Verification Rules

Every task must have verification:

- Code tasks require tests, build, lint, or typecheck unless impossible.
- UI tasks require browser checks for desktop and mobile when visual behavior matters.
- API or contract tasks require contract drift checks where relevant.
- Architecture tasks require boundary checks or targeted static searches.
- If no automated verification exists, state the observable manual check.

## Sequencing Rules

- Put blocking infrastructure fixes first.
- Put architecture boundary restoration before feature work that depends on that boundary.
- Put test harness improvements before tasks that require those tests as evidence.
- Put documentation sync after code behavior changes unless docs define the contract.
- Avoid parallel tasks that write the same files.

## Replacement Rule

When the user triggers planning with "规划TODO" or a similar command:

1. Treat the old `TODO.md` content as obsolete.
2. Read it only as historical evidence, not as a source to preserve.
3. Replace it with the new plan after confirmation if overwrite approval is not already explicit.
4. Do not keep stale completed checkboxes unless they are relevant evidence in `Evidence Snapshot`.

## Quality Bar

The final `TODO.md` should let a fresh agent pick any `todo` task and know:

- What to do.
- Why it matters.
- What not to touch.
- Which files to inspect.
- How to verify success.
- How to roll back.
