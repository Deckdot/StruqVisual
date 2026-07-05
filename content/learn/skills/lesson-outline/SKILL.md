# Skill: lesson-outline

## Purpose
Generate a structured, opinionated lesson outline for Struq Learn.

## Domain Focus
This skill specializes in AI-native builder education:
- vibecoding workflows
- prompt engineering and prompt library design
- context engineering for AI apps
- agentic building patterns
- avoiding spaghetti AI workflows
- architecture basics for AI-native builders

## Output Format
A `LessonOutline` JSON object with:
- title, subtitle, summary
- 3–8 learning objectives
- 4–10 sections with intent, suggestedType, and estimatedMinutes
- accurate totalMinutes
- 4–8 tags from the domain

## Quality Rules
- Every section must have a clear, specific intent — not a vague topic label
- Scene types should vary: don't make every section an explanation
- Include at least one interactive or quiz section per lesson
- Objectives should be measurable and practical
- Tags should be specific: "context-engineering" not "AI"
- Lessons for beginners should build concepts from first principles
- Advanced lessons should focus on tradeoffs, edge cases, and architecture decisions
