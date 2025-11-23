# Quiz Game — Project Guide(Small Build#1)
<img width="3750" height="4688" alt="1" src="https://github.com/user-attachments/assets/0be7a004-eb9f-4377-995f-bcbce6e42def" />

This README describes the quiz project, how to run it, and where to make common changes. It includes short code snippets and tips for quick customization.


## Run it locally (two ways)

- Quick: open `index.html` in your browser.
- Recommended for testing `questions.json`: run a tiny local server from the project root:

```powershell
python -m http.server 8000
# open http://localhost:8000/
```

That's it — no install, no build system.



## Files you care about

- `index.html` — structure and placeholders (start, quiz, result screens).
- `style.css` — visual styles, colors, spacing and feedback states.
- `script.js` — the app logic: loading questions, shuffling, timers, input and results.
- `questions.json` (optional) — drop this file in to replace the built-in questions.

Edit `script.js` for behavior, `style.css` for look-and-feel.

---

## The game flow :-

1. Load questions (tries `questions.json`, otherwise uses built-in array).
2. Shuffle questions and their answers; pick the first N questions for the quiz.
3. Show a question, render answer buttons, and start the per-question timer.
4. Player picks an answer (click or press 1–4). If time runs out, the question is marked unanswered.
5. Show feedback (correct/incorrect), record the answer, then move to next question or results.
6. Show final score and save high score in `localStorage`.


## Short code recipes

These are small helpers that match the app's patterns. Use them to tweak behavior quickly.

- Shuffle & sample:

```javascript
const shuffled = bank
  .map(q => ({ ...q }))
  .sort(() => Math.random() - 0.5)
  .map(q => ({ ...q, answers: q.answers.slice().sort(() => Math.random() - 0.5) }));
const quiz = shuffled.slice(0, QUESTIONS_PER_QUIZ);
```

- Render answers for a question:

```javascript
answersContainer.innerHTML = '';
current.answers.forEach((opt, i) => {
  const btn = document.createElement('button');
  btn.className = 'answer-btn';
  btn.textContent = `${i+1}. ${opt.text}`;
  btn.dataset.correct = opt.correct;
  btn.addEventListener('click', onAnswer);
  answersContainer.appendChild(btn);
});
```

- Timer (always clear old interval first):

```javascript
clearInterval(timerId);
timeLeft = TIME_PER_QUESTION;
timerId = setInterval(() => {
  timeLeft--;
  timerDisplay.textContent = timeLeft;
  if (timeLeft <= 0) { clearInterval(timerId); onTimeout(); }
}, 1000);
```

- Answer handler (visual feedback + scoring):

```javascript
function onAnswer(e) {
  if (answersDisabled) return;
  answersDisabled = true;
  clearInterval(timerId);
  const chosen = e.target;
  const correct = chosen.dataset.correct === 'true';
  Array.from(answersContainer.children).forEach(b => b.classList.toggle('correct', b.dataset.correct === 'true'));
  chosen.classList.toggle('incorrect', !correct);
  if (correct) score++;
  setTimeout(nextOrFinish, 800);
}
```

---

## Quick edits you’ll want

- QUESTIONS_PER_QUIZ — change how many questions a session uses.
- TIME_PER_QUESTION — change seconds per question.
- Add `explanation` to question objects to show a short explanation after answers.
- Drop in a `questions.json` to replace the built-in bank.

Look for those constants near the top of `script.js`.

## Small styling wins

- Bigger touch targets: increase padding + font-size on `.answer-btn`.
- Smooth feedback: add `transition: background-color 0.18s, color 0.18s;` to `.answer-btn`.
- Animate progress: `transition: width 350ms cubic-bezier(.2,.9,.2,1);` on `.progress`.

These take 5–10 minutes and make the UI feel better.


## Troubleshooting

- Questions not loading? Use the local server above.
- Timers acting weird? Confirm every question run calls `clearInterval(timerId)` before creating a new interval.
- Answers become wrong after shuffle? Keep the `correct` boolean attached to each answer object and shuffle the objects themselves.

*Contributions welcome — feel free to open issues or create PRs to add features or fixes.*


---<img width="3750" height="4688" alt="4" src="https://github.com/user-attachments/assets/6ddc47dc-bae2-47b2-93cc-1647c65b7c36" />
 