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
let icsFileURL = null;

function generateEvents() {
    const events = [];
    const days = document.getElementsByClassName("day");
    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
        const day = days[dayIndex];
        if (day.getAttribute("data-count") !== "0") {
            const date = DateTime.fromISO(day.getAttribute("data-date"));
            if (events.length === 0) {
                console.log("Empty array = ", events);
                events[0] = "BEGIN:VEVENT\n";
            } else {
                console.log("Not empty array = ", events);
                events.push["BEGIN:VEVENT\n"];
            }
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
        console.log("Revoke URL");
    }
    console.log("Create URL");
    icsFileURL = window.URL.createObjectURL(icsFile);
    return icsFileURL;
}

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

window.onload = function () {
    const clearButton = document.getElementById("clear");
    clearButton.onclick = (event) => {
        resetColor();
        if (event.target.clientX != 0) {
            event.target.blur();
        }
        hide(document.getElementById("toolbar"));
    }

    document.getElementById("save-as-image").onclick = () => {
        const options = {
            backgroundColor: "#fff",
            encoderOptions: 1
        }
        saveSvgAsPng(document.getElementById("calendar"), "my-github-graph.png", options);
    }

    document.getElementById("save-as-calendar").onclick = () => {
        const downloadLink = document.getElementById("download-link");
        downloadLink.setAttribute("href", generateCalendarFile());
    }

    initStartDate();

    const days = document.getElementsByClassName("day");
    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
        const day = days[dayIndex];

        initDay(days, dayIndex);

        day.onclick = () => {
            toggleColor(day);
            show(document.getElementById("toolbar"));
            show(document.getElementById("hovered-date-label"));
            show(document.getElementById("energy-level-label"));
            document.getElementById("hovered-date").innerHTML = DateTime.fromISO(day.getAttribute("data-date")).toLocaleString(DateTime.DATE_FULL);
            document.getElementById("energy-level").innerHTML = energyLevels[parseInt(day.getAttribute("data-count"))];
        }
        day.onmouseover = () => {
            show(document.getElementById("hovered-date-label"));
            document.getElementById("hovered-date").innerHTML = DateTime.fromISO(day.getAttribute("data-date")).toLocaleString(DateTime.DATE_FULL);
            document.getElementById("energy-level").innerHTML = energyLevels[parseInt(day.getAttribute("data-count"))];
        }
        day.onmouseout = () => {
            hide(document.getElementById("hovered-date-label"));
            hide(document.getElementById("energy-level-label"));
        }
    }

    const levels = document.querySelectorAll("rect.caption");
    for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
        levels[levelIndex].onmouseover = () => {
            show(document.getElementById("energy-level-label"));
            document.getElementById("energy-level").innerHTML = energyLevels[levelIndex];
        }

        levels[levelIndex].onmouseout = () => {
            hide(document.getElementById("energy-level-label"));
        }
    }
}
