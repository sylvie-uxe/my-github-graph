const colors = ['#f5f6f7', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
const energyLevels = ["Take the day off",
                      "Take it easy",
                      "Commit push repeat",
                      "You're doing amazing sweetie",
                      "Commit like your life depends on it"];

const DateTime = luxon.DateTime;
const Duration = luxon.Duration;
const WEEK_STARTS_ON_DAY = 7; // ISO weekday number: 1 is Monday, ..., 7 is Sunday
const daysInAWeek = 7;
const weeksInAYear = 53;
const today = DateTime.local();
let startDate = computeStartDate(today);
let icsFileURL = null;

function generateEvents() {
    const events = [];
    const days = document.getElementsByClassName("day");
    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
        const day = days[dayIndex];
        if (day.getAttribute("data-count") !== "0") {
            const date = DateTime.fromISO(day.getAttribute("data-date"));
            events.push("BEGIN:VEVENT\n");
            events.push("UID:" + date.toMillis() + "@my-github-graph\n");
            events.push("DTSTART;VALUE=DATE:" + date.toFormat("yyyyMMdd") + "\n");
            events.push("SUMMARY:" + energyLevels[parseInt(day.getAttribute("data-count"))] + "\n");
            events.push("END:VEVENT\n");
        }
    }
    return events;
}

function generateCalendarFile() {
    const data = [
        "BEGIN:VCALENDAR\n",
        "METHOD:PUBLISH\n",
        "PRODID:-//My Github Graph//EN\n",
        "VERSION:2.0\n"
    ];
    data.push(...generateEvents());
    data.push("END:VCALENDAR");
    
    const icsFile = new File(data, "my-github-graph.ics", {
        type: "text/calendar"
    });
    if (icsFileURL) {
        window.URL.revokeObjectURL(icsFileURL);
    }
    icsFileURL = window.URL.createObjectURL(icsFile);
    return icsFileURL;
}

function isFirstDayOfWeek(dayIndex) {
    return dayIndex >= 0 && dayIndex < weeksInAYear;
}

function isLastDayOfWeek(dayIndex) {
    return dayIndex >= daysInAWeek * weeksInAYear - weeksInAYear
        && dayIndex < daysInAWeek * weeksInAYear;
}

function isLastWeekDayOfYear(dayIndex) {
    return (dayIndex + 1) % weeksInAYear === 0;
}

function isFirstWeekDayOfYear(dayIndex) {
    return dayIndex % weeksInAYear === 0;
}

function moveUp(currentIndex) {
    if (isFirstDayOfWeek(currentIndex)) {
        return currentIndex + (daysInAWeek - 1) * weeksInAYear;
    }
    return currentIndex - weeksInAYear;
}

function moveDown(currentIndex) {
    if (isLastDayOfWeek(currentIndex)) {
        return currentIndex - (daysInAWeek - 1) * weeksInAYear;
    }
    return currentIndex + weeksInAYear;
}

function moveRight(currentIndex) {
    if (isLastWeekDayOfYear(currentIndex)) {
        return currentIndex - weeksInAYear + 1;
    }
    return currentIndex + 1;
}

function moveLeft(currentIndex) {
    if (isFirstWeekDayOfYear(currentIndex)) {
        return currentIndex + weeksInAYear - 1;
    }
    return currentIndex - 1;
}

function computeStartDate(date) {
    return date.minus( { days: date.weekday % WEEK_STARTS_ON_DAY });
}

function getShortMonthFromDate(date) {
    return date.monthShort;
}

function getLongMonthFromDate(date) {
    return date.monthLong;
}

function resetCalendar() {
    const months = document.getElementsByClassName("month");
    const days = document.getElementsByClassName("day");

    for (let monthIndex = 0; monthIndex < months.length; monthIndex++) {
        months[monthIndex].innerHTML = "";
    }

    for (let weekIndex = 0; weekIndex < weeksInAYear; weekIndex++) {
        for (let dayIndex = 0; dayIndex < daysInAWeek; dayIndex++) {
            const currenDayIndex = weekIndex + dayIndex * weeksInAYear;
            const currentDay = days[currenDayIndex];
            const currentDate = startDate.plus({ days: dayIndex + weekIndex * daysInAWeek });

            if (currentDate < today || currentDate < DateTime.fromISO(document.getElementById("start-date").value)) {
                currentDay.setAttribute("visibility", "hidden");
            } else {
                currentDay.setAttribute("visibility", "visible");
                currentDay.setAttribute("data-date", currentDate.toISODate());
            }

            const endOfMonth = currentDate.endOf("month");
            if (currentDate.weekday === WEEK_STARTS_ON_DAY && currentDate.day >= 1 && currentDate.day <= 7
                || weekIndex === 0 && currentDate < endOfMonth.minus({ days: daysInAWeek })) {
                months[weekIndex].innerHTML = getShortMonthFromDate(currentDate);
                months[weekIndex].setAttribute("aria-label", getLongMonthFromDate(currentDate));
            }
        }
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
        resetCalendar();
    }
}

function hide(element) {
    if (element.classList.contains("visible")) {
        element.classList.remove("visible");
        element.classList.add("hidden");
    }
}

function show(element) {
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
        element.classList.add("visible");
    }
}

function showCursor(index) {
    document.getElementById("energy-cursor").style.transform = "translateX(" + index * 15 + "px)";
    show(document.getElementById("energy-cursor"));
    document.getElementById("energy-label").innerHTML = energyLevels[index];
}

function hideCursor() {
    hide(document.getElementById("energy-cursor"));
}

function updateEnergyLevel(element) {
    let dataCount = element.getAttribute("data-count");
    dataCount = ++dataCount % colors.length;
    element.setAttribute("data-count", dataCount);
    element.setAttribute("fill", colors[dataCount]);
}

window.onload = function () {
    const clearButton = document.getElementById("clear");
    clearButton.onclick = (event) => {
        resetColor();
        hide(document.getElementById("buttonset"));
    }

    document.getElementById("save-as-image").onclick = () => {
        const options = {
            backgroundColor: "#fff",
            encoderOptions: 1,
            scale: 2
        }
        saveSvgAsPng(document.getElementById("calendar"), "my-github-graph.png", options);
    }

    const saveAsCalButton = document.getElementById("save-as-calendar");
    saveAsCalButton.onclick = (event) => {
        event.target.href = generateCalendarFile();
    }

    saveAsCalButton.onkeydown = (event) => {
        switch(event.key) {
            case " ":
                event.target.click();
                break;
            default:
                return;
        }
    }

    initStartDate();
    resetCalendar();

    const days = document.getElementsByClassName("day");
    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
        const currentDay = days[dayIndex];

        currentDay.onclick = () => {
            updateContribution(currentDay);
        }

        currentDay.onkeydown = (event) => {
            let newIndex = dayIndex;
            switch (event.key) {
                case " ":
                case "Enter":
                    updateContribution(currentDay);
                    break;
                case "ArrowRight":
                    do {
                        newIndex = moveRight(newIndex);
                    } while (days[newIndex].getAttribute("visibility") !== "visible");
                    days[newIndex].focus();
                    break;
                case "ArrowLeft":
                    do {
                        newIndex = moveLeft(newIndex);
                    } while (days[newIndex].getAttribute("visibility") !== "visible");
                    days[newIndex].focus();
                    break;
                case "ArrowUp":
                    do {
                        newIndex = moveUp(newIndex);
                    } while (days[newIndex].getAttribute("visibility") !== "visible");
                    days[newIndex].focus();
                    break;
                case "ArrowDown":
                    do {
                        newIndex = moveDown(newIndex);
                    } while (days[newIndex].getAttribute("visibility") !== "visible");
                    days[newIndex].focus(); 
                    break;
                default:
                    return;
            }
        }

        currentDay.onmouseover = () => {
            showCursor(parseInt(currentDay.getAttribute("data-count")));
            showDate(currentDay);
        }

        currentDay.onfocus = () => {
            showCursor(parseInt(currentDay.getAttribute("data-count")));
            showDate(currentDay);
        }

        currentDay.onblur = () => {
            hideCursor();
            hideDate();
        }

        currentDay.onmouseout = () => {
            hideCursor();
            hideDate();
        }
    }

    const levels = document.querySelectorAll("rect.caption");
    for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
        levels[levelIndex].onmouseover = () => {
            showCursor(levelIndex);
        }

        levels[levelIndex].onfocus = () => {
            showCursor(levelIndex);
        }

        levels[levelIndex].onmouseout = () => {
            hideCursor();
        }

        levels[levelIndex].onlbur = () => {
            hideCursor();
        }
    }
}

function updateContribution(day) {
    updateEnergyLevel(day);
    showCursor(parseInt(day.getAttribute("data-count")));
    show(document.getElementById("buttonset"));
}

function hideDate() {
    hide(document.getElementById("hovered-date-label"));
}

function showDate(day) {
    show(document.getElementById("hovered-date-label"));
    document.getElementById("hovered-date").innerHTML = DateTime.fromISO(day.getAttribute("data-date")).toLocaleString(DateTime.DATE_FULL);
}
