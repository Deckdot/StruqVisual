# Interactive HTML Template

## Minimal exercise scaffold
```html
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exercise</title>
  <style>
    /* Keep styles minimal and readable */
    body { font-family: system-ui, sans-serif; padding: 1rem; background: #0f0f10; color: #e2e2e6; }
    button { cursor: pointer; padding: 0.5rem 1rem; border-radius: 8px; border: none; }
    .correct { color: #4ade80; }
    .incorrect { color: #f87171; }
    .card { border: 1px solid #2a2a2e; border-radius: 12px; padding: 1rem; background: #18181b; }
  </style>
</head>
<body>
  <!-- Exercise content here -->
  <script>
    // Exercise logic here
  </script>
</body>
</html>
```

## Checklist before outputting
- [ ] No external dependencies
- [ ] Works in `sandbox="allow-scripts"` iframe
- [ ] Has visual feedback for correct/incorrect answers
- [ ] Has a reset button
- [ ] Under 20KB
- [ ] Teaches the specific concept of the lesson
