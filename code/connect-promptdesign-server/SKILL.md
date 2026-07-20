---
name: connect-promptdesign-server
description: Connect to the PromptDesign production server with its dedicated SSH key. Use when Codex needs to log in to, inspect, or run authorized commands on the PromptDesign server at 82.156.178.154, including Nginx, deployment, logs, and project diagnostics.
---

# PromptDesign Server Connection

Use the dedicated local SSH key only. Do not request, print, store, or embed a password.

## Connect

Run the bundled script for an interactive server session:

```powershell
& "$HOME\.codex\skills\connect-promptdesign-server\scripts\connect.ps1"
```

Pass a remote command as trailing arguments for a non-interactive operation:

```powershell
& "$HOME\.codex\skills\connect-promptdesign-server\scripts\connect.ps1" 'hostname'
```

The script uses `BatchMode=yes`; a missing or invalid key must fail rather than falling back to password authentication.

## Operational Rules

- Treat the server as production.
- Inspect configuration, service status, processes, and logs with read-only commands unless the user explicitly authorizes a change.
- Confirm before service restarts, deployments, package changes, database writes, file changes, or credential changes.
- Report the command outcome without exposing secrets from environment files, logs, or configuration.

