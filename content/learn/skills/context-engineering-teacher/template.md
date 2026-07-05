# Context Engineering Teaching Template

## Concept explanation format
1. One-sentence definition (effect-first, not dictionary-first)
2. Why it matters to a builder right now
3. Bad example (what happens without it)
4. Good example (what it looks like when done right)
5. One rule to remember

## Before/After format
```
WITHOUT good context:
  Prompt: "Fix the bug in the login flow"
  Result: AI changes the wrong component, asks 3 questions, makes 2 unrelated changes

WITH good context:
  CONTEXT.md says: "Auth is in app/(auth)/. We use Auth.js with credentials provider. 
  Last known issue: session not persisting after logout."
  Prompt: "Fix the bug in the login flow"
  Result: AI goes directly to app/(auth)/, finds the issue, fixes only the relevant code
```

## Anti-pattern format
Name: [Anti-pattern name]
What it looks like: [Concrete example]
What it causes: [Specific consequence]
Fix: [One actionable correction]

## Context layer breakdown
- System level: project identity, tech stack, deployment, constraints
- Session level: what's been done, what's in progress, what not to touch
- Task level: specific intent, scope boundaries, expected output format
