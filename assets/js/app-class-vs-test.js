const screens = {
  login: document.getElementById("screen-login"),
  home: document.getElementById("screen-home"),
  class: document.getElementById("screen-class"),
  test: document.getElementById("screen-test"),
  summary: document.getElementById("screen-summary"),
  analysis: document.getElementById("screen-analysis"),
  notification: document.getElementById("screen-notification"),
  membership: document.getElementById("screen-membership"),
  profile: document.getElementById("screen-profile"),
};

const bottomNav = document.getElementById("bottomNav");
const navButtons = Array.from(document.querySelectorAll(".nav-btn"));
const jumpButtons = Array.from(document.querySelectorAll("[data-jump]"));

const loginAccount = document.getElementById("loginAccount");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");

const studentName = document.getElementById("studentName");
const studentSchool = document.getElementById("studentSchool");
const studentFile = document.getElementById("studentFile");
const verifyIdentityBtn = document.getElementById("verifyIdentityBtn");
const identityMsg = document.getElementById("identityMsg");

const classMastery = document.getElementById("classMastery");
const teacherTabs = Array.from(document.querySelectorAll(".teacher-tab"));
const classReply = document.getElementById("classReply");

const testQuestionTitle = document.getElementById("testQuestionTitle");
const testQuestionText = document.getElementById("testQuestionText");
const testQuestionType = document.getElementById("testQuestionType");
const testTimer = document.getElementById("testTimer");
const resultSelect = document.getElementById("resultSelect");
const hesitationInput = document.getElementById("hesitationInput");
const submitAnswer = document.getElementById("submitAnswer");
const nextQuestion = document.getElementById("nextQuestion");
const testMsg = document.getElementById("testMsg");
const testProgress = document.getElementById("testProgress");
const progressText = document.getElementById("progressText");
const openSummaryBtn = document.getElementById("openSummaryBtn");

const summaryScore = document.getElementById("summaryScore");
const summaryAccuracy = document.getElementById("summaryAccuracy");
const summaryHesitation = document.getElementById("summaryHesitation");
const summaryAdvice = document.getElementById("summaryAdvice");

const wrongStats = document.getElementById("wrongStats");
const hesitationStats = document.getElementById("hesitationStats");
const teacherRecommend = document.getElementById("teacherRecommend");
const adviceList = document.getElementById("adviceList");

const profileName = document.getElementById("profileName");
const profileSchool = document.getElementById("profileSchool");

const teacherStyles = {
  strict: "蘇穎：先定義 m，再套公式驗算。每一步都可回溯。",
  visual: "顧晨：把斜率想成線條爬升速度，先看圖再回公式。",
  coach: "沐晴：用提問引導你自己說出關鍵，強化記憶點。",
};

const questions = [
  {
    title: "第 1 題：一次函數斜率判讀",
    type: "concept",
    text: "已知直線方程式 y = -3x + 7，請問此直線的斜率是多少？並說明如何判斷。",
  },
  { title: "第 2 題：移項與代數運算", type: "calc", text: "解方程式 2x - 5 = 13，求 x 的值。" },
  { title: "第 3 題：文字題條件擷取", type: "reading", text: "閱讀題幹後，判斷哪個數據是已知條件。" },
  { title: "第 4 題：圖像與方程轉換", type: "concept", text: "觀察圖像上升比例，寫出近似的 y=mx+b。" },
  { title: "第 5 題：綜合應用題", type: "calc", text: "已知兩點座標，計算斜率並寫出一次函數式。" },
];

const state = {
  classMastery: 64,
  qIndex: 0,
  submitted: 0,
  correctCount: 0,
  profile: {
    name: "-",
    school: "-",
  },
  postWrong: { calc: 0, concept: 0, reading: 0 },
  postHesitation: { calc: [], concept: [], reading: [] },
};

function avg(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

function activate(screenKey) {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[screenKey].classList.add("is-active");
  navButtons.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.screen === screenKey));
  if (screenKey === "summary") renderSummary();
  if (screenKey === "analysis") renderAnalysis();
}

function renderClass() {
  classMastery.style.width = `${state.classMastery}%`;
}

function renderQuestion() {
  const q = questions[state.qIndex];
  const map = { calc: "計算題", concept: "觀念題", reading: "審題題" };
  testQuestionTitle.textContent = q.title;
  testQuestionText.textContent = q.text;
  testQuestionType.textContent = `題型：${map[q.type]}`;
  testTimer.textContent = `00:${String(35 - state.qIndex * 2).padStart(2, "0")}`;
}

function renderProgress() {
  const pct = Math.round((state.submitted / questions.length) * 100);
  testProgress.style.width = `${pct}%`;
  progressText.textContent = `${state.submitted} / ${questions.length} 題`;
}

function renderSummary() {
  const score = Math.round((state.correctCount / questions.length) * 100);
  const allHesitations = [
    ...state.postHesitation.calc,
    ...state.postHesitation.concept,
    ...state.postHesitation.reading,
  ];
  summaryScore.textContent = `總分：${score} / 100`;
  summaryAccuracy.textContent = `答對率：${Math.round((state.correctCount / Math.max(1, state.submitted)) * 100)}%`;
  summaryHesitation.textContent = `平均猶豫時間：${avg(allHesitations)} 秒`;

  const wrongRank = Object.entries(state.postWrong).sort((a, b) => b[1] - a[1])[0][0];
  const map = { calc: "計算", concept: "觀念", reading: "審題" };
  summaryAdvice.innerHTML = `
    <li>本次最需補強：${map[wrongRank]}題型。</li>
    <li>建議先做 10 題同型練習，再進綜合題。</li>
    <li>前往「學習分析」查看完整建議與推薦老師風格。</li>
  `;
}

function renderAnalysis() {
  wrongStats.innerHTML = `
    <li>計算錯誤：${state.postWrong.calc} 題</li>
    <li>觀念錯誤：${state.postWrong.concept} 題</li>
    <li>審題錯誤：${state.postWrong.reading} 題</li>
  `;
  hesitationStats.innerHTML = `
    <li>計算題平均猶豫：${avg(state.postHesitation.calc)} 秒</li>
    <li>觀念題平均猶豫：${avg(state.postHesitation.concept)} 秒</li>
    <li>審題題平均猶豫：${avg(state.postHesitation.reading)} 秒</li>
  `;

  const wrongRank = Object.entries(state.postWrong).sort((a, b) => b[1] - a[1]);
  const hesitationRank = Object.entries(state.postHesitation)
    .map(([k, v]) => [k, avg(v)])
    .sort((a, b) => b[1] - a[1]);
  const label = { calc: "計算", concept: "觀念", reading: "審題" };

  let recommend = "蘇穎｜嚴謹拆解";
  if (wrongRank[0][0] === "concept" || hesitationRank[0][0] === "concept") recommend = "顧晨｜圖像直覺";
  if (wrongRank[0][0] === "reading") recommend = "沐晴｜互動引導";
  teacherRecommend.textContent = `目前最適合：${recommend}`;

  adviceList.innerHTML = `
    <li>主要弱點：${label[wrongRank[0][0]]}題型，建議先做 10 題同型暖身。</li>
    <li>猶豫時間最長：${label[hesitationRank[0][0]]}題型，改用分步提示法複習。</li>
    <li>下輪測驗建議：先弱項再綜合，完成後回看錯題回放。</li>
  `;
}

// Navigation
navButtons.forEach((btn) => btn.addEventListener("click", () => activate(btn.dataset.screen)));
jumpButtons.forEach((btn) => btn.addEventListener("click", () => activate(btn.dataset.jump)));

// Login flow
loginBtn.addEventListener("click", () => {
  if (!loginAccount.value.trim() || !loginPassword.value.trim()) {
    loginMsg.textContent = "請輸入完整帳號與密碼";
    loginMsg.style.color = "#dc2626";
    return;
  }
  loginMsg.textContent = "登入成功";
  loginMsg.style.color = "#1d4ed8";
  bottomNav.classList.remove("hidden");
  activate("home");
});

verifyIdentityBtn.addEventListener("click", () => {
  if (!studentName.value.trim() || !studentSchool.value.trim() || !(studentFile.files && studentFile.files.length)) {
    identityMsg.textContent = "請填寫資料並上傳學生證";
    identityMsg.style.color = "#dc2626";
    return;
  }
  state.profile.name = studentName.value.trim();
  state.profile.school = studentSchool.value.trim();
  profileName.textContent = `姓名：${state.profile.name}`;
  profileSchool.textContent = `學校：${state.profile.school}`;
  identityMsg.textContent = "學生身份驗證成功，已啟用免費試用一個月";
  identityMsg.style.color = "#1d4ed8";
  activate("membership");
});

// Class style
teacherTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    teacherTabs.forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    classReply.textContent = teacherStyles[tab.dataset.style];
    state.classMastery = Math.min(100, state.classMastery + 1);
    renderClass();
  });
});

// Test flow
submitAnswer.addEventListener("click", () => {
  const q = questions[state.qIndex];
  const sec = Number(hesitationInput.value) || 0;
  const result = resultSelect.value;

  state.postHesitation[q.type].push(sec);
  if (result === "wrong-calc") state.postWrong.calc += 1;
  if (result === "wrong-concept") state.postWrong.concept += 1;
  if (result === "wrong-reading") state.postWrong.reading += 1;
  if (result === "correct") state.correctCount += 1;

  state.submitted = Math.min(questions.length, state.submitted + 1);
  testMsg.textContent = `已提交 ${q.title}（${sec} 秒），已納入學習分析`;
  renderProgress();
});

nextQuestion.addEventListener("click", () => {
  state.qIndex = (state.qIndex + 1) % questions.length;
  renderQuestion();
  testMsg.textContent = "請選擇本題作答結果後提交";
});

openSummaryBtn.addEventListener("click", () => activate("summary"));

// Initial render
classReply.textContent = teacherStyles.strict;
renderClass();
renderQuestion();
renderProgress();
