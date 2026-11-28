/* Шаг 05 · дни, избранное, таймер. Контракт — в README.md.
 * Перенеси сюда свой renderDay из шага 4 (данные SCHEDULE уже подключены в index.html). */

var FAV_KEY = 'kitis-de:fav';
var GROUP = 'ИСр24-1';

// TODO 1: renderDay(dayIndex) — из шага 4 (.lesson-card, .lesson-num = badge, «Дистант», «Пар нет»).

function renderDay(dayIndex) {
    var days = SCHEDULE["days"];
    var day = days[dayIndex];
    if (!day || !day["lessons"].length) {
        document.getElementById('app').innerHTML = '<h2 class="day-title"> Пар нет</h2>';
        return;
    }
    var cards = day["lessons"].map(function (l) {
        var room = l.room === null ? 'Дистант' : 'ауд. ' + l.room;
        return '<div class="lesson-card">' +
            '<span class="lesson-num">' + l.badge + '</span>' +
            '<div><div class="lesson-subject">' + l.subject + '</div>' +
            '<div class="lesson-meta">' + l.start + '–' + l.end + ' · ' + l.teacher + ' · ' + room + '</div></div>' +
            '</div>';
    }).join('');

    document.getElementById('app').innerHTML = '<h2 class="day-title">' + day.weekday + '</h2>' + cards;
}

// TODO 2: selectDay(i): снять .active со всех .day-btn, поставить нужной, вызвать renderDay(i).
document.querySelectorAll(".day-btn").forEach((btn) => {
    btn.addEventListener('click', e => {
        var day = btn.getAttribute("data-day");
        selectDay(day);
        btn.classList.add("active");
    });
})

function selectDay(i) {
    removeClass();
    document.querySelectorAll(".day-btn").forEach((btn) => {
        if (btn.getAttribute("data-day") == i) {
            btn.classList.add("active");
        }
    })
    renderDay(i);
    tick(i);
}

function removeClass() {
    document.querySelectorAll(".day-btn").forEach((btn) => {
        btn.classList.remove("active");
    });
}

// TODO 3: клики по .day-btn: querySelectorAll + forEach + addEventListener('click', …).
//         Номер дня бери из btn.dataset.day (это строка → Number(...)).


document.addEventListener("DOMContentLoaded", e => {
    let state = localStorage.getItem(FAV_KEY);
    var doc = document.getElementById("fav-btn");
    if (state) {
        doc.setAttribute("aria-pressed", true);
    } else {
        doc.setAttribute("aria-pressed", false);
    }

    doc.addEventListener("click", e => {
        if (state === GROUP) {
            localStorage.removeItem(FAV_KEY);
            doc.setAttribute("aria-pressed", false);
        } else {
            localStorage.setItem(FAV_KEY, GROUP);
            doc.setAttribute("aria-pressed", true);
        }
    });

    getNow();
    setInterval(tick(), 1000);
});

// TODO 4: избранное:
//   клик по #fav-btn: если localStorage[FAV_KEY] === GROUP → removeItem, иначе setItem(FAV_KEY, GROUP);
//   обнови aria-pressed и текст кнопки («★ В избранном» / «☆ В избранное»);
//   при загрузке восстанови состояние из localStorage.

function getNow() {
    let day = getDates().getDay() - 1;
    if (day < 0) {
        day = 6
    }
    selectDay(day);
}

function getDates() {
    let now = new URLSearchParams(location.search).get("now");
    let date;
    if (now) {
        date = new Date(now);
    } else {
        date = new Date();
    }
    return date;
}
// TODO 5: время:
//   getNow(): ?now=YYYY-MM-DDTHH:MM из адреса → new Date(строка), иначе new Date();
//   при загрузке с ?now: открой день, чья date совпадает с датой now (сравнивай локальные
//   год-месяц-день, не toISOString — часовой пояс сдвинет дату);




function tick(i) {
    const date = getDates();
    let schedule = SCHEDULE["bells"];
    if (date.getDay() - 1 != i) return;
    if (date.getDay() - 1 == 0) {
        bells = schedule["monday"];
        // bells.unshift(schedule["curator"]);
        forArray(date, bells);
    } else {
        forArray(date, schedule["other"]);
    }
    timer(date, i)
}

function forArray(date, arr) {
    for (let i = 0; i < arr.length; i++) {
        let start = TimeInMinutes(arr[i][0]);
        let end = TimeInMinutes(arr[i][1]);
        let time = +date.getHours() * 60 + +date.getMinutes();
        // console.log(start + " " + time + " " + end)
        if (start <= time && time < end) {
            cardEdit(i);
        }
    }
}

function cardEdit(i) {
    let num = 0;
    document.querySelectorAll(".lesson-card").forEach(card => {
        card.classList.remove("current");
        if (num == i) {
            card.classList.add("current");
        }
        num++;
    });
}

function TimeInMinutes(str) {
    let arr = str.split(":");
    return +arr[0] * 60 + +arr[1];
}

//   tick(): сними .current со всех карточек; найди пару, где start <= сейчас < end
//   (переведи «ЧЧ:ММ» в минуты: h*60+m); повесь .current на её карточку;

function timer(date, i) {
    const elem = document.getElementById("timer");
    let schedule = SCHEDULE["bells"];
    if (getDates().getDay() - 1 == 0) {
        bells = schedule["monday"]
        bells.unshift(schedule["curator"])
    } else {
        bells = schedule["other"];
    }
    for (let n = 0; n < bells.length; n++) {
        let times = bells[n];
        let start = TimeInMinutes(times[0]);
        let end = TimeInMinutes(times[1]);
        let time = +date.getHours() * 60 + +date.getMinutes();
        if (start <= time && time < end) {
            // console.log(bells);
            // console.log(times[0] + " " + time + " " + times[1])
            // console.log(start + " " + time + " " + end)
            // console.log((end - time));
            elem.innerHTML = `<a>До конца пары ${Math.ceil(end - time)} мин</a>`;
            return;
        } else {
            elem.innerHTML = 'Сейчас перемена';
        }
    }
}



//   #timer = 'До конца пары: ' + Math.ceil((конец - сейчас) / 60000) + ' мин';
//   setInterval(tick, 1000).

// TODO 6: старт: без ?now — selectDay(0); с ?now — день из now. Восстанови избранное. Запусти tick.
