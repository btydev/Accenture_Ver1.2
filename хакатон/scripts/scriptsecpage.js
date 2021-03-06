const ctx = document.getElementById("myChart").getContext("2d");
let delayed;
let gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, "rgba(65, 0, 0, 0.59)");
gradient.addColorStop(1, "rgba(214, 0, 0, 0.59)");

const labels = [
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",

];

const data = {
    labels,
    datasets: [
        {
            type: 'line',
            label: 'Фактическое',
            data: [10, 12, 25, 42, 27, 52, 40, 58],
            fill: false,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgb(54, 162, 235)',
            hoverRadius: 15,

        },
        {
            type: 'bar',
            label: 'Необходимое',
            data: [16, 20, 30, 40, 50, 60, 50, 58],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'red'
        },]
};

const config = {
    type: "line",
    data: data,
    options: {
        responsive: true,
        radius: 4,
        hoverRadius: 15,
        animation: {
            onComplete: () => {
                delayed = true;
            },
            delay: (context) => {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default' && !delayed) {
                    delay = context.dataIndex * 300 + context.datasetIndex * 100;
                }
                return delay;
            },
        },
    }
};

const myChart = new Chart(ctx, config);










$("#zero_li").on("click", function () {
    $(this).toggleClass("underline");
    $("#first_li, #second_li, #third_li, #fourth_li").removeClass("underline");
});
$("#first_li").on("click", function () {
    $(this).toggleClass("underline");
    $("#second_li, #third_li, #fourth_li, #zero_li").removeClass("underline");
});
$("#second_li").on("click", function () {
    $(this).toggleClass("underline");
    $("#first_li, #third_li, #fourth_li, #zero_li").removeClass("underline");
});
$("#third_li").on("click", function () {
    $(this).toggleClass("underline");
    $("#first_li, #second_li, #fourth_li, #zero_li").removeClass("underline");
});
$("#fourth_li").on("click", function () {
    $(this).toggleClass("underline");
    $("#first_li, #third_li, #second_li, #zero_li").removeClass("underline");
});


function getWeekNumber(date) {
    const firstDayOfTheYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfTheYear) / 86400000;

    return Math.ceil((pastDaysOfYear + firstDayOfTheYear.getDay() + 1) / 7)
}

function isLeapYear(year) {
    return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
}

class Day {
    constructor(date = null, lang = 'default') {
        date = date ?? new Date();

        this.Date = date;
        this.date = date.getDate();
        this.day = date.toLocaleString(lang, { weekday: 'long' });
        this.dayNumber = date.getDay() + 1;
        this.dayShort = date.toLocaleString(lang, { weekday: 'short' });
        this.year = date.getFullYear();
        this.yearShort = date.toLocaleString(lang, { year: '2-digit' });
        this.month = date.toLocaleString(lang, { month: 'long' });
        this.monthShort = date.toLocaleString(lang, { month: 'short' });
        this.monthNumber = date.getMonth() + 1;
        this.timestamp = date.getTime();
        this.week = getWeekNumber(date);
    }

    get isToday() {
        return this.isEqualTo(new Date());
    }

    isEqualTo(date) {
        date = date instanceof Day ? date.Date : date;

        return date.getDate() === this.date &&
            date.getMonth() === this.monthNumber - 1 &&
            date.getFullYear() === this.year;
    }

    format(formatStr) {
        return formatStr
            .replace(/\bYYYY\b/, this.year)
            .replace(/\bYYY\b/, this.yearShort)
            .replace(/\bWW\b/, this.week.toString().padStart(2, '0'))
            .replace(/\bW\b/, this.week)
            .replace(/\bDDDD\b/, this.day)
            .replace(/\bDDD\b/, this.dayShort)
            .replace(/\bDD\b/, this.date.toString().padStart(2, '0'))
            .replace(/\bD\b/, this.date)
            .replace(/\bMMMM\b/, this.month)
            .replace(/\bMMM\b/, this.monthShort)
            .replace(/\bMM\b/, this.monthNumber.toString().padStart(2, '0'))
            .replace(/\bM\b/, this.monthNumber)
    }
}

class Month {
    constructor(date = null, lang = 'default') {
        const day = new Day(date, lang);
        const monthsSize = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.lang = lang;

        this.name = day.month;
        this.number = day.monthNumber;
        this.year = day.year;
        this.numberOfDays = monthsSize[this.number - 1];

        if (this.number === 2) {
            this.numberOfDays += isLeapYear(day.year) ? 1 : 0;
        }

        this[Symbol.iterator] = function* () {
            let number = 1;
            yield this.getDay(number);
            while (number < this.numberOfDays) {
                ++number;
                yield this.getDay(number);
            }
        }
    }

    getDay(date) {
        return new Day(new Date(this.year, this.number - 1, date), this.lang);
    }
}

class Calendar {
    weekDays = Array.from({ length: 7 });

    constructor(year = null, monthNumber = null, lang = 'default') {
        this.today = new Day(null, lang);
        this.year = year ?? this.today.year;
        this.month = new Month(new Date(this.year, (monthNumber || this.today.monthNumber) - 1), lang);
        this.lang = lang;

        this[Symbol.iterator] = function* () {
            let number = 1;
            yield this.getMonth(number);
            while (number < 12) {
                ++number;
                yield this.getMonth(number);
            }
        }

        this.weekDays.forEach((_, i) => {
            const day = this.month.getDay(i + 1);
            if (!this.weekDays.includes(day.day)) {
                this.weekDays[day.dayNumber - 1] = day.day
            }
        })
    }

    get isLeapYear() {
        return isLeapYear(this.year);
    }

    getMonth(monthNumber) {
        return new Month(new Date(this.year, monthNumber - 1), this.lang);
    }

    getPreviousMonth() {
        if (this.month.number === 1) {
            return new Month(new Date(this.year - 1, 11), this.lang);
        }

        return new Month(new Date(this.year, this.month.number - 2), this.lang);
    }

    getNextMonth() {
        if (this.month.number === 12) {
            return new Month(new Date(this.year + 1, 0), this.lang);
        }

        return new Month(new Date(this.year, this.month.number + 2), this.lang);
    }

    goToDate(monthNumber, year) {
        this.month = new Month(new Date(year, monthNumber - 1), this.lang);
        this.year = year;
    }

    goToNextYear() {
        this.year += 1;
        this.month = new Month(new Date(this.year, 0), this.lang);
    }

    goToPreviousYear() {
        this.year -= 1;
        this.month = new Month(new Date(this.year, 11), this.lang);
    }

    goToNextMonth() {
        if (this.month.number === 12) {
            return this.goToNextYear();
        }

        this.month = new Month(new Date(this.year, (this.month.number + 1) - 1), this.lang);
    }

    goToPreviousMonth() {
        if (this.month.number === 1) {
            return this.goToPreviousYear();
        }

        this.month = new Month(new Date(this.year, (this.month.number - 1) - 1), this.lang);
    }
}

class DatePicker extends HTMLElement {
    format = 'MMM DD, YYYY';
    position = 'bottom';
    visible = false;
    date = null;
    mounted = false;
    // elements
    toggleButton = null;
    calendarDropDown = null;
    calendarDateElement = null;
    calendarDaysContainer = null;
    selectedDayElement = null;

    constructor() {
        super();

        const lang = window.navigator.language;
        const date = new Date(this.date ?? (this.getAttribute("date") || Date.now()));

        this.shadow = this.attachShadow({ mode: "open" });
        this.date = new Day(date, lang);
        this.calendar = new Calendar(this.date.year, this.date.monthNumber, lang);

        this.format = this.getAttribute('format') || this.format;
        this.position = DatePicker.position.includes(this.getAttribute('position'))
            ? this.getAttribute('position')
            : this.position;
        this.visible = this.getAttribute('visible') === ''
            || this.getAttribute('visible') === 'true'
            || this.visible;

        this.render();
    }

    connectedCallback() {
        this.mounted = true;

        this.toggleButton = this.shadow.querySelector('.date-toggle');
        this.calendarDropDown = this.shadow.querySelector('.calendar-dropdown');
        const [prevBtn, calendarDateElement, nextButton] = this.calendarDropDown
            .querySelector('.header').children;
        this.calendarDateElement = calendarDateElement;
        this.calendarDaysContainer = this.calendarDropDown.querySelector('.month-days');

        this.toggleButton.addEventListener('click', () => this.toggleCalendar());
        prevBtn.addEventListener('click', () => this.prevMonth());
        nextButton.addEventListener('click', () => this.nextMonth());
        document.addEventListener('click', (e) => this.handleClickOut(e));

        this.renderCalendarDays();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.mounted) return;

        switch (name) {
            case "date":
                this.date = new Day(new Date(newValue));
                this.calendar.goToDate(this.date.monthNumber, this.date.year);
                this.renderCalendarDays();
                this.updateToggleText();
                break;
            case "format":
                this.format = newValue;
                this.updateToggleText();
                break;
            case "visible":
                this.visible = ['', 'true', 'false'].includes(newValue)
                    ? newValue === '' || newValue === 'true'
                    : this.visible;
                this.toggleCalendar(this.visible);
                break;
            case "position":
                this.position = DatePicker.position.includes(newValue)
                    ? newValue
                    : this.position;
                this.calendarDropDown.className =
                    `calendar-dropdown ${this.visible ? 'visible' : ''} ${this.position}`;
                break;
        }
    }

    toggleCalendar(visible = null) {
        if (visible === null) {
            this.calendarDropDown.classList.toggle('visible');
        } else if (visible) {
            this.calendarDropDown.classList.add('visible');
        } else {
            this.calendarDropDown.classList.remove('visible');
        }

        this.visible = this.calendarDropDown.className.includes('visible');

        if (this.visible) {
            this.calendarDateElement.focus();
        } else {
            this.toggleButton.focus();

            if (!this.isCurrentCalendarMonth()) {
                this.calendar.goToDate(this.date.monthNumber, this.date.year);
                this.renderCalendarDays();
            }
        }
    }

    prevMonth() {
        this.calendar.goToPreviousMonth();
        this.renderCalendarDays();
    }

    nextMonth() {
        this.calendar.goToNextMonth();
        this.renderCalendarDays();
    }

    updateHeaderText() {
        this.calendarDateElement.textContent =
            `${this.calendar.month.name}, ${this.calendar.year}`;
        const monthYear = `${this.calendar.month.name}, ${this.calendar.year}`
        this.calendarDateElement
            .setAttribute('aria-label', `current month ${monthYear}`);
    }

    isSelectedDate(date) {
        return date.date === this.date.date &&
            date.monthNumber === this.date.monthNumber &&
            date.year === this.date.year;
    }

    isCurrentCalendarMonth() {
        return this.calendar.month.number === this.date.monthNumber &&
            this.calendar.year === this.date.year;
    }

    selectDay(el, day) {
        if (day.isEqualTo(this.date)) return;

        this.date = day;

        if (day.monthNumber !== this.calendar.month.number) {
            this.prevMonth();
        } else {
            el.classList.add('selected');
            this.selectedDayElement.classList.remove('selected');
            this.selectedDayElement = el;
        }

        this.toggleCalendar();
        this.updateToggleText();
    }

    handleClickOut(e) {
        if (this.visible && (this !== e.target)) {
            this.toggleCalendar(false);
        }
    }

    getWeekDaysElementStrings() {
        return this.calendar.weekDays
            .map(weekDay => `<span>${weekDay.substring(0, 3)}</span>`)
            .join('');
    }

    getMonthDaysGrid() {
        const firstDayOfTheMonth = this.calendar.month.getDay(1);
        const prevMonth = this.calendar.getPreviousMonth();
        const totalLastMonthFinalDays = firstDayOfTheMonth.dayNumber - 1;
        const totalDays = this.calendar.month.numberOfDays + totalLastMonthFinalDays;
        const monthList = Array.from({ length: totalDays });

        for (let i = totalLastMonthFinalDays; i < totalDays; i++) {
            monthList[i] = this.calendar.month.getDay(i + 1 - totalLastMonthFinalDays)
        }

        for (let i = 0; i < totalLastMonthFinalDays; i++) {
            const inverted = totalLastMonthFinalDays - (i + 1);
            monthList[i] = prevMonth.getDay(prevMonth.numberOfDays - inverted);
        }

        return monthList;
    }

    updateToggleText() {
        const date = this.date.format(this.format)
        this.toggleButton.textContent = date;
    }

    updateMonthDays() {
        this.calendarDaysContainer.innerHTML = '';

        this.getMonthDaysGrid().forEach(day => {
            const el = document.createElement('button');
            el.className = 'month-day';
            el.textContent = day.date;
            el.addEventListener('click', (e) => this.selectDay(el, day));
            el.setAttribute('aria-label', day.format(this.format));

            if (day.monthNumber === this.calendar.month.number) {
                el.classList.add('current');
            }

            if (this.isSelectedDate(day)) {
                el.classList.add('selected');
                this.selectedDayElement = el;
            }

            this.calendarDaysContainer.appendChild(el);
        })
    }

    renderCalendarDays() {
        this.updateHeaderText();
        this.updateMonthDays();
        this.calendarDateElement.focus();
    }

    static get observedAttributes() {
        return ['date', 'format', 'visible', 'position'];
    }

    static get position() {
        return ['top', 'left', 'bottom', 'right'];
    }

    get style() {
        return `
        :host {
          position: relative;
          font-family: 'Roboto', sans-serif;
        }
        
        .date-toggle {
          padding: 8px 15px;
          border: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background: #eee;
          color: #333;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          text-transform: capitalize;
        }
        
        .calendar-dropdown {
          margin-left: 100px;
          display: none;
          width: 300px;
          height: 300px;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translate(-50%, 8px);
          padding: 20px;
          background: #fff;
          border-radius: 5px;
          box-shadow: 0 0 8px rgba(0,0,0,0.2);
        }
        
        .calendar-dropdown.top {
          top: auto;
          bottom: 100%;
          transform: translate(-50%, -8px);
        }
        
        .calendar-dropdown.left {
          top: 50%;
          left: 0;
          transform: translate(calc(-8px + -100%), -50%);
        }
        
        .calendar-dropdown.right {
          top: 50%;
          left: 100%;
          transform: translate(8px, -50%);
        }
        
        .calendar-dropdown.visible {
          display: block;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0 30px;
        }
        
        .header h4 {
          margin: 0;
          text-transform: capitalize;
          font-size: 21px;
          font-weight: bold;
        }
        
        .header button {
          padding: 0;
          border: 8px solid transparent;
          width: 0;
          height: 0;
          border-radius: 2px;
          border-top-color: #222;
          transform: rotate(90deg);
          cursor: pointer;
          background: none;
          position: relative;
        }
        
        .header button::after {
          content: '';
          display: block;
          width: 25px;
          height: 25px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        
        .header button:last-of-type {
          transform: rotate(-90deg);
        }
        
        .week-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-gap: 5px;
          margin-bottom: 10px;
        }
        
        .week-days span {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 10px;
          text-transform: capitalize;
        }
        
        .month-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-gap: 5px;
        }
        
        .month-day {
          padding: 8px 5px;
          background: #c7c9d3;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 2px;
          cursor: pointer;
          border: none;
        }
        
        .month-day.current {
          background: #444857;
        }
        
        .month-day.selected {
          background: #28a5a7;
          color: #ffffff;
        }
        
        .month-day:hover {
          background: #34bd61;
        }
      `;
    }

    render() {
        const monthYear = `${this.calendar.month.name}, ${this.calendar.year}`;
        const date = this.date.format(this.format)
        this.shadow.innerHTML = `
        <style>${this.style}</style>
        <button type="button" class="date-toggle">${date}</button>
        <div class="calendar-dropdown ${this.visible ? 'visible' : ''} ${this.position}">
          <div class="header">
              <button type="button" class="prev-month" aria-label="previous month"></button>
              <h4 tabindex="0" aria-label="current month ${monthYear}">
                ${monthYear}
              </h4>
              <button type="button" class="prev-month" aria-label="next month"></button>
          </div>
          <div class="week-days">${this.getWeekDaysElementStrings()}</div>
          <div class="month-days"></div>
        </div>
      `
    }
}

customElements.define("date-picker", DatePicker);

$("#btns").on("click", function () {
    $("#seacrhin").toggleClass("dispnone");
});


$(".progress").each(function () {

    var $bar = $(this).find(".bar");
    var $val = $(this).find("span");
    var perc = parseInt($val.text(), 10);

    $({ p: 0 }).animate({ p: perc }, {
        duration: 3000,
        easing: "swing",
        step: function (p) {
            $bar.css({
                transform: "rotate(" + (45 + (p * 1.8)) + "deg)", // 100%=180° so: ° = % * 1.8
                // 45 is to add the needed rotation to have the green borders at the bottom
            });
            $val.text(p | 0);
        }
    });
});




////////////////////////////////////////////////




// Return with commas in between
var numberWithCommas = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

var dataPack1 = [40, 47, 44, 38, 27];
var dataPack2 = [20, 22, 37, 15, 24];
var dates = ["September", "November", "October", "December"];

var bar_ctx = document.getElementById('bar-chart');

var bar_chart = new Chart(bar_ctx, {
    type: 'bar',
    data: {
        labels: dates,
        datasets: [
            {
                label: 'Необходимо',
                data: dataPack1,
                backgroundColor: "#512DA8",
                hoverBackgroundColor: "#7E57C2",
                hoverBorderWidth: 1
            },
            {
                label: 'Фактическое',
                data: dataPack2,
                backgroundColor: "#FFA000",
                hoverBackgroundColor: "#FFCA28",
                hoverBorderWidth: 1
            },
        ]
    },
    options: {
        animation: {
            duration: 10,
        },
        tooltips: {
            mode: 'label',
            callbacks: {
                label: function (tooltipItem, data) {
                    return data.datasets[tooltipItem.datasetIndex].label + ": " + numberWithCommas(tooltipItem.yLabel);
                }
            }
        },
        scales: {
            xAxes: [{
                stacked: true,
                gridLines: { display: false },
            }],
            yAxes: [{
                stacked: true,
                ticks: {
                    callback: function (value) { return numberWithCommas(value); },
                },
            }],
        },
        legend: { display: true }
    },
    plugins: [{
        beforeInit: function (chart) {
            chart.data.labels.forEach(function (value, index, array) {
                var a = [];
                a.push(value.slice(0, 5));
                var i = 1;
                while (value.length > (i * 5)) {
                    a.push(value.slice(i * 5, (i + 1) * 5));
                    i++;
                }
                array[index] = a;
            })
        }
    }]
});


/////////////////////////////////////

let array = [];
const url = "http://192.168.0.108:8080/machine_status/?";
async function api() {
    let array = [];
    let names = [];
    let response = await fetch(url);
    let arr = await response.json();
    for (let i = 0; i < arr.length; i++) {
        array.push(arr[i].occupiedPercent);
        names.push(arr[i].name);
    }
    console.log(array)
    return array, names;
}
// function api() {
//     fetch(url)
//         .then(arr => response.json())
//         .then(array => {
//             for (let i = 0; i < arr.length; i++) {
//                 array.push(arr[i].occupiedPercent);
//             }
//         });
// }


console.log(array);
api().then((arr, names) => {
    array, names = arr, names;

    console.log(array[0]);
    let number = 0;
    for (let i = 0; i < 20; i++) {
        number = parseInt(array[i] * 100);
        console.log(number);
        if (number === 100) {
            $(`#first_${i + 1}`).css("background", "purple");
            $(`#third_${i + 1}`).css("background", "purple");
        } else if (number < 100 && number >= 50) {
            $(`#first_${i}`).css("background", "violet");
            $(`#second_${i}`).css("background", "violet");
            console.log("violet");
        } else if (number < 50 && number >= 20) {
            $(`#first_${i + 1}`).css("background", "gray");
            $(`#4_${i + 1}`).css("background", "gray");
            $(`#7_${i + 1}`).css("background", "gray");
            console.log("gray");
        } else if (number < 20 && number >= 10) {
            $(`#first_${i + 1}`).css("background", "pink");
            $(`#5_${i + 1}`).css("background", "pink");
            console.log("pink");
        } else if (array[i] == null) {
            $(`#first_${i + 2}`).css("background", "pink");
            $(`#first_${i + 2}`).on("click", function () {

            });

            $(`#6_${i}`).css("background", "black");
            $(`#6_${i}`).text(names[i]);
            $(`#6_${i + 1}`).text(names[i]);

            $(`#6_${i + 2}`).on("click", function (e) {
                console.log('Clicked')
                console.log(e.target)
                create_popup()
            });
            console.log("black");
        }
    }



});


is_popup_active = false
function create_popup() {
    let div = document.createElement('div')
    div.id = 'viz'

    document.body.append(div)
    draw()
    document.addEventListener('click', (e) => {
        if (is_popup_active) {
            if (!e.path.includes(document.getElementById('viz'))) {
                is_popup_active = false
                document.getElementById('viz').remove()
            }
        }
    })
    setTimeout(() => {
        is_popup_active = true
    }, 1000);
}

var viz;

function draw() {
    var config = {
        container_id: "viz",
        server_url: "bolt://192.168.0.108:7687",
        server_user: "neo4j",
        server_password: "neo4j",
        labels: {
            "Stanok": {
                caption: 'name',
                size: 15,
                color: '#00BBBB'
            },
            "Aggregat": {
                size: 15,
                caption: 'name',
            },
            "WorkGroup": {
                size: 10,
                caption: 'name',
            },
            "Resource": {
                size: 5,
                caption: 'name'
            }
        },
        relationships: {
            "INPUTS": {
                thickness: 1,
                caption: false,
            },
            "OUTPUTS": {
                thickness: 1,
                caption: false,
            },
            "CONTAIN": {
                thickness: 1,
                caption: false,
            },
            "WORKS_FOR": {
                thickness: 1,
                caption: false
            }
        },
        arrows: true,
        hierarchical_sort_method: "directed",

        initial_cypher: `
            MATCH (a:Stanok)-[r1:OUTPUTS]->(b:Aggregat), (a:Stanok)<-[r2:INPUTS]-(c:Aggregat) WHERE a.fid = 'G_ATO2' 
            MATCH (w:WorkGroup)<-[r3:CONTAIN]-(a)
            MATCH (w)-[r4]-(f)
            OPTIONAL MATCH (b)-[r5]-(d) 
            OPTIONAL MATCH (e)-[r6]-(c)
            RETURN a,b,c,d,e,w,f,r1,r2,r3,r4,r5,r6
            `
    };

    viz = new NeoVis.default(config);
    viz.render();
}