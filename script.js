const binaryDisplay = document.getElementById("binaryDisplay");
const step2Grid = document.getElementById("step2Grid");
const step3Expression = document.getElementById("step3Expression");
const step1Input = document.getElementById("step1Input");
const step4Input = document.getElementById("step4Input");
const finalAnswerInput = document.getElementById("finalAnswerInput");
const checkBtn = document.getElementById("checkBtn");
const showSolutionBtn = document.getElementById("showSolutionBtn");
const newQuestionBtn = document.getElementById("newQuestionBtn");
const hintBtn = document.getElementById("hintBtn");
const bitLengthSelect = document.getElementById("bitLengthSelect");
const feedback = document.getElementById("feedback");
const hintBox = document.getElementById("hintBox");
const solutionBox = document.getElementById("solutionBox");
const attemptsStat = document.getElementById("attemptsStat");
const correctStat = document.getElementById("correctStat");
const streakStat = document.getElementById("streakStat");
const accuracyStat = document.getElementById("accuracyStat");

let currentBinary = "";
let currentDecimal = 0;
const stats = {
  attempts: 0,
  correct: 0,
  streak: 0,
};

function randomBitLength() {
  return Math.floor(Math.random() * 5) + 4;
}

function selectedBitLength() {
  const mode = bitLengthSelect.value;
  if (mode === "random") {
    return randomBitLength();
  }
  return Number(mode);
}

function generateBinary(length) {
  // Ensure first bit is 1 so the generated value has exactly the selected length.
  let bits = "1";
  for (let i = 1; i < length; i += 1) {
    bits += Math.random() < 0.5 ? "0" : "1";
  }
  return bits;
}

function powerLabel(exp) {
  return `2^${exp}`;
}

function buildStep2(bits) {
  step2Grid.innerHTML = "";

  const powersRow = document.createElement("div");
  powersRow.className = "grid-row";

  const bitsRow = document.createElement("div");
  bitsRow.className = "grid-row";

  for (let i = 0; i < bits.length; i += 1) {
    const exponent = bits.length - 1 - i;

    const powerCell = document.createElement("div");
    powerCell.className = "grid-cell";
    powerCell.innerHTML = `<div class="cell-head">القوة</div><div>${powerLabel(exponent)}</div>`;

    const bitCell = document.createElement("div");
    bitCell.className = "grid-cell";
    bitCell.innerHTML = `<div class="cell-head">البت</div><div>${bits[i]}</div>`;

    powersRow.appendChild(powerCell);
    bitsRow.appendChild(bitCell);
  }

  step2Grid.appendChild(powersRow);
  step2Grid.appendChild(bitsRow);
}

function buildStep3(bits) {
  const parts = [];
  for (let i = 0; i < bits.length; i += 1) {
    const exponent = bits.length - 1 - i;
    parts.push(`${bits[i]}×${powerLabel(exponent)}`);
  }
  step3Expression.textContent = parts.join(" + ");
}

function clearUserInputs() {
  step1Input.value = "";
  step4Input.value = "";
  finalAnswerInput.value = "";
  feedback.textContent = "";
  feedback.classList.remove("ok", "error");
  feedback.classList.remove("flash");
  hintBox.classList.add("hidden");
  hintBox.textContent = "";
  solutionBox.classList.add("hidden");
  solutionBox.textContent = "";
}

function updateStatsUI() {
  attemptsStat.textContent = String(stats.attempts);
  correctStat.textContent = String(stats.correct);
  streakStat.textContent = String(stats.streak);

  if (stats.attempts === 0) {
    accuracyStat.textContent = "0%";
    return;
  }

  const accuracy = Math.round((stats.correct / stats.attempts) * 100);
  accuracyStat.textContent = `${accuracy}%`;
}

function setFeedback(message, type) {
  feedback.textContent = message;
  feedback.classList.remove("ok", "error", "flash");
  feedback.classList.add(type, "flash");
}

function generateQuestion() {
  const length = selectedBitLength();
  currentBinary = generateBinary(length);
  currentDecimal = Number.parseInt(currentBinary, 2);

  binaryDisplay.textContent = currentBinary;
  buildStep2(currentBinary);
  buildStep3(currentBinary);
  clearUserInputs();
}

function buildSolutionText(bits) {
  const expandedTerms = [];

  for (let i = 0; i < bits.length; i += 1) {
    const exponent = bits.length - 1 - i;
    const bit = Number(bits[i]);
    expandedTerms.push(String(bit * 2 ** exponent));
  }

  const activeTerms = expandedTerms.filter((value) => value !== "0");
  const activeTermsDisplay =
    activeTerms.length > 0 ? activeTerms.join(" + ") : "0";

  return `${expandedTerms.join(" + ")} = ${currentDecimal}\n(الخانات المفعلة فقط: ${activeTermsDisplay} = ${currentDecimal})`;
}

function checkAnswer() {
  const raw = finalAnswerInput.value.trim();
  if (raw === "") {
    setFeedback("من فضلك أدخل الناتج النهائي أولًا.", "error");
    return;
  }

  const userAnswer = Number(raw);
  if (!Number.isFinite(userAnswer)) {
    setFeedback("المدخل غير صالح. أدخل رقمًا عشريًا صحيحًا.", "error");
    return;
  }

  stats.attempts += 1;

  if (userAnswer === currentDecimal) {
    stats.correct += 1;
    stats.streak += 1;
    setFeedback("إجابة صحيحة. ممتاز! استمر بنفس القوة.", "ok");
  } else {
    stats.streak = 0;
    setFeedback(
      "الإجابة غير صحيحة. حاول مرة أخرى أو اضغط إظهار الحل.",
      "error",
    );
  }

  updateStatsUI();
}

function showSolution() {
  solutionBox.textContent = buildSolutionText(currentBinary);
  solutionBox.classList.remove("hidden");
}

function firstActiveBitHint() {
  const firstOneIndex = currentBinary.indexOf("1");
  if (firstOneIndex === -1) {
    return "لا توجد خانات مفعّلة في هذا السؤال.";
  }

  const exponent = currentBinary.length - 1 - firstOneIndex;
  const value = 2 ** exponent;
  return `ابدأ من اليسار: أول 1 يساوي 2^${exponent} = ${value}.`;
}

function showHint() {
  hintBox.textContent = firstActiveBitHint();
  hintBox.classList.remove("hidden");
}

checkBtn.addEventListener("click", checkAnswer);
showSolutionBtn.addEventListener("click", showSolution);
hintBtn.addEventListener("click", showHint);
newQuestionBtn.addEventListener("click", generateQuestion);
bitLengthSelect.addEventListener("change", generateQuestion);

finalAnswerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

updateStatsUI();
generateQuestion();
