class RunTime {
    constructor() {
        this.times = [];
        this.sortedTimes = [];
        this.max = -1;
        this.min = -1;
        this.mean = -1;
        this.median = -1;
        this.mode = -1;

        // extra variables for helping calculate values
        this.occurrances = {}; // helps with mode
        this.newTime = 0; // helps with max, min, mode
        this.timesSum = 0; // helps with mean
    }

    findMax() {
        if (this.newTime > this.max)
            this.max = this.newTime;
    }

    findMin() {
        if (this.min == -1 || this.newTime < this.min)
            this.min = this.newTime;
    }

    calcMean() {
        this.mean = this.timesSum / this.times.length;
    }

    findMode() {
        var newTime = this.newTime;

        // update key value pair
        if (this.occurrances[newTime] == undefined)
            this.occurrances[newTime] = 1;
        else
            this.occurrances[newTime]++;

        // check number of times newest time has occurred. if it has occurred
        // more times than current mode, replace current mean
        if (this.mode == -1 || this.occurrances[newTime] > this.occurrances[this.mode])
            this.mode = newTime;
    }

    findMedian() {
        var len = this.sortedTimes.length;
        // get average of the two middle values if times is an even length
        if (len % 2 == 0)
            this.median = (this.sortedTimes[len / 2] + this.sortedTimes[(len / 2) - 1]) / 2;
        else
            this.median = this.sortedTimes[Math.floor((len) / 2)];
    }


    calcAll() {
        this.findMax();
        this.findMin();
        this.calcMean();
        this.findMedian();
        this.findMode();
    }

    // recalculate info when user removes a time
    removeCalc() {
        this.max = -1;
        this.min = -1;
        this.mean = -1;
        this.median = -1;
        this.mode = -1;
        this.occurrances = {};
        this.newTime = 0;
        this.timesSum = 0;

        for (var i = 0; i < this.times.length; i++) {
            // max
            if (this.times[i] > this.max)
                this.max = this.times[i];

            // min
            if (this.min == -1 || this.times[i] < this.min)
                this.min = this.times[i];

            // mean
            this.timesSum += this.times[i];

            // mode
            if (this.occurrances[this.times[i]] == undefined)
                this.occurrances[this.times[i]] = 1;
            else
                this.occurrances[this.times[i]]++;
        }

        // mean
        this.mean = this.timesSum / this.times.length;

        // median
        var len = this.sortedTimes.length;
        if (len % 2 == 0)
            this.median = (this.sortedTimes[len / 2] + this.sortedTimes[(len / 2) - 1]) / 2;
        else
            this.median = this.sortedTimes[Math.floor((len) / 2)];

        // mode
        for (var key in this.occurrances) {
            if (this.occurrances[key] == undefined)
                this.occurrances[key] = 1;
            else
                this.occurrances[key]++;
            if (this.mode == -1 || this.occurrances[key] > this.occurrances[this.mode])
                this.mode = Number(key);
        }

        // newTime
        this.newTime = this.times[this.times.length - 1];
    }

    removeTime(index, time) {
        this.times.splice(index, 1);
        var sortedIndex = this.sortedTimes.indexOf(time);
        this.sortedTimes.splice(sortedIndex, 1);
        this.removeCalc();
    }

    push(n) {
        // inserts value so array stays sorted during insert. helps with median
        this.sortedTimes.splice(_.sortedIndex(this.sortedTimes, n), 0, n);
        this.times.push(n);
        this.timesSum += n;
        this.newTime = n;
        this.calcAll();
    }
}

var runTimes = {};
var ctx;
var myChart = {};

// takes string in HH:MM:SS or MM:SS or SS format and returns the value
// in seconds. Ex: processInput("1:12:05.01") returns 4325.01
function processInput(inputString) {
    var timeInSec = 0;
    var splitString = inputString.split(':');

    // some basic checks to see if input is valid
    // probably doesn't catch everything
    for (var i = 0; i < splitString.length; i++) {
        // remove empty strings from list
        if (splitString[i] == "") {
            splitString.splice(i, 1);
            i--;
            continue;
        }

        // check for invalid input
        if (isNaN(Number(splitString[i])))
            return -1;
    }

    // multiplies minutes and hours by the proper values and turns time into sec
    for (var i = 0; splitString.length > 0; i++)
        timeInSec += Number(splitString.pop()) * Math.pow(60, i);

    return timeInSec;
}

// takes time in seconds and returns a string in HH:MM:SS.MS format
function secondsToString(t) {
    var timeString = "";
    timeString += Math.floor(t / 3600); //hours
    t = t % 3600;
    var minutes = Math.floor(t / 60); // minutes
    timeString += (minutes < 10) ? ":0" + minutes : ":" + minutes;
    t = Math.floor(t % 60);
    timeString += (t < 10) ? ":0" + t : ":" + t; // seconds
    return timeString;
}

// TODO: Put each time into its own div
function outputHistory() {
    $("#timesOut").html("");
    for (var i = 0; i < runTimes.times.length; i++) {
        var text = "<div class=\"runtime\"><span class=\"x\" onclick=\"removeTime(" + i + ","
            + runTimes.times[i] + ")\">x</span> " + secondsToString(runTimes.times[i]) + "</div>";
        $("#timesOut").append(text);
    }
}

// updates run time history output as well as run time data output
function updateInfo() {
    outputHistory();
    var outputstring = "<ul>" +
        "<li><strong>Worst Time:</strong> " + secondsToString(runTimes.max) + "</li>" +
        "<li><strong>Best Time:</strong> " + secondsToString(runTimes.min) + "</li>" +
        "<li><strong>Mean Time:</strong> " + secondsToString(runTimes.mean) + "</li>" +
        "<li><strong>Median Time:</strong> " + secondsToString(runTimes.median) + "</li>" +
        "<li><strong>Mode Time:</strong> " + secondsToString(runTimes.mode) + "</li>" +
        "</ul>";
    $("#infoOut").html(outputstring);
}

// recalculate values when removing a time
function removeTime(index, time) {
    runTimes.removeTime(index, time);
    updateChart();
    updateInfo();
}

// puts values into localStorage for use on subsequent visits to the page
function updateCookie() {
    for (var key in runTimes)
        localStorage.setItem(key, runTimes[key]);
    if (runTimes.times.length == 1) {
        localStorage.setItem("times", String(runTimes.times[0]));
        localStorage.setItem("sortedTimes", String(runTimes.sortedTimes[0]));
    }
    localStorage.setItem("occurrances", JSON.stringify(runTimes.occurrances));
}

function insertTime() {
    var inputString = $("#timeIn").val();
    $("#timeIn").val("");
    var newTime = processInput(inputString);
    if (newTime == -1) {
        alert("Invalid character in input.");
        return;
    }
    runTimes.push(newTime);
    updateInfo();
}

// retrieves values from localStorage so that user can continue
// from where they left off
function initializeObject() {
    runTimes = new RunTime();

    // if there is nothing in localStorage, then start with a new object
    if (!(localStorage.getItem("times")) || localStorage.getItem("times") == "[]" || Number(localStorage.getItem("min")) == -1)
        return;

    // get data from localStorage
    for (var key in runTimes) {
        // if the value can be parsed to a number, do so when getting the value,
        // otherwise, just get the string
        runTimes[key] = Number(localStorage.getItem(key)) ?
            Number(localStorage.getItem(key)) : localStorage.getItem(key);
    }

    // parse times & occurrances
    runTimes.times = String(runTimes.times).split(',').map(Number);
    runTimes.sortedTimes = String(runTimes.sortedTimes).split(',').map(Number);
    runTimes.occurrances = JSON.parse(String(runTimes.occurrances));

    updateInfo();
}

function updateChart() {
    var tempData =  _.cloneDeep(runTimes.times);
    var tempLabels = [];
    for (var i = 0; i < tempData.length; i++)
        tempLabels.push(String(i+1));
    myChart.data.datasets[0].data = tempData;
    myChart.data.labels = tempLabels;
    myChart.update();
}

function drawChart() {
    // initialize values that chart uses
    var tempData = _.cloneDeep(runTimes.times);
    var tempLabels = [];
    for (var i = 0; i < runTimes.times.length; i++)
        tempLabels.push(String(i+1));

    // initialize chart with data
    ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: tempLabels,
            datasets: [{
                label: "Run Time History",
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgb(66, 138, 255)',
                data: tempData,
                cubicInterpolationMode: 'monotone'
            }]
        },
        options: {}
    });
}

$(document).ready(function() {
    initializeObject();
    drawChart();
    $("#goBtn").click(insertTime);
    $("#goBtn").click(updateChart);
    $("#timeIn").keypress(function(e) {
        if (e.keyCode == 13) {
            insertTime();
            updateChart();
        }
    });
    $(window).bind("beforeunload", updateCookie);
});

// TODO: Allow for different categories of times (like 1 mile, 13 mile, 26 mile)
