# Lesson Outline Template

## Inputs
- topic: {topic}
- level: {skillLevel}
- length: {lessonLength} (target: {targetMinutes} min)
- modes: {learningModes}

## Output
Return a JSON LessonOutline with sections mapped to the lesson flow:

1. Start with a `lesson_intro` scene (hook + what you'll learn)
2. Use `explanation` for core concept definition
3. Use `rules_patterns` for concrete rules and anti-patterns
4. Use `workflow_breakdown` or `architecture_review` for applied depth
5. Use `quiz` to validate understanding
6. Use `interactive_html` for hands-on practice (when mode = practical or visual)
7. End with `reflection` for takeaway and next action

## Section Intent Format
Each section intent should answer:
"After this section, the learner will be able to [verb] [specific outcome]"
Example: "Understand the difference between context and memory in AI systems"
Example: "Apply a 3-layer prompt architecture to a real project"
