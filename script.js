// ====== 設定エリア ======

const members = [
  "宮本","宮本", "菊永", "梅田", "葛西", "小泉", "武",
  "豊嶋", "高畑", "野口", "堀", "まき", "山崎"
];

const duties = ["担当"];

const rotationStartDate = new Date("2026-04-01");


// ====== ロジック部分 ======

function getWeeksSinceStart(date) {
  const diff = date - rotationStartDate;
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
}

function getDutyForWeek(date) {
  const weekIndex = getWeeksSinceStart(date);

  // 永続ループ補正（負の週でも正しく回る）
  const personIndex = ((weekIndex % members.length) + members.length) % members.length;
  const person = members[personIndex];

  return `担当: ${person}`;
}

function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  return date;
}


// ====== イベント生成 ======

function generateEvents(startDate, months = 12) {  // ← 1年分生成
  const events = [];
  const date = new Date(startDate);

  for (let i = 0; i < months * 4; i++) {  // 1か月=4週として計算
    const monday = getMonday(date);
    const dutyText = getDutyForWeek(monday);

    // ① 毎週の月曜に担当者名を表示
    events.push({
      title: dutyText,
      start: monday,
      allDay: true,
      display: "block"
    });

    // ② 毎週の月曜〜金曜に青帯をかける（絶対にズレない安定版）
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4); // 月曜 +4 = 金曜

    // ★ 土曜 0:00 を end にする（FullCalendar は end の前日まで塗る）
    const saturday = new Date(
      friday.getFullYear(),
      friday.getMonth(),
      friday.getDate() + 1,
      0, 0, 0
    );

    events.push({
      start: monday,
      end: saturday,
      display: "background",
      color: "#a3c8ff"
    });

    // 次の週へ
    date.setDate(date.getDate() + 7);
  }

  return events;
}


// ====== カレンダー初期化 ======

document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "ja",
    firstDay: 1,
    events: generateEvents(new Date(), 12)  // ← 1年分生成
  });

  calendar.render();
});
