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

function getMonthFromDate(date) {
    return date.monthShort;
}

function toggleColor(element) {
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
        const day = days[dayIndex];
        const date = startDate.plus({ days: dayIndex });
        day.setAttribute("data-date", date.toISODate());

        if (date.weekday === WEEK_STARTS_ON_DAY && date.day >= 1 && date.day <= 7) {
            const month = getMonthFromDate(date);
            let textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
            textElement.setAttribute("class", "month");
            textElement.setAttribute("y", "-8");
            textElement.innerHTML = month;
            day.parentNode.appendChild(textElement);
        }

        day.onclick = () => {
            if (date < today) {
                document.getElementById("error").innerHTML = "You cannot select this day because it is in the past.";
            } else {
                document.getElementById("error").innerHTML = "";
                toggleColor(day);
            }
        }
        day.keydown = () => {
            toggleColor(day);
        }
        day.onmouseover = () => {
            document.getElementById("hovered-date").innerHTML = DateTime.fromISO(day.getAttribute("data-date")).toLocaleString(DateTime.DATE_FULL);
        }
        day.onmouseout = () => {
            document.getElementById("hovered-date").innerHTML = "";
        }
    }
}
