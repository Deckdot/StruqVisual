# Workflow Breakdown Template

## Step format
```
Step N: [Imperative title]
Description: What you do and how you know it's done.
Tool/Technique: [Specific tool or technique]
Pitfall: [Most common mistake and its consequence]
```

## Example
```
Step 1: Map your project context to a CONTEXT.md file
Description: Write a single-file context document that tells the AI your project's purpose, 
tech stack, current state, and what not to touch. Done when an AI can read this file alone 
and make sensible changes without asking clarifying questions.
Tool/Technique: Markdown, placed at repo root
Pitfall: Writing goals instead of facts. "We want to make a great app" tells the AI nothing. 
"Next.js 15, Drizzle + Postgres, deployed on Railway, currently on auth step" is useful.
```

## Common mistakes format
Each common mistake should be:
"Builders often [mistake]. This causes [consequence]. Instead, [fix]."

## Best practices format
Each best practice should be observable:
"After each session, [specific action]. This ensures [specific outcome]."
