// ====== 設定エリア ======

// メンバー（ここを書き換えるだけで人数変更OK）
const members = [
  "宮本",
  "菊永",
  "梅田",
  "葛西",
  "小泉",
  "武",
  "豊嶋",
  "高畑",
  "野口",
  "堀",
  "まき",
  "山崎"
];

// 当番の種類
const duties = ["担当"];

// ローテーションの基準日
const rotationStartDate = new Date("2026-04-01");


// ====== ロジック部分 ======

// 基準日からの経過週数
function getWeeksSinceStart(date) {
  const diff = date - rotationStartDate;
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
}

// 指定週の当番名を取得
function getDutyForWeek(date) {
  const weekIndex = getWeeksSinceStart(date);

  return duties
    .map((duty, i) => {
      const person = members[(weekIndex + i) % members.length];
      return `${duty}: ${person}`;
    })
    .join("\n");
}

// 月曜の日付を取得
function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // 日曜なら -6
  date.setDate(date.getDate() + diff);
  return date;
}

// カレンダーイベント生成
function generateEvents(startDate, months = 3) {
  const events = [];
  const date = new Date(startDate);

  for (let i = 0; i < months * 4; i++) {
    const monday = getMonday(date);
    const dutyText = getDutyFor
