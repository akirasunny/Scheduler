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

// functions

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
		console.log(minutesleft);
		var nexttrain = current.add(parseInt(minutesleft), "minutes").format("HH:mm");
		console.log("diff1>0");
	}
	else if (diff1 = 0) {
		var minutesleft = 0;
		var nexttrain = current.format("hh:mm");
	}
	else {
		var minutesleft = Math.abs(diff1);
		var nexttrain = first.format("hh:mm");
	}
	
	var array = [nexttrain, minutesleft]
	return array;
}

// main
$("#submit").on("click", function(event) {
	event.preventDefault();
	var name = $("#train-name").val().trim();
	var dest = $("#destination").val().trim();
	var first = $("#first-train").val().trim();
	var freq = $("#frequency").val().trim();
	var array = minutesaway(first, freq);
	var next = array[0];
	var minsleft = array[1];
	console.log(next);
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
	console.log(child.val());
	var child = child.val();
	var name = child.name;
	var dest = child.destination;
	var freq = child.frequency;
	var first = child.first;
	var array = minutesaway(first, freq);
	console.log(array);
	var next = array[0];
	var minsleft = array[1];
	var tr = $("<tr>");
	var tdname = $("<td>").html(name);
	var tddest = $("<td>").html(dest);
	var tdfreq = $("<td>").html(freq);
	var tdnext = $("<td>").html(next);
	var tdminsleft = $("<td>").html(minsleft);
	tr.append(tdname, tddest, tdfreq, tdnext, tdminsleft);
	$(".table").append(tr);
});