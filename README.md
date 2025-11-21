
# Quiz Game

A lightweight multiple-choice quiz built with vanilla HTML, CSS and JavaScript. The quiz runs a 10-question session sampled from a question bank, supports a per-question timer, keyboard shortcuts, and saves the high score to localStorage.

Features

- 10 randomized questions per run (sampled from the question bank)
- Answers and questions are shuffled each run
- Per-question countdown timer and timeout handling
- Keyboard shortcuts: press 1–4 to select an answer
- Persistent high score stored in localStorage
- External `questions.json` supported — drop a JSON file in the project to change the question bank without editing code
- Review results screen showing selected vs correct answers

Files

- `index.html` — UI and structure
- `style.css` — styles (uses flexbox to center the quiz)
- `script.js` — main quiz logic (wrapped in an IIFE to avoid global scope leakage)
- `questions.json` — optional external question bank (sample file included)

How to run

1. Open `01-quiz-game/index.html` directly in a modern browser.
2. Or serve the project folder with a static server (recommended when using `fetch` to load `questions.json`):

	 - Python 3 (from project root):

		 ```
		 python -m http.server 8000
		 ```

	 - Then open: `http://localhost:8000/01-quiz-game/`

Usage notes

- If `questions.json` is present in the `01-quiz-game` folder the app will attempt to load it at startup. If the fetch fails or the file is missing, the built-in question bank from `script.js` is used as a fallback.
- The quiz samples 10 questions per run. If your question bank has fewer than 10 questions, the quiz will use all available questions.
- The high score is stored in the browser under the key `quiz_high_score`.

Customization

- To add or edit questions without editing code, open `01-quiz-game/questions.json` and edit the JSON array. Each question object should follow this shape:

```json
{
	"question": "Your question text",
	"options": ["A", "B", "C", "D"],
	"answer": 1
}
```

Where `answer` is the zero-based index of the correct option.

Accessibility & testing

- Keyboard users can press 1–4 to choose answers; focus states are present on buttons.
- To test layout issues, make sure no other global CSS overrides the page (open the page in an isolated tab or private window if unsure).

If anything still looks off (for example the quiz appears in the top-right), tell me which browser and viewport you used and I'll inspect `index.html` and the live DOM to diagnose and fix any remaining layout overrides.

