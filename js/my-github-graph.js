const colors = ['#f5f6f7', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
const energyLevels = ["take the day off",
                      "take it easy",
                      "commit push repeat",
                      "you're doing amazing sweetie",
                      "commit like your life depends on it"];

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

function initDay(days, dayIndex) {
    const date = startDate.plus({ days: dayIndex });
    if (date < today || date < DateTime.fromISO(document.getElementById("start-date").value)) {
        days[dayIndex].setAttribute("visibility", "hidden");
    } else {
        days[dayIndex].setAttribute("visibility", "visible");
        days[dayIndex].setAttribute("data-date", date.toISODate());
    }

    const endOfMonth = date.endOf("month");
    if ((date.weekday === WEEK_STARTS_ON_DAY && date.day >= 1 && date.day <= 7)
        || dayIndex === 0 && date < endOfMonth.minus({ days: 7 })) {
        const month = getMonthFromDate(date);
        days[dayIndex].parentNode.firstElementChild.innerHTML = month;
    }
}

function initCalendar() {
    const months = document.getElementsByClassName("month");
    const days = document.getElementsByClassName("day");

    for (let monthIndex = 0; monthIndex < months.length; monthIndex++) {
        months[monthIndex].innerHTML = "";
    }

    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
        initDay(days, dayIndex);
    }
}

function resetColor() {
    const days = document.getElementsByClassName("day");

    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
        days[dayIndex].setAttribute("data-count", 0);
        days[dayIndex].setAttribute("fill", colors[0]);
    }
}

function initStartDate() {
    document.getElementById("start-date").setAttribute("value", today.toISODate());
    document.getElementById("start-date").setAttribute("min", today.toISODate());

    document.getElementById("start-date").onchange = () => {
        startDate = computeStartDate(DateTime.fromISO(document.getElementById("start-date").value));
        initCalendar();
    }
}

function hideClearButton() {
    const clearButton = document.getElementById("clear");
    if (clearButton.className === "hidden") {
        clearButton.className = "visible";
    }
}

window.onload = function () {
    const clearButton = document.getElementById("clear");
    clearButton.onclick = (event) => {
        resetColor();
        if (event.target.clientX != 0) {
            event.target.blur();
        }
        clearButton.className = "hidden";
    }

    initStartDate();

    const days = document.getElementsByClassName("day");
    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
        const day = days[dayIndex];

        initDay(days, dayIndex);

        day.onclick = () => {
            toggleColor(day);
            hideClearButton();
            document.getElementById("hovered-date").classList.remove("hidden");
            document.getElementById("hovered-date").classList.add("visible");
            document.getElementById("energy-level").classList.remove("hidden");
            document.getElementById("energy-level").classList.add("visible");
            document.getElementById("hovered-date").innerHTML = DateTime.fromISO(day.getAttribute("data-date")).toLocaleString(DateTime.DATE_FULL);
            document.getElementById("energy-level").innerHTML = energyLevels[parseInt(day.getAttribute("data-count"))];
        }
        day.onmouseover = () => {
            document.getElementById("hovered-date").classList.remove("hidden");
            document.getElementById("hovered-date").classList.add("visible");
            document.getElementById("energy-level").classList.remove("hidden");
            document.getElementById("energy-level").classList.add("visible");
            document.getElementById("hovered-date").innerHTML = DateTime.fromISO(day.getAttribute("data-date")).toLocaleString(DateTime.DATE_FULL);
            document.getElementById("energy-level").innerHTML = energyLevels[parseInt(day.getAttribute("data-count"))];
        }
        day.onmouseout = () => {
            document.getElementById("hovered-date").classList.remove("visible");
            document.getElementById("hovered-date").classList.add("hidden");
            document.getElementById("energy-level").classList.remove("visible");
            document.getElementById("energy-level").classList.add("hidden");
            document.getElementById("hovered-date").innerHTML = "";
            document.getElementById("energy-level").innerHTML = "";
        }
    }

    const levels = document.querySelectorAll("rect.caption");
    for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
        levels[levelIndex].onmouseover = () => {
            document.getElementById("energy-level").classList.remove("hidden");
            document.getElementById("energy-level").classList.add("visible");
            document.getElementById("energy-level").innerHTML = energyLevels[levelIndex];
        }

        levels[levelIndex].onmouseout = () => {
            document.getElementById("energy-level").classList.remove("visible");
            document.getElementById("energy-level").classList.add("hidden");
            document.getElementById("energy-level").innerHTML = "";
        }
    }
}
