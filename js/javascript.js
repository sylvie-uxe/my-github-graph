'use strict';

const bgColors = ['#f5f6f7', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
const level0 = 'Take the day off';
const level1 = 'Take it easy';
const level2 = 'Come on, you can do it';
const level3 = 'You\'re doing amazing sweetie';
const level4 = 'Commit like your life depends on it';
const contributions = [level0, level1, level2, level3, level4];

const nbDaysInAWeek = 7;

const table = document.getElementById("year");
const DateTime = luxon.DateTime;
const Duration = luxon.Duration;
const originDate = DateTime.local();

function onCellClick(cell) {
    cell.activityLevel = ++cell.activityLevel % 5;
    cell.style.backgroundColor = bgColors[cell.activityLevel];
    cell.ariaLabel = `${contributions[cell.activityLevel]} on ${cell.date.toLocaleString(DateTime.DATE_MED)}`;
}

function computeOffsetInDays(x, y) {
    return Duration.fromObject({days: x*nbDaysInAWeek + y});
}

function resetCell(cell) {
    cell.activityLevel = 0;
    cell.style.backgroundColor = bgColors[cell.activityLevel];
    cell.ariaLabel = `${contributions[cell.activityLevel]} on ${cell.date.toLocaleString(DateTime.DATE_MED)}`;
}

function getMonthFromDate(date) {
    return date.monthShort();
}

window.onload = function () {
    if(table) {
        for(let y = 1; y < table.rows.length; y++) {
            // table.rows[y].cells[0].innerHTML = y;
            for(let x = 1; x < table.rows[y].cells.length; x++) {
                const cell = table.rows[y].cells[x];
                cell.date = originDate.plus(computeOffsetInDays(x, y));
                resetCell(cell);
                cell.onclick = () => {
                    onCellClick(cell);
                }
            }
        }

        let currentMonth = table.rows[1].cells[1].date.monthShort;
        table.rows[0].cells[1].innerHTML = currentMonth;
        for(let x = 2; x < table.rows[1].cells.length; x++) {
            if(table.rows[1].cells[x].date.monthShort !== currentMonth) {
                currentMonth = table.rows[1].cells[x].date.monthShort;
                table.rows[0].cells[x].innerHTML = currentMonth;
            }
        }
    }
}

function reset() {
    for(let y = 1; y < table.rows.length; y++) {
        for(let x = 1; x < table.rows[y].cells.length; x++) {
            resetCell(table.rows[y].cells[x]);
        }
    }
}