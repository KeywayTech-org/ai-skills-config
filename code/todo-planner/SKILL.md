---
name: todo-planner
description: Generate or rewrite executable development TODO plans. Use when the user says "规划TODO", "重写TODO", "生成开发计划", "拆任务计划", "plan TODO", or asks Codex to turn review findings, product requests, bug lists, or architecture work into a clean TODO.md made of atomic, independently executable tasks.
---

# Todo Planner

Create a fresh, execution-ready `TODO.md` from the user's current goal and available evidence.

## Workflow

1. Read `references/todo-rules.md`.
2. Gather evidence before planning:
   - Read current `TODO.md`, `README.md`, architecture docs, PRD/spec docs, and directly related code.
   - Use recent conversation findings only when they are visible in the current context or can be re-verified.
   - Browse only for unfamiliar or potentially stale external frameworks.
3. Treat the target `TODO.md` as a new document:
   - Do not preserve old tasks, old phase numbering, or stale status.
   - Do not edit yet if the user asked only for a plan of the skill or plan shape.
   - Before overwriting `TODO.md`, state that the old content will be replaced and get confirmation unless the user already explicitly approved the overwrite in the current turn.
4. Build the plan from top-level outcomes to atomic tasks:
   - Group work into milestones only when sequencing helps execution.
   - Make each atomic task small enough for one focused implementation pass and one verification pass.
   - Include all task-local context needed by a future AI agent to execute the task without reading the entire conversation.
5. Write `TODO.md` with:
   - Global rules and links to detailed rules.
   - Evidence snapshot.
   - Milestones.
   - Atomic tasks with context, scope, non-goals, steps, verification, acceptance criteria, rollback, and commit guidance.
6. Validate the TODO:
   - Every task has executable verification or observable UI evidence.
   - Every task has explicit file/module scope.
   - No task depends on hidden conversation context.
   - No task mixes unrelated domains.

## Output Requirements

- Keep final user responses concise and result-first.
- When creating or replacing a real `TODO.md`, mention the path and validation performed.
- Do not include full diffs or the whole TODO in chat unless the user asks.

## Reference

Detailed task schema and planning rules live in [references/todo-rules.md](references/todo-rules.md).
