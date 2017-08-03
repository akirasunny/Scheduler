// firebase
var config = {
	apiKey: "AIzaSyBiJYIudwdkxjpdW4gT0hQUGZrNHOw0yoE",
	authDomain: "a7-train.firebaseapp.com",
	databaseURL: "https://a7-train.firebaseio.com",
	projectId: "a7-train",
	storageBucket: "",
	messagingSenderId: "154083303074"
};
	firebase.initializeApp(config);

var database = firebase.database();

// globals
var num = "0123456789"
var interval;
var keys = [];

// functions

// clock function from W3Schools
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    $("#currenttime").text(h + ":" + m + ":" + s);
    var t = setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) {
    	i = "0" + i
    }
    return i;
}

// timer for refreshing
function timerrun() {
	interval = setInterval(refresh, 1000 * 60);
}

function refresh() {
	location.reload();
}

// check if user input follows HH:mm
function checkinput(a) {
	var index = a.indexOf(":");
	if (index !== 2) {
		return false;
	}
	else {
		var temp = a.substring(0, index);
		if (num.indexOf(temp[0]) === -1 || num.indexOf(temp[1]) === -1 || temp.length !== 2) {
			return false;
		}
		else {
			var temp1 = a.substring(index + 1, );
			if (num.indexOf(temp1[0]) === -1 || num.indexOf(temp1[1]) === -1 || temp1.length !== 2) {
				return false;
			}
			else {
				return true;
			}
		}
	
	}
}

function minutesaway(time, frequency) {
	var current = moment();
	var first = moment(time, "hh:mm").subtract(1, "days");
	var first1 = moment(time, "hh:mm");
	var freq = frequency;
	var diff = moment(current).diff(moment(first), "minutes");
	var diff1 = current.diff(first1, "minutes");
	if (diff1 > 0) {
		var remainder = diff % parseInt(freq);
		var minutesleft = freq - remainder;
		var nexttrain = current.add(parseInt(minutesleft), "minutes").format("HH:mm");
	}
	else {
		var minutesleft = Math.abs(diff1);
		var nexttrain = first.format("HH:mm");
	}
	
	var array = [nexttrain, minutesleft]
	return array;
}

// main

startTime();


$("#submit").on("click", function(event) {
	event.preventDefault();
	var name = $("#train-name").val().trim();
	var dest = $("#destination").val().trim();
	var first = $("#first-train").val().trim();
	var freq = $("#frequency").val().trim();
	var array = minutesaway(first, freq);
	var next = array[0];
	var minsleft = array[1];
	if (name === "" || dest === "" || first === "" || freq === "") {
		alert("All fields are required!")
	}
	else {
	var inputcheck = checkinput(first);
		if (inputcheck === true) {
			database.ref().push({
				name: name,
				destination: dest,
				frequency: freq,
				first: first,
				next: next,
				minutesleft: minsleft,
				dateAdded: firebase.database.ServerValue.TIMESTAMP
			})
			$("#train-name").val("");
			$("#destination").val("");
			$("#first-train").val("");
			$("#frequency").val("");
		}
		else {
			alert("Invalid start date!");
		}
	}
});

database.ref().on("child_added", function(child, preChildKey) {
	var key = child.key;
	keys.push(key);
	var child = child.val();
	var name = child.name;
	var dest = child.destination;
	var freq = child.frequency;
	var first = child.first;
	var array = minutesaway(first, freq);
	var next = array[0];
	var minsleft = array[1];
	var tr = $("<tr class='trains'>");
	var tdname = $("<td>").html(name);
	var tddest = $("<td>").html(dest);
	var tdfreq = $("<td>").html(freq);
	var tdnext = $("<td class='" + key + "'>").html(next);
	var tdminsleft = $("<td class='" + key + "1'>").html(minsleft);
	var button = $("<button class='btn btn-primary btn-sm' id='" + key + "'>").text("Remove");
	tr.append(tdname, tddest, tdfreq, tdnext, tdminsleft, button).attr("id", key);
	$(".table").append(tr);
});

// console.log(keys);

timerrun();

$(document).on("click", ".btn-sm", function() {
	database.ref().child($(this).attr("id")).remove();
	$("#" + $(this).attr("id")).remove();
})