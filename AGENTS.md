# AGENTS.md

## Scope
- Work only inside this admin project.
- Treat this folder as a standalone repository and application.
- Do not modify landing-page files outside the admin project unless the user explicitly asks for cross-project changes.

## Project Context
- This is the Fanzilla admin panel.
- Stack: Vue 3, Vite, Vue Router, Naive UI.
- Main working directory: `/Users/viktorbrezhnev/Claude Code/Fanzilla Landing/admin`
- Git remote: `https://github.com/23brezhnev/fanzilla-admin.git`

## Default Workflow
- Make changes only in the admin project files.
- After changes, run the smallest relevant verification step if possible.
- When the user asks to sync changes, use normal git flow in this repo: `git add`, `git commit`, `git push`.

## Response Defaults
- Assume requests in this project refer to the admin panel unless the user says otherwise.
- Keep changes scoped and avoid touching unrelated files.
- If a request is ambiguous, prefer the admin implementation path first.

## Prompt Shortcut
Use this as the default interpretation for new tasks in this project:

`Work only on the Fanzilla admin app in /Users/viktorbrezhnev/Claude Code/Fanzilla Landing/admin. Treat it as a standalone project and keep all changes scoped to this repo unless told otherwise.`
