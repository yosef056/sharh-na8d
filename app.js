const home = document.getElementById("home");
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

document.getElementById("start-btn").addEventListener("click", start);
document.getElementById("retry-btn").addEventListener("click", start);
nextBtn.addEventListener("click", next);

function start() {
  index = 0;
  score = 0;
  locked = false;
  home.classList.add("hidden");
  result.classList.add("hidden");
  quiz.classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  const item = QUESTIONS[index];
  locked = false;
  nextBtn.classList.add("hidden");
  explainEl.classList.remove("show");
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

  if (choiceIndex === item.answer) {
    score += 1;
    btn.classList.add("right");
  } else {
    btn.classList.add("wrong");
  }

  liveScoreEl.textContent = `صح: ${score}`;
  explainEl.textContent = item.explain;
  explainEl.classList.add("show");
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
  quiz.classList.add("hidden");
  result.classList.remove("hidden");
  barEl.style.width = "100%";
  document.getElementById("final-score").textContent =
    `${score} / ${QUESTIONS.length}`;
  document.getElementById("final-msg").textContent =
    score >= 8
      ? "ممتاز. راجعت أفكار الدرس الرابع جيدًا."
      : "حاول مرة ثانية، واقرأ الشرح بعد كل سؤال.";
  showQr();
}

function showQr() {
  const url = window.location.href;
  const img = document.getElementById("qr-img");
  const label = document.getElementById("share-url");

  if (url.startsWith("http://") || url.startsWith("https://")) {
    img.src =
      "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" +
      encodeURIComponent(url);
    img.classList.remove("hidden");
    label.textContent = url;
  } else {
    img.classList.add("hidden");
    label.textContent =
      "رمز QR يظهر بعد رفع الموقع أونلاين (مو من فتح الملف على الجهاز).";
  }
}
