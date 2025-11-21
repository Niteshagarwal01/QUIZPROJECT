(() => {
  const startScreen = document.getElementById('start-screen');
  const quizScreen = document.getElementById('quiz-screen');
  const resultScreen = document.getElementById('result-screen');
  const startButton = document.getElementById('start-btn');
  const questionText = document.getElementById('question-text');
  const answersContainer = document.getElementById('answers-container');
  const currentQuestionSpan = document.getElementById('current-question');
  const totalQuestionsSpan = document.getElementById('total-questions');
  const scoreSpan = document.getElementById('score');
  const finalScoreSpan = document.getElementById('final-score');
  const maxScoreSpan = document.getElementById('max-score');
  const resultMessage = document.getElementById('result-message');
  const restartButton = document.getElementById('restart-btn');
  const progressBar = document.getElementById('progress');

  const DEFAULT_QUIZ_QUESTIONS = [
  { question: 'What is the capital of France?', answers: [{ text: 'London', correct: false }, { text: 'Berlin', correct: false }, { text: 'Paris', correct: true }, { text: 'Madrid', correct: false }] },
  { question: 'Which planet is known as the Red Planet?', answers: [{ text: 'Venus', correct: false }, { text: 'Mars', correct: true }, { text: 'Jupiter', correct: false }, { text: 'Saturn', correct: false }] },
  { question: 'What is the largest ocean on Earth?', answers: [{ text: 'Atlantic Ocean', correct: false }, { text: 'Indian Ocean', correct: false }, { text: 'Arctic Ocean', correct: false }, { text: 'Pacific Ocean', correct: true }] },
  { question: 'Which of these is NOT a programming language?', answers: [{ text: 'Java', correct: false }, { text: 'Python', correct: false }, { text: 'Banana', correct: true }, { text: 'JavaScript', correct: false }] },
  { question: 'What is the chemical symbol for gold?', answers: [{ text: 'Go', correct: false }, { text: 'Gd', correct: false }, { text: 'Au', correct: true }, { text: 'Ag', correct: false }] },
  { question: 'Which language runs in a web browser?', answers: [{ text: 'Python', correct: false }, { text: 'C', correct: false }, { text: 'JavaScript', correct: true }, { text: 'Ruby', correct: false }] },
  { question: 'What does CSS stand for?', answers: [{ text: 'Central Style Sheets', correct: false }, { text: 'Cascading Style Sheets', correct: true }, { text: 'Creative Style System', correct: false }, { text: 'Computer Style Sheets', correct: false }] },
  { question: 'Which HTML tag is used for the largest heading?', answers: [{ text: '<h1>', correct: true }, { text: '<h6>', correct: false }, { text: '<head>', correct: false }, { text: '<header>', correct: false }] },
  { question: 'Which gas do plants absorb from the atmosphere?', answers: [{ text: 'Oxygen', correct: false }, { text: 'Nitrogen', correct: false }, { text: 'Carbon Dioxide', correct: true }, { text: 'Hydrogen', correct: false }] },
  { question: "Who wrote 'Romeo and Juliet'?", answers: [{ text: 'Charles Dickens', correct: false }, { text: 'William Shakespeare', correct: true }, { text: 'Mark Twain', correct: false }, { text: 'Leo Tolstoy', correct: false }] },
  { question: 'What is 9 × 9?', answers: [{ text: '81', correct: true }, { text: '72', correct: false }, { text: '99', correct: false }, { text: '79', correct: false }] },
  { question: 'Which element has the chemical symbol O?', answers: [{ text: 'Gold', correct: false }, { text: 'Oxygen', correct: true }, { text: 'Silver', correct: false }, { text: 'Iron', correct: false }] },
  { question: 'What year did the first man land on the moon?', answers: [{ text: '1969', correct: true }, { text: '1972', correct: false }, { text: '1965', correct: false }, { text: '1975', correct: false }] },
  { question: 'Which country is home to the kangaroo?', answers: [{ text: 'Australia', correct: true }, { text: 'India', correct: false }, { text: 'South Africa', correct: false }, { text: 'Brazil', correct: false }] },
  { question: 'What is the boiling point of water at sea level (°C)?', answers: [{ text: '90', correct: false }, { text: '100', correct: true }, { text: '110', correct: false }, { text: '120', correct: false }] },
  { question: 'Which device converts AC to DC?', answers: [{ text: 'Transformer', correct: false }, { text: 'Rectifier', correct: true }, { text: 'Generator', correct: false }, { text: 'Capacitor', correct: false }] },
  { question: 'Which organ pumps blood through the body?', answers: [{ text: 'Lungs', correct: false }, { text: 'Brain', correct: false }, { text: 'Heart', correct: true }, { text: 'Kidneys', correct: false }] },
  { question: 'Which is the smallest prime number?', answers: [{ text: '0', correct: false }, { text: '1', correct: false }, { text: '2', correct: true }, { text: '3', correct: false }] },
  { question: 'Which sport uses a shuttlecock?', answers: [{ text: 'Tennis', correct: false }, { text: 'Badminton', correct: true }, { text: 'Squash', correct: false }, { text: 'Table Tennis', correct: false }] },
  { question: 'What is the process by which plants make food using sunlight?', answers: [{ text: 'Respiration', correct: false }, { text: 'Photosynthesis', correct: true }, { text: 'Digestion', correct: false }, { text: 'Transpiration', correct: false }] }
];
  let quizBank = DEFAULT_QUIZ_QUESTIONS;

  async function loadExternalQuestions() {
    try {
      const resp = await fetch('questions.json', { cache: 'no-store' });
      if (!resp.ok) return;
      const data = await resp.json();
      if (Array.isArray(data) && data.length >= 5) quizBank = data;
    } catch (err) {}
  }

  loadExternalQuestions();

  let currentQuestionIndex = 0;
  let score = 0;
  let answersDisabled = false;
  const TIME_PER_QUESTION = 15;
  let timeLeft = TIME_PER_QUESTION;
  let timerInterval = null;
  let shuffledQuestions = [];
  let sampledQuestions = [];
  let userAnswers = [];

  const highScoreKey = 'quiz_high_score';
  const QUESTIONS_PER_QUIZ = 10;
  totalQuestionsSpan.textContent = QUESTIONS_PER_QUIZ;
  maxScoreSpan.textContent = QUESTIONS_PER_QUIZ;
  document.getElementById('high-score').textContent = localStorage.getItem(highScoreKey) || 0;

  const reviewButton = document.getElementById('review-btn');
  const resultDetails = document.getElementById('result-details');
  if (reviewButton) {
    reviewButton.addEventListener('click', () => {
      if (resultDetails.innerHTML.trim() === '') renderResultDetails();
      resultDetails.scrollIntoView({ behavior: 'smooth' });
    });
  }

  startButton.addEventListener('click', startQuiz);
  restartButton.addEventListener('click', restartQuiz);

  function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    scoreSpan.textContent = 0;
    userAnswers = [];
    shuffledQuestions = quizBank.map((q) => ({ ...q })).sort(() => Math.random() - 0.5).map((q) => ({ ...q, answers: q.answers.slice().sort(() => Math.random() - 0.5) }));
    sampledQuestions = shuffledQuestions.slice(0, QUESTIONS_PER_QUIZ);
    startScreen.classList.remove('active');
    quizScreen.classList.add('active');
    document.addEventListener('keydown', handleKeydown);
    showQuestion();
  }

  function showQuestion() {
    answersDisabled = false;
    const currentQuestion = sampledQuestions[currentQuestionIndex];
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    const progressPercent = (currentQuestionIndex / QUESTIONS_PER_QUIZ) * 100;
    progressBar.style.width = `${progressPercent}%`;
    questionText.textContent = currentQuestion.question;
    answersContainer.innerHTML = '';
    for (let idx = 0; idx < currentQuestion.answers.length; idx++) {
      const answer = currentQuestion.answers[idx];
      const button = document.createElement('button');
      button.textContent = `${idx + 1}. ${answer.text}`;
      button.className = 'answer-btn';
      button.dataset.correct = answer.correct;
      button.addEventListener('click', selectAnswer);
      answersContainer.appendChild(button);
    }
    clearInterval(timerInterval);
    timeLeft = TIME_PER_QUESTION;
    const timerSpan = document.getElementById('timer');
    timerSpan.textContent = timeLeft;
    timerInterval = setInterval(() => {
      timeLeft -= 1;
      timerSpan.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        answersDisabled = true;
        const children = answersContainer.children;
        let correctText = '';
        for (let i = 0; i < children.length; i++) {
          const btn = children[i];
          if (btn.dataset.correct === 'true') {
            btn.classList.add('correct');
            correctText = btn.textContent.replace(/^[0-9].\s*/, '');
          }
        }
        userAnswers.push({ question: currentQuestion.question, selected: null, correct: correctText, isCorrect: false });
        setTimeout(() => {
          currentQuestionIndex += 1;
          if (currentQuestionIndex < sampledQuestions.length) showQuestion();
          else showResults();
        }, 1000);
      }
    }, 1000);
  }

  function selectAnswer(event) {
    if (answersDisabled) return;
    answersDisabled = true;
    clearInterval(timerInterval);
    const selectedButton = event.target;
    const isCorrect = selectedButton.dataset.correct === 'true';
    const children = answersContainer.children;
    let correctText = '';
    for (let i = 0; i < children.length; i++) {
      const btn = children[i];
      if (btn.dataset.correct === 'true') {
        btn.classList.add('correct');
        correctText = btn.textContent.replace(/^[0-9].\s*/, '');
      } else if (btn === selectedButton) {
        btn.classList.add('incorrect');
      }
    }
    const selectedText = selectedButton.textContent.replace(/^[0-9].\s*/, '');
    userAnswers.push({ question: sampledQuestions[currentQuestionIndex].question, selected: selectedText, correct: correctText, isCorrect });
    if (isCorrect) {
      score += 1;
      scoreSpan.textContent = score;
    }
    setTimeout(() => {
      currentQuestionIndex += 1;
      if (currentQuestionIndex < sampledQuestions.length) showQuestion();
      else showResults();
    }, 900);
  }

  function handleKeydown(e) {
    if (!quizScreen.classList.contains('active')) return;
    const key = e.key;
    if (['1', '2', '3', '4'].includes(key)) {
      const idx = parseInt(key, 10) - 1;
      const btn = answersContainer.children[idx];
      if (btn) btn.click();
    }
  }

  function showResults() {
    clearInterval(timerInterval);
    document.removeEventListener('keydown', handleKeydown);
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');
    finalScoreSpan.textContent = score;
    const percentage = Math.round((score / QUESTIONS_PER_QUIZ) * 100);
    document.getElementById('final-percent').textContent = percentage;
    document.getElementById('max-score').textContent = QUESTIONS_PER_QUIZ;
    if (percentage === 100) resultMessage.textContent = "Perfect! You're a genius!";
    else if (percentage >= 80) resultMessage.textContent = 'Great job! You know your stuff!';
    else if (percentage >= 60) resultMessage.textContent = 'Good effort! Keep learning!';
    else if (percentage >= 40) resultMessage.textContent = 'Not bad! Try again to improve!';
    else resultMessage.textContent = "Keep studying! You'll get better!";
    updateHighScore();
    renderResultDetails();
  }

  function renderResultDetails() {
    if (!resultDetails) return;
    resultDetails.innerHTML = '';
    const list = document.createElement('ol');
    list.className = 'review-list';
    for (let idx = 0; idx < userAnswers.length; idx++) {
      const item = userAnswers[idx];
      const li = document.createElement('li');
      li.className = 'review-item ' + (item.isCorrect ? 'correct-item' : 'incorrect-item');
      const top = document.createElement('div');
      top.className = 'review-top';
      const badge = document.createElement('div');
      badge.className = 'badge';
      badge.textContent = String(idx + 1);
      const q = document.createElement('div');
      q.className = 'review-question';
      q.textContent = item.question;
      top.appendChild(badge);
      top.appendChild(q);
      const answersRow = document.createElement('div');
      answersRow.className = 'answers-row';
      const a = document.createElement('div');
      a.className = 'review-answer';
      a.innerHTML = 'Your answer: <span class="user">' + (item.selected || '— no answer —') + '</span>';
      const c = document.createElement('div');
      c.className = 'review-correct';
      c.innerHTML = 'Correct: <span class="correct">' + item.correct + '</span>';
      const pill = document.createElement('div');
      pill.className = item.isCorrect ? 'correct-pill' : 'incorrect-pill';
      pill.textContent = item.isCorrect ? 'Correct' : 'Incorrect';
      answersRow.appendChild(a);
      answersRow.appendChild(c);
      answersRow.appendChild(pill);
      li.appendChild(top);
      li.appendChild(answersRow);
      list.appendChild(li);
    }
    resultDetails.appendChild(list);
  }

  function restartQuiz() {
    resultScreen.classList.remove('active');
    startQuiz();
  }

  function updateHighScore() {
    const prev = parseInt(localStorage.getItem(highScoreKey) || '0', 10);
    if (score > prev) {
      localStorage.setItem(highScoreKey, score);
      document.getElementById('high-score').textContent = score;
    }
  }
})();
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

const quizQuestions = [
  { question: "What is the capital of France?", answers: [{ text: "London", correct: false },{ text: "Berlin", correct: false },{ text: "Paris", correct: true },{ text: "Madrid", correct: false }] },
  { question: "Which planet is known as the Red Planet?", answers: [{ text: "Venus", correct: false },{ text: "Mars", correct: true },{ text: "Jupiter", correct: false },{ text: "Saturn", correct: false }] },
  { question: "What is the largest ocean on Earth?", answers: [{ text: "Atlantic Ocean", correct: false },{ text: "Indian Ocean", correct: false },{ text: "Arctic Ocean", correct: false },{ text: "Pacific Ocean", correct: true }] },
  { question: "Which of these is NOT a programming language?", answers: [{ text: "Java", correct: false },{ text: "Python", correct: false },{ text: "Banana", correct: true },{ text: "JavaScript", correct: false }] },
  { question: "What is the chemical symbol for gold?", answers: [{ text: "Go", correct: false },{ text: "Gd", correct: false },{ text: "Au", correct: true },{ text: "Ag", correct: false }] },
  { question: "Which language runs in a web browser?", answers: [{ text: "Python", correct: false },{ text: "C", correct: false },{ text: "JavaScript", correct: true },{ text: "Ruby", correct: false }] },
  { question: "What does CSS stand for?", answers: [{ text: "Central Style Sheets", correct: false },{ text: "Cascading Style Sheets", correct: true },{ text: "Creative Style System", correct: false },{ text: "Computer Style Sheets", correct: false }] },
  { question: "Which HTML tag is used for the largest heading?", answers: [{ text: "<h1>", correct: true },{ text: "<h6>", correct: false },{ text: "<head>", correct: false },{ text: "<header>", correct: false }] },
  { question: "Which gas do plants absorb from the atmosphere?", answers: [{ text: "Oxygen", correct: false },{ text: "Nitrogen", correct: false },{ text: "Carbon Dioxide", correct: true },{ text: "Hydrogen", correct: false }] },
  { question: "Who wrote 'Romeo and Juliet'?", answers: [{ text: "Charles Dickens", correct: false },{ text: "William Shakespeare", correct: true },{ text: "Mark Twain", correct: false },{ text: "Leo Tolstoy", correct: false }] },
  { question: "What is 9 × 9?", answers: [{ text: "81", correct: true },{ text: "72", correct: false },{ text: "99", correct: false },{ text: "79", correct: false }] },
  { question: "Which element has the chemical symbol O?", answers: [{ text: "Gold", correct: false },{ text: "Oxygen", correct: true },{ text: "Silver", correct: false },{ text: "Iron", correct: false }] },
  { question: "What year did the first man land on the moon?", answers: [{ text: "1969", correct: true },{ text: "1972", correct: false },{ text: "1965", correct: false },{ text: "1975", correct: false }] },
  { question: "Which country is home to the kangaroo?", answers: [{ text: "Australia", correct: true },{ text: "India", correct: false },{ text: "South Africa", correct: false },{ text: "Brazil", correct: false }] },
  { question: "What is the boiling point of water at sea level (°C)?", answers: [{ text: "90", correct: false },{ text: "100", correct: true },{ text: "110", correct: false },{ text: "120", correct: false }] },
  { question: "Which device converts AC to DC?", answers: [{ text: "Transformer", correct: false },{ text: "Rectifier", correct: true },{ text: "Generator", correct: false },{ text: "Capacitor", correct: false }] },
  { question: "Which organ pumps blood through the body?", answers: [{ text: "Lungs", correct: false },{ text: "Brain", correct: false },{ text: "Heart", correct: true },{ text: "Kidneys", correct: false }] },
  { question: "Which is the smallest prime number?", answers: [{ text: "0", correct: false },{ text: "1", correct: false },{ text: "2", correct: true },{ text: "3", correct: false }] },
  { question: "Which sport uses a shuttlecock?", answers: [{ text: "Tennis", correct: false },{ text: "Badminton", correct: true },{ text: "Squash", correct: false },{ text: "Table Tennis", correct: false }] },
  { question: "What is the process by which plants make food using sunlight?", answers: [{ text: "Respiration", correct: false },{ text: "Photosynthesis", correct: true },{ text: "Digestion", correct: false },{ text: "Transpiration", correct: false }] }
];

// QUIZ STATE VARS
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;
const TIME_PER_QUESTION = 15; // seconds
let timeLeft = TIME_PER_QUESTION;
let timerInterval = null;
let shuffledQuestions = [];
let sampledQuestions = [];
let userAnswers = [];

const highScoreKey = 'quiz_high_score';

const QUESTIONS_PER_QUIZ = 10;
totalQuestionsSpan.textContent = QUESTIONS_PER_QUIZ;
maxScoreSpan.textContent = QUESTIONS_PER_QUIZ;
document.getElementById('high-score').textContent = localStorage.getItem(highScoreKey) || 0;

const reviewButton = document.getElementById('review-btn');
const resultDetails = document.getElementById('result-details');

if (reviewButton) reviewButton.addEventListener('click', () => {
  // scroll to details
  if (resultDetails.innerHTML.trim() === '') renderResultDetails();
  resultDetails.scrollIntoView({ behavior: 'smooth' });
});

// event listeners
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

function startQuiz() {
  // reset vars
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;
  userAnswers = [];

  // prepare shuffled questions and shuffled answers per question
  shuffledQuestions = quizQuestions
    .map(q => ({ ...q }))
    .sort(() => Math.random() - 0.5)
    .map(q => ({
      ...q,
      answers: q.answers.slice().sort(() => Math.random() - 0.5)
    }));

  // pick first N as the sampled quiz set
  sampledQuestions = shuffledQuestions.slice(0, QUESTIONS_PER_QUIZ);

  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  // keyboard shortcuts
  document.addEventListener('keydown', handleKeydown);

  showQuestion();
}

function showQuestion() {
  // reset state
  answersDisabled = false;

  const currentQuestion = sampledQuestions[currentQuestionIndex];

  currentQuestionSpan.textContent = currentQuestionIndex + 1;

  const progressPercent = ((currentQuestionIndex) / QUESTIONS_PER_QUIZ) * 100;
  progressBar.style.width = progressPercent + "%";

  questionText.textContent = currentQuestion.question;

  answersContainer.innerHTML = "";

  currentQuestion.answers.forEach((answer, idx) => {
    const button = document.createElement("button");
    button.textContent = `${idx + 1}. ${answer.text}`;
    button.classList.add("answer-btn");

    button.dataset.correct = answer.correct;
    button.dataset.index = idx;

    button.addEventListener("click", selectAnswer);

    answersContainer.appendChild(button);
  });

  // start/reset timer
  clearInterval(timerInterval);
  timeLeft = TIME_PER_QUESTION;
  const timerSpan = document.getElementById('timer');
  timerSpan.textContent = timeLeft;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      // treat as unanswered, move to next
      answersDisabled = true;
      // record unanswered
      const correctBtn = Array.from(answersContainer.children).find(b => b.dataset.correct === 'true');
      const correctText = correctBtn ? correctBtn.textContent.replace(/^[0-9].\s*/, '') : '';
      userAnswers.push({ question: currentQuestion.question, selected: null, correct: correctText, isCorrect: false });
      // highlight correct answer briefly
      Array.from(answersContainer.children).forEach((button) => {
        if (button.dataset.correct === 'true') button.classList.add('correct');
      });
      setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < sampledQuestions.length) showQuestion();
        else showResults();
      }, 1000);
    }
  }, 1000);
}

function selectAnswer(event) {
  // optimization check
  if (answersDisabled) return;

  answersDisabled = true;
  clearInterval(timerInterval);

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });

  const selectedText = selectedButton.textContent.replace(/^[0-9].\s*/, '');
  const correctText = Array.from(answersContainer.children).find(b => b.dataset.correct === 'true').textContent.replace(/^[0-9].\s*/, '');
  userAnswers.push({ question: sampledQuestions[currentQuestionIndex].question, selected: selectedText, correct: correctText, isCorrect: isCorrect });

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < sampledQuestions.length) showQuestion();
    else showResults();
  }, 900);
}

function handleKeydown(e) {
  // allow numeric keys 1-4 to select answers
  if (!quizScreen.classList.contains('active')) return;
  const key = e.key;
  if (['1','2','3','4'].includes(key)) {
    const idx = parseInt(key, 10) - 1;
    const btn = answersContainer.children[idx];
    if (btn) btn.click();
  }
}

function showResults() {

  clearInterval(timerInterval);
  document.removeEventListener('keydown', handleKeydown);

  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalScoreSpan.textContent = score;

  const percentage = Math.round((score / QUESTIONS_PER_QUIZ) * 100);
  document.getElementById('final-percent').textContent = percentage;
  document.getElementById('max-score').textContent = QUESTIONS_PER_QUIZ;

  if (percentage === 100) {
    resultMessage.textContent = "Perfect! You're a genius!";
  } else if (percentage >= 80) {
    resultMessage.textContent = "Great job! You know your stuff!";
  } else if (percentage >= 60) {
    resultMessage.textContent = "Good effort! Keep learning!";
  } else if (percentage >= 40) {
    resultMessage.textContent = "Not bad! Try again to improve!";
  } else {
    resultMessage.textContent = "Keep studying! You'll get better!";
  }

  // update and persist high score
  updateHighScore();
  // prepare result details for review
  renderResultDetails();
}

function renderResultDetails() {
  if (!resultDetails) return;
  resultDetails.innerHTML = '';
  const list = document.createElement('ol');
  list.className = 'review-list';
  userAnswers.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'review-item';
    const q = document.createElement('div');
    q.className = 'review-question';
    q.textContent = `${idx + 1}. ${item.question}`;
    const a = document.createElement('div');
    a.className = 'review-answer';
    a.innerHTML = `Your answer: <span class="user">${item.selected || '<em>— no answer —</em>'}</span>`;
    const c = document.createElement('div');
    c.className = 'review-correct';
    c.innerHTML = `Correct: <span class="correct">${item.correct}</span>`;
    if (item.isCorrect) {
      li.classList.add('correct-item');
    } else {
      li.classList.add('incorrect-item');
    }
    li.appendChild(q);
    li.appendChild(a);
    li.appendChild(c);
    list.appendChild(li);
  });
  resultDetails.appendChild(list);
}

function restartQuiz() {
  resultScreen.classList.remove("active");

  startQuiz();
}

// persist high score
function updateHighScore() {
  const prev = parseInt(localStorage.getItem(highScoreKey) || '0', 10);
  if (score > prev) {
    localStorage.setItem(highScoreKey, score);
    document.getElementById('high-score').textContent = score;
  }
}
