const colors = ['#f5f6f7', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
// const level0 = 'Take the day off';
// const level1 = 'Take it easy';
// const level2 = 'Come on, you can do it';
// const level3 = 'You\'re doing amazing sweetie';
// const level4 = 'Commit like your life depends on it';
// const contributions = [level0, level1, level2, level3, level4];

const DateTime = luxon.DateTime;
const Duration = luxon.Duration;
const WEEK_STARTS_ON_DAY = 7; // ISO weekday number: 1 is Monday, ..., 7 is Sunday
const today = DateTime.local();
let startDate = computeStartDate(today);

function computeStartDate(date) {
    return date.minus( { days: date.weekday % WEEK_STARTS_ON_DAY });
}

// function getMonthFromDate(date) {
//     return date.monthShort();
// }

//         let currentMonth = table.rows[1].cells[1].date.monthShort;
//         table.rows[0].cells[1].innerHTML = currentMonth;
//         for(let x = 2; x < table.rows[1].cells.length; x++) {
//             if(table.rows[1].cells[x].date.monthShort !== currentMonth) {
//                 currentMonth = table.rows[1].cells[x].date.monthShort;
//                 table.rows[0].cells[x].innerHTML = currentMonth;
//             }
//         }

/* <text x="31" y="-8" class="month">Jan</text>
<text x="91" y="-8" class="month">Feb</text>
<text x="151" y="-8" class="month">Mar</text>
<text x="226" y="-8" class="month">Apr</text>
<text x="286" y="-8" class="month">May</text>
<text x="361" y="-8" class="month">Jun</text>
<text x="421" y="-8" class="month">Jul</text>
<text x="481" y="-8" class="month">Aug</text>
<text x="556" y="-8" class="month">Sep</text>
<text x="616" y="-8" class="month">Oct</text>
<text x="676" y="-8" class="month">Nov</text>
<text x="751" y="-8" class="month">Dec</text> */

function toggleColor(element, currentColorIndex) {
    let dataCount = element.getAttribute("data-count");
    dataCount = ++dataCount % colors.length;
    element.setAttribute("data-count", dataCount);
    element.setAttribute("fill", colors[dataCount]);
}

function resetDate() {
    const days = document.getElementsByClassName("day");

    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
        days[dayIndex].setAttribute("data-date", startDate.plus({ days: dayIndex }));
    }
}

function resetColor() {
    const days = document.getElementsByClassName("day");

    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
        days[dayIndex].setAttribute("data-count", 0);
        days[dayIndex].setAttribute("fill", colors[0]);
    }
}

window.onload = function () {
    document.getElementById("start-date").setAttribute("value", today.toISODate());
    document.getElementById("start-date").setAttribute("min", today.toISODate());

    document.getElementById("start-date").onchange = () => {
        startDate = computeStartDate(DateTime.fromISO(document.getElementById("start-date").value));
        resetDate();
    }

    const days = document.getElementsByClassName("day");

    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
        const date = startDate.plus({ days: dayIndex });
        days[dayIndex].setAttribute("data-date", date.toISODate());

        days[dayIndex].onclick = () => {
            if (date < today) {
                document.getElementById("error").innerHTML = "You cannot select this day because it is in the past.";
            } else {
                document.getElementById("error").innerHTML = "";
                toggleColor(days[dayIndex]);
            }
        }
        days[dayIndex].keydown = () => {
            toggleColor(days[dayIndex]);
        }
        days[dayIndex].onmouseover = () => {
            document.getElementById("hovered-date").innerHTML = DateTime.fromISO(days[dayIndex].getAttribute("data-date")).toLocaleString(DateTime.DATE_FULL);
        }
        days[dayIndex].onmouseout = () => {
            document.getElementById("hovered-date").innerHTML = "";
        }
    }
}
