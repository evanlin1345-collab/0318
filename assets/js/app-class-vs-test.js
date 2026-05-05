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
const styleTitle = document.getElementById("styleTitle");
const styleDesc = document.getElementById("styleDesc");
const styleUseCase = document.getElementById("styleUseCase");
const styleImpact = document.getElementById("styleImpact");
const styleSteps = document.getElementById("styleSteps");
const styleExample = document.getElementById("styleExample");
const styleChartHint = document.getElementById("styleChartHint");
const styleKpiName = document.getElementById("styleKpiName");
const styleKpiUseCase = document.getElementById("styleKpiUseCase");
const styleKpiPace = document.getElementById("styleKpiPace");
const styleKpiImpact = document.getElementById("styleKpiImpact");
const styleCompareList = document.getElementById("styleCompareList");
const styleToneTag = document.getElementById("styleToneTag");
const solveIntro = document.getElementById("solveIntro");
const solveSteps = document.getElementById("solveSteps");
const solvePitfall = document.getElementById("solvePitfall");
const solveWrapup = document.getElementById("solveWrapup");

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
  strict: {
    label: "蘇穎｜嚴謹拆解",
    reply: "先找 y=mx+b 中的 m，再檢查每一步代入是否一致，最後用兩點驗算避免粗心。",
    desc: "適合計算與公式混合題，強調每一步可回頭檢查，降低算錯風險。",
    useCase: "適用情境：公式看得懂但常漏步、符號容易抄錯。",
    impact: "預期成效：提升解題正確率、減少計算型失誤。",
    pace: "慢-中（逐步驗算）",
    example: "示範句：先抓 m=-3，再代 x=1 驗一次，最後用 x=2 二次驗證。",
    tone: "嚴謹板書",
    solveIntro: "我們把式子對齊一次函數標準式 y = mx + b，先找位置，再談意義。",
    solveStepsDetailed: [
      "步驟 A：對照 y = mx + b，可直接讀到 m = -3、b = 7。",
      "步驟 B：解釋 m 的意義：x 每增加 1，y 就改變 -3（下降 3）。",
      "步驟 C：用驗算確認：x=0 時 y=7；x=1 時 y=4，確實下降 3。",
      "步驟 D：再次驗證：x=2 時 y=1，仍維持每次 -3，因此斜率穩定。",
    ],
    pitfall: "常見錯誤：把截距 7 誤當斜率。規則是 x 前面的係數才是斜率。",
    wrapup: "結論：斜率為 -3，判斷依據是『x 的係數』與『Δy/Δx 固定為 -3』。",
    steps: [
      "步驟 1：辨識標準式中的 m 與 b，先不急著算。",
      "步驟 2：代入一組 x 值驗證 y 的變化是否一致。",
      "步驟 3：用第二組 x 再驗一次，確保不是碰巧答對。",
    ],
  },
  visual: {
    label: "顧晨｜圖像直覺",
    reply: "把斜率看成線條傾斜方向：往右走一格，y 往上或往下多少，就是 m。",
    desc: "適合觀念建立與圖像題，先用視覺理解再回到符號表示。",
    useCase: "適用情境：看到公式就緊張、觀念抽象難想像。",
    impact: "預期成效：提升概念理解速度，減少死背公式。",
    pace: "中（圖像先行）",
    example: "示範句：線往右越走越低，代表斜率是負數，且每格下降 3。",
    tone: "圖像比喻",
    solveIntro: "把公式想成一條線：從 y 軸 7 的位置出發，往右走就往下滑。",
    solveStepsDetailed: [
      "步驟 A：先看正負號，m=-3 代表線往右是下降，不是上升。",
      "步驟 B：看絕對值 3，代表往右 1 格，垂直方向要下 3 格。",
      "步驟 C：從點 (0,7) 出發，往右 1 到 (1,4)，再往右 1 到 (2,1)。",
      "步驟 D：每一段都同樣下降 3，所以斜率固定是 -3。",
    ],
    pitfall: "常見錯誤：只看數字 3 忘了負號，導致把下降線看成上升線。",
    wrapup: "結論：這是一條由左上往右下的線，斜率就是 -3。",
    steps: [
      "步驟 1：先判斷線往右是上升或下降。",
      "步驟 2：看『右 1 格』時 y 改變多少格。",
      "步驟 3：把圖像語言翻成 m 的數值與正負號。",
    ],
  },
  coach: {
    label: "沐晴｜互動引導",
    reply: "我先不給答案，先問你：在 y=-3x+7 裡，哪個數字代表每增加 1 單位 x 時的變化？",
    desc: "適合審題與理解卡關時，透過連續提問讓你自己說出關鍵。",
    useCase: "適用情境：題目常看錯重點、會但講不清楚原因。",
    impact: "預期成效：提升審題精準度與口語化表達能力。",
    pace: "中-快（高互動提問）",
    example: "示範句：你先說 m 是哪個數字？為什麼不是 7？",
    tone: "蘇格拉底提問",
    solveIntro: "我先不直接給答案，先用提問把你帶到正確判斷路線。",
    solveStepsDetailed: [
      "步驟 A：先回答：式子中哪個數字跟 x 綁在一起？（提示：係數）",
      "步驟 B：再回答：當 x 增加 1，y 會跟著怎麼變？",
      "步驟 C：你口頭說一次：因為 x 的係數是 -3，所以斜率是 -3。",
      "步驟 D：我補強觀念：+7 是起始高度（截距），不是變化速度（斜率）。",
    ],
    pitfall: "常見錯誤：答對但無法解釋原因。要能說出「為什麼」才算真正懂。",
    wrapup: "結論：你不只知道答案是 -3，也能完整說出判斷邏輯。",
    steps: [
      "步驟 1：先請你重述題目，確認沒有漏看條件。",
      "步驟 2：用兩個引導問題讓你定位核心概念。",
      "步驟 3：你先作答，我再補強錯誤與記憶口訣。",
    ],
  },
  chart: {
    label: "程析｜圖表解釋",
    reply: "我們把 y 值變化整理成小圖表：x 每 +1，y 每 -3，這個固定差就是斜率 m=-3。",
    desc: "適合需要看趨勢與資料變化的同學，會把公式轉成表格與迷你圖表。",
    useCase: "適用情境：看文字難吸收，喜歡用資料列和圖表抓規律。",
    impact: "預期成效：加快趨勢判讀，強化跨題型遷移能力。",
    pace: "中（圖表拆解）",
    example: "示範句：觀察每一列 y 都固定 -3，因此 Δy/Δx = -3/1。",
    tone: "數據圖表",
    solveIntro: "我們把公式轉成資料表，透過連續差分讀出斜率。",
    solveStepsDetailed: [
      "步驟 A：先列三組資料：x=0,1,2 對應 y=7,4,1。",
      "步驟 B：算相鄰變化：Δx 都是 +1；Δy 都是 -3。",
      "步驟 C：代入斜率公式 m = Δy/Δx = -3/1 = -3。",
      "步驟 D：因為每段比值一致，所以整條線斜率固定為 -3。",
    ],
    pitfall: "常見錯誤：只看單點不看相鄰差，會看不出『固定變化率』。",
    wrapup: "結論：用表格與條帶圖都可驗證斜率是 -3，圖表和公式一致。",
    steps: [
      "步驟 1：列出 x 與 y 的對應表，先看規律。",
      "步驟 2：把『x 增量』與『y 增量』做成視覺條帶。",
      "步驟 3：用 Δy/Δx 回推斜率，確認和方程式一致。",
    ],
  },
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
  if (window.location.hash !== `#${screenKey}`) {
    window.location.hash = screenKey;
  }
  if (screenKey === "summary") renderSummary();
  if (screenKey === "analysis") renderAnalysis();
}

function renderClass() {
  classMastery.style.width = `${state.classMastery}%`;
}

function renderTeacherStyle(styleKey) {
  const style = teacherStyles[styleKey];
  classReply.textContent = style.reply;
  styleTitle.textContent = style.label;
  styleDesc.textContent = style.desc;
  styleUseCase.textContent = style.useCase;
  styleImpact.textContent = style.impact;
  styleSteps.innerHTML = style.steps.map((item) => `<li>${item}</li>`).join("");
  styleExample.textContent = style.example;
  styleKpiName.textContent = style.label;
  styleKpiUseCase.textContent = style.useCase.replace("適用情境：", "");
  styleKpiPace.textContent = style.pace;
  styleKpiImpact.textContent = style.impact.replace("預期成效：", "");
  styleToneTag.textContent = style.tone;
  solveIntro.textContent = style.solveIntro;
  solveSteps.innerHTML = style.solveStepsDetailed.map((item) => `<li>${item}</li>`).join("");
  solvePitfall.textContent = `老師提醒：${style.pitfall}`;
  solveWrapup.textContent = `老師總結：${style.wrapup}`;
  styleChartHint.classList.toggle("hidden", styleKey !== "chart");
}

function renderStyleCompare() {
  const compareRows = Object.values(teacherStyles).map((style) => (
    `<li><b>${style.label}</b>｜${style.useCase.replace("適用情境：", "")}｜節奏：${style.pace}</li>`
  ));
  styleCompareList.innerHTML = compareRows.join("");
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
  if (wrongRank[0][0] === "concept" && hesitationRank[0][1] >= 20) recommend = "程析｜圖表解釋";
  else if (wrongRank[0][0] === "concept" || hesitationRank[0][0] === "concept") recommend = "顧晨｜圖像直覺";
  if (wrongRank[0][0] === "reading") recommend = "沐晴｜互動引導";
  teacherRecommend.textContent = `目前最適合：${recommend}`;

  adviceList.innerHTML = `
    <li>主要弱點：${label[wrongRank[0][0]]}題型，建議先做 10 題同型暖身。</li>
    <li>猶豫時間最長：${label[hesitationRank[0][0]]}題型，改用分步提示法複習。</li>
    <li>下輪測驗建議：先弱項再綜合，完成後回看錯題回放。</li>
  `;
}

function applyInitialScreenFromHash() {
  const hash = window.location.hash.replace("#", "").trim();
  if (!hash || !screens[hash]) return;
  if (hash !== "login") {
    bottomNav.classList.remove("hidden");
  }
  activate(hash);
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
    renderTeacherStyle(tab.dataset.style);
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
renderTeacherStyle("strict");
renderStyleCompare();
renderClass();
renderQuestion();
renderProgress();
applyInitialScreenFromHash();
