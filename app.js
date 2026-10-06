const start = document.getElementById("start");
const speaker1 = document.getElementById("speaker-1");
const speaker2 = document.getElementById("speaker-2");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const explainEl = document.getElementById("explain");
const nextBtn = document.getElementById("next-btn");
const counterEl = document.getElementById("counter");
const liveScoreEl = document.getElementById("live-score");
const barEl = document.getElementById("bar");

let index = 0;
let score = 0;
let locked = false;

document.getElementById("to-speaker-1").addEventListener("click", () => {
  showOnly(speaker1);
});
document.getElementById("retry-btn").addEventListener("click", () => {
  showOnly(start);
});
nextBtn.addEventListener("click", next);

renderSpeaker(speaker1, LESSON.speaker1, "التالي: الجزء الثاني", () => showOnly(speaker2));
renderSpeaker(speaker2, LESSON.speaker2, "ابدأ الأسئلة", startQuiz);

function renderSpeaker(section, data, buttonLabel, onNext) {
  const who = document.createElement("p");
  who.className = "who";
  who.textContent = `الشارح: ${data.name}`;

  const part = document.createElement("p");
  part.className = "part";
  part.textContent = data.part;

  section.append(who, part);

  data.blocks.forEach((block) => {
    const wrap = document.createElement("div");
    wrap.className = "block";
    const heading = document.createElement("h3");
    heading.textContent = block.heading;
    wrap.append(heading);
    block.paragraphs.forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      wrap.append(p);
    });
    section.append(wrap);
  });

  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn";
  button.textContent = buttonLabel;
  button.addEventListener("click", onNext);
  section.append(button);
}

function showOnly(section) {
  [start, speaker1, speaker2, quiz, result].forEach((el) => {
    el.classList.toggle("hidden", el !== section);
  });
  window.scrollTo(0, 0);
}

function startQuiz() {
  index = 0;
  score = 0;
  locked = false;
  showOnly(quiz);
  showQuestion();
}

function showQuestion() {
  const item = QUESTIONS[index];
  locked = false;
  nextBtn.classList.add("hidden");
  explainEl.className = "explain";
  explainEl.textContent = "";

  counterEl.textContent = `سؤال ${index + 1} من ${QUESTIONS.length}`;
  liveScoreEl.textContent = `صح: ${score}`;
  barEl.style.width = `${(index / QUESTIONS.length) * 100}%`;
  questionEl.textContent = item.q;
  choicesEl.innerHTML = "";

  item.choices.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";
    btn.textContent = text;
    btn.addEventListener("click", () => pick(i, btn));
    choicesEl.appendChild(btn);
  });
}

function pick(choiceIndex, btn) {
  if (locked) return;
  locked = true;

  const item = QUESTIONS[index];
  const buttons = [...choicesEl.querySelectorAll(".choice")];
  buttons.forEach((b, i) => {
    b.disabled = true;
    if (i === item.answer) b.classList.add("right");
  });

  const correct = choiceIndex === item.answer;
  if (correct) {
    score += 1;
    btn.classList.add("right");
  } else {
    btn.classList.add("wrong");
  }

  liveScoreEl.textContent = `صح: ${score}`;
  explainEl.className = "explain show";
  const verdict = document.createElement("span");
  verdict.className = "verdict";
  verdict.textContent = correct ? "صح" : "خطأ";
  explainEl.append(verdict, item.explain);

  nextBtn.textContent = index === QUESTIONS.length - 1 ? "النتيجة" : "التالي";
  nextBtn.classList.remove("hidden");
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
  const label = document.getElementById("share-url");
  const url = window.location.href.split("#")[0];
  const local =
    url.startsWith("file:") || url.includes("localhost") || url.includes("127.0.0.1");

  img.classList.add("hidden");
  if (local) {
    label.textContent = "رمز QR يظهر بعد فتح الموقع من رابط النشر.";
    return;
  }

  label.textContent = url;
  img.onload = () => img.classList.remove("hidden");
  img.onerror = () => img.classList.add("hidden");
  img.src = "qr.png";
}
