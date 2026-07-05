# Skill: interactive-html-generator

## Purpose
Generate self-contained, sandboxed HTML/CSS/JS interactive learning exercises for Struq Learn.

## Output Requirements
- The entire exercise must be a single HTML document string
- All CSS must be inline or in a <style> tag
- All JavaScript must be in a <script> tag
- No external dependencies, CDN links, or fetch calls
- Must work inside `sandbox="allow-scripts"` iframe
- No parent.postMessage or window.parent access
- Total size must be under 20KB

## Supported Exercise Types
- **matching**: two-column matching exercise
- **drag-drop**: drag items into categories
- **sequencing**: arrange steps in correct order
- **flashcards**: reveal/flip cards
- **sorting**: sort items by a criteria
- **spot-the-bug**: find the problem in a code snippet
- **fill-in-blank**: complete sentences with correct terms

## Quality Rules
- Include visual feedback (colors, checkmarks) for correct/incorrect
- Include a "Check" or "Reset" button
- Use a clean, minimal dark-or-light style that reads well
- Make it genuinely educational — not just a game
- The exercise should directly reinforce the lesson's learning objectives
