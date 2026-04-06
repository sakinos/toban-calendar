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

// 当番の種類（必要に応じて増やせる）
const duties = ["担当"];

// ローテーションの基準日（ここから何週経ったかで順番を決める）
const rotationStartDate = new Date("2026-04-01");


// ====== ロジック部分 ======

// 基準日からの経過週数を計算
function getWeeksSinceStart(date) {
  const diff = date - rotationStartDate;
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
}

// 指定日の週の当番を取得
function getDutyForWeek(date) {
  const weekIndex = getWeeksSinceStart(date);

  return duties
    .map((duty, i) => {
      const person = members[(weekIndex + i) % members.length];
      return `${duty}: ${person}`;
    })
    .join("\n");
}

// カレンダーに表示するイベントを生成
function generateEvents(startDate, months = 3) {
  const events = [];
  const date = new Date(startDate);

  for (let i = 0; i < months * 4; i++) {
    const dutyText = getDutyForWeek(date);

    events.push({
      title: dutyText,
      start: new Date(date),
      allDay: true
    });

    date.setDate(date.getDate() + 7); // 1週間進める
  }

  return events;
}

// ====== カレンダー初期化 ======
document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "ja",
    events: generateEvents(new Date())
  });

  calendar.render();
});
