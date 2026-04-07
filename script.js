// ====== 設定エリア ======

const members = [
  "宮本", "菊永", "梅田", "葛西", "小泉", "武",
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

  // ★ 永続ループが正しく動くように補正
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

// 今日の週の月曜
const today = new Date();
const thisMonday = getMonday(today);


// ====== イベント生成 ======

function generateEvents(startDate, months = 12) {  // ★ 12か月分に拡大
  const events = [];
  const date = new Date(startDate);

  for (let i = 0; i < months * 4; i++) {  // 1か月=4週として計算
    const monday = getMonday(date);
    const dutyText = getDutyForWeek(monday);

    // ① 毎週の月曜に担当者名を表示（全週）
    events.push({
      title: dutyText,
      start: monday,
      allDay: true,
      display: "block",
      classNames: (monday.getTime() === thisMonday.getTime()) ? ["this-week-duty"] : []
    });

    // ② 今週だけ青い帯を出す
    if (monday.getTime() === thisMonday.getTime()) {
      const friday = new Date(monday);
      friday.setDate(monday.getDate() + 4);

      const saturday = new Date(friday);
      saturday.setDate(friday.getDate() + 1);

      events.push({
        start: monday,
        end: saturday,
        display: "background",
        color: "#a3c8ff"
      });
    }

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
    events: generateEvents(new Date(), 12)  // ★ 12か月分生成
  });

  calendar.render();
});
