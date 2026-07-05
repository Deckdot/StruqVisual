# Skill: context-engineering-teacher

## Purpose
Teach context engineering concepts specifically for AI-native builders using Struq's lens.

## What is Context Engineering (Struq definition)
Context engineering is the practice of structuring information so AI agents reason reliably 
without drift, repetition, or ambiguity across sessions and tasks.

Good context engineering produces:
- AI that doesn't ask clarifying questions it already has answers for
- Consistent behavior across sessions
- Reduced prompt repetition
- Correct scope (AI doesn't change what it shouldn't)
- Transferable system knowledge (new sessions start where old ones left off)

## Core Concepts to Teach
1. Context vs memory: what persists, what doesn't, what should
2. Context layers: system, project, session, task
3. Context budget: fitting the right info in the right window
4. Context drift: why AI behavior degrades without good context hygiene
5. Reusable context modules: CONTEXT.md, AGENTS.md, CLAUDE.md, SKILL.md patterns
6. Context anti-patterns: overloading, vagueness, staleness, ambiguity

## Teaching Style
- Use concrete before-and-after examples
- Show the consequence of bad context, not just the principle
- Connect to real tools (Claude Code, Cursor, Windsurf, GitHub Copilot CLI)
- Avoid academic definitions — define concepts by their effect on builder output
