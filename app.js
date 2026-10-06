const start = document.getElementById("start");
const lesson = document.getElementById("lesson");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const explainEl = document.getElementById("explain");
const nextBtn = document.getElementById("next-btn");
const counterEl = document.getElementById("counter");
const liveScoreEl = document.getElementById("live-score");
const barEl = document.getElementById("bar");

const slides = [LESSON.speaker1, LESSON.speaker2].flatMap((speaker) =>
  speaker.blocks.map((block) => ({ ...block }))
);

let slide = 0;
let index = 0;
let score = 0;
let locked = false;
const picks = [];

document.getElementById("to-speaker-1").addEventListener("click", () => showSlide(0));
document.getElementById("retry-btn").addEventListener("click", () => {
  index = 0;
  score = 0;
  picks.length = 0;
  showOnly(start);
});
document.getElementById("quiz-back").addEventListener("click", quizBack);
nextBtn.addEventListener("click", next);

function showOnly(section) {
  [start, lesson, quiz, result].forEach((el) => {
    el.classList.toggle("hidden", el !== section);
  });
  document.body.classList.toggle("on-start", section === start);
  document.body.classList.toggle("on-lesson", section === lesson);
  document.body.classList.toggle("on-quiz", section === quiz);
  document.body.classList.toggle("on-result", section === result);
  window.scrollTo(0, 0);
}

function showSlide(nextSlide) {
  slide = nextSlide;
  const page = slides[slide];
  lesson.replaceChildren();

  const heading = document.createElement("h2");
  heading.textContent = page.heading;

  lesson.append(heading);

  page.paragraphs.forEach((text) => {
    const p = document.createElement("p");
    p.textContent = text;
    lesson.append(p);
  });

  const example = document.createElement("p");
  example.className = "example";
  const label = document.createElement("span");
  label.className = "example-label";
  label.textContent = "مثال";
  example.append(label, document.createTextNode(page.example));
  lesson.append(example);

  const actions = document.createElement("div");
  actions.className = "actions";

  const back = document.createElement("button");
  back.type = "button";
  back.className = "btn btn-ghost";
  back.textContent = "رجوع";
  back.addEventListener("click", () => {
    if (slide === 0) showOnly(start);
    else showSlide(slide - 1);
  });

  const forward = document.createElement("button");
  forward.type = "button";
  forward.className = "btn";
  const last = slide === slides.length - 1;
  forward.textContent = last ? "ابدأ الأسئلة" : "التالي";
  forward.addEventListener("click", () => {
    if (last) startQuiz();
    else showSlide(slide + 1);
  });

  actions.append(back, forward);
  lesson.append(actions);
  showOnly(lesson);
}

function startQuiz() {
  index = 0;
  score = 0;
  picks.length = 0;
  locked = false;
  showOnly(quiz);
  showQuestion();
}

function showQuestion() {
  const item = QUESTIONS[index];
  locked = picks[index] !== undefined;
  nextBtn.classList.add("hidden");
  explainEl.className = "explain";
  explainEl.textContent = "";

  counterEl.textContent = `سؤال ${index + 1} من ${QUESTIONS.length}`;
  liveScoreEl.textContent = `صح: ${score}`;
  barEl.style.width = `${(index / QUESTIONS.length) * 100}%`;
  questionEl.textContent = item.q;
  choicesEl.replaceChildren();

  item.choices.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";
    const label = document.createElement("span");
    label.textContent = text;
    btn.append(label);
    btn.addEventListener("click", () => pick(i));
    choicesEl.append(btn);
  });

  if (picks[index] !== undefined) reveal(picks[index]);
}

function pick(choiceIndex) {
  if (locked) return;
  locked = true;
  picks[index] = choiceIndex;
  if (choiceIndex === QUESTIONS[index].answer) score += 1;
  reveal(choiceIndex);
}

function reveal(choiceIndex) {
  const item = QUESTIONS[index];
  const buttons = [...choicesEl.querySelectorAll(".choice")];
  const correct = choiceIndex === item.answer;

  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === item.answer) {
      button.classList.add("right");
      addMark(button, "✓");
    } else if (i === choiceIndex) {
      button.classList.add("wrong");
      addMark(button, "✗");
    }
  });

  liveScoreEl.textContent = `صح: ${score}`;
  explainEl.className = "explain show";
  const verdict = document.createElement("span");
  verdict.className = "verdict";
  verdict.textContent = correct ? "صح" : "خطأ";
  explainEl.append(verdict, item.explain);

  nextBtn.textContent = index === QUESTIONS.length - 1 ? "النتيجة" : "التالي";
  nextBtn.classList.remove("hidden");
}

function addMark(button, symbol) {
  const mark = document.createElement("span");
  mark.className = "mark";
  mark.textContent = symbol;
  button.prepend(mark);
}

function quizBack() {
  if (index === 0) {
    showSlide(slides.length - 1);
    return;
  }
  index -= 1;
  showQuestion();
}

function next() {
  index += 1;
  if (index >= QUESTIONS.length) {
    finish();
    return;
  }
  showQuestion();
}

function finish() {
  showOnly(result);
  document.getElementById("final-score").textContent = `${score} / ${QUESTIONS.length}`;
  document.getElementById("final-msg").textContent =
    score >= 8
      ? "ممتاز. الشرح والأسئلة صارت واضحة."
      : "ارجع للشرح، ثم أعد الأسئلة.";
  showQr();
}

function showQr() {
  const img = document.getElementById("qr-img");
  img.classList.add("hidden");
  img.onload = () => img.classList.remove("hidden");
  img.onerror = () => img.classList.add("hidden");
  img.src = "qr.png";
}

function openQuizFromLink() {
  if (location.hash === "#quiz") startQuiz();
}

openQuizFromLink();
window.addEventListener("hashchange", openQuizFromLink);
