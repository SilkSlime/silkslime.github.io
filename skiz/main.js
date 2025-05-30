import { questions } from './questions.js';
import { comments } from './comments.js';

const quizEl = document.getElementById('quiz');
let current = 0;
let score = 0;

// Следим за использованными подсказками
const lifelines = { '5050': false, 'audience': false, 'call': false };

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function setupLifelines() {
  document.getElementById('lifeline5050').addEventListener('click', use5050);
  document.getElementById('lifelineAudience').addEventListener('click', useAudience);
  document.getElementById('lifelineCall').addEventListener('click', useCall);
}

function use5050() {
  if (lifelines['5050']) return;
  lifelines['5050'] = true;
  const correct = questions[current].correctIndex;
  const wrong = [...questions[current].choices.keys()].filter(i => i !== correct);
  shuffle(wrong);
  const removeTwo = wrong.slice(0, 2);
  removeTwo.forEach(i => {
    const btn = document.querySelector(`.choice[data-index="${i}"]`);
    if (btn) btn.style.visibility = 'hidden';
  });
  document.getElementById('lifeline5050').classList.add('used');
}

function useAudience() {
  if (lifelines['audience']) return;
  lifelines['audience'] = true;
  const q = questions[current];
  const correct = q.correctIndex;
  const other = [...q.choices.keys()].filter(i => i !== correct);
  const correctPct = 60 + Math.floor(Math.random() * 21);
  let rest = 100 - correctPct;
  const pcts = [];
  for (let i = 0; i < other.length - 1; i++) {
    const p = Math.floor(Math.random() * (rest + 1));
    pcts.push(p);
    rest -= p;
  }
  pcts.push(rest);
  const distribution = {};
  other.forEach((idx, i) => distribution[idx] = pcts[i]);
  distribution[correct] = correctPct;
  const fb = document.getElementById('feedback');
  fb.innerHTML = Object.entries(distribution)
    .map(([idx, pct]) => `${q.choices[idx]}: ${pct}%`)
    .join('<br>');
  document.getElementById('lifelineAudience').classList.add('used');
}

function useCall() {
  if (lifelines['call']) return;
  lifelines['call'] = true;
  const q = questions[current];
  const correct = q.correctIndex;
  const isCorrect = Math.random() < 0.8;
  const idx = isCorrect
    ? correct
    : [...q.choices.keys()].filter(i => i !== correct)[
        Math.floor(Math.random() * (q.choices.length - 1))
      ];
  const fb = document.getElementById('feedback');
  fb.innerHTML = `I.N’s call: "Я думаю, ответ: ${q.choices[idx]}"`;
  document.getElementById('lifelineCall').classList.add('used');
}

function renderQuestion() {
  const q = questions[current];
  quizEl.innerHTML = `
    <div class="question">${q.text}</div>
    <ul class="choices">
      ${q.choices.map((c, i) =>
        `<li class="choice" data-index="${i}">${c}</li>`
      ).join('')}
    </ul>
    <div class="feedback" id="feedback"></div>
    <button class="next-btn" id="nextBtn" style="display:none">Следующий вопрос</button>
  `;
  document.querySelectorAll('.choice')
    .forEach(li => li.addEventListener('click', handleChoice));
}

function handleChoice(e) {
  const chosen = +e.currentTarget.dataset.index;
  const correct = questions[current].correctIndex;
  const isCorrect = chosen === correct;
  if (isCorrect) {
    score++;
    e.currentTarget.classList.add('correct');
  } else {
    e.currentTarget.classList.add('wrong');
    document.querySelector(`.choice[data-index="${correct}"]`)
      .classList.add('correct');
  }
  const fb = document.getElementById('feedback');
  fb.textContent = isCorrect
    ? comments[current].correct
    : comments[current].incorrect;
  document.getElementById('nextBtn').style.display = 'block';
  document.getElementById('nextBtn').addEventListener('click', nextQuestion);
  document.querySelectorAll('.choice')
    .forEach(li => li.removeEventListener('click', handleChoice));
}

function nextQuestion() {
  current++;
  if (current < questions.length) {
    renderQuestion();
  } else {
    quizEl.innerHTML = `
      <div class="question">
        Вы ответили правильно на ${score} из ${questions.length} вопросов.
      </div>
    `;
  }
}

// Инициализация
renderQuestion();
setupLifelines();