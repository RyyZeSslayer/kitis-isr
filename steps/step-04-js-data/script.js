/* Шаг 04 · рендер дня из данных.
 * Данные: window.SCHEDULE (подключён в index.html из ../../data/schedule.js).
 * Контракт: renderDay(dayIndex) — глобальная, рисует в #app. См. README.md.
 * Подсказки с готовыми кусками кода — в README, раздел «Подсказки». */

function renderDay(dayIndex) {
  var days = SCHEDULE["days"];
  var day = days[dayIndex];
  if (!day || !day["lessons"].length) {
    document.getElementById('app').innerHTML = '<h2 class="day-title"> Пар нет</h2>';
    return;
  }
  var cards = day["lessons"].map(function (l) {
    console.log(l);
    var room = l.room === null ? 'Дистант' : 'ауд. ' + l.room;
    return '<div class="lesson-card">' +
      '<span class="lesson-num">' + l.badge + '</span>' +
      '<div><div class="lesson-subject">' + l.subject + '</div>' +
      '<div class="lesson-meta">' + l.start + '–' + l.end + ' · ' + l.teacher + ' · ' + room + '</div></div>' +
      '</div>';
  }).join('');

  document.getElementById('app').innerHTML = '<h2 class="day-title">' + day.weekday + '</h2>' + cards;


  // TODO 1: возьми день из SCHEDULE.days[dayIndex]
  // TODO 2: если дня нет или lessons пуст → «Пар нет» в #app, выход
  // TODO 3: собери HTML карточек (.lesson-card, .lesson-num = badge; room null → «Дистант»)
  // TODO 4: вставь заголовок дня (weekday) + карточки в #app через innerHTML
}

// TODO 5: при открытии страницы покажи понедельник
// renderDay(0);

renderDay(0);