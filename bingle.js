onScan.attachTo(document,{
	onScan: function(sCode, iQty) { // Alternative to document.addEventListener('scan')
		// iQty is Quantity of times the value was scanned at that time (not sure why relevance, maybe with hardware means more) 
		// sCode is the scanned value: Raw ID number
		// Below prints to console `<quantity>x <IDNumber>
			// Example "Scanned: 1x 27894302"
		console.log('Scanned: ' + iQty + 'x ' + sCode);
		people(sCode);
}});

var banned = [];
var records = [];
banGet();

function enter(v){
	console.log("v: " + v);
	// idNumber = v;
	idNumber = v.idNumber;
	firstName = v.firstName;
	lastName = v.lastName;
	console.log("idNum: " + idNumber);
	console.log("First: " + firstName);
	console.log("Last: " + lastName);
	let x = document.getElementsByClassName("counter")[0];
	x.children[0].textContent = (parseInt(x.children[0].textContent)+1).toString().padStart(2,'0');
	x = document.getElementsByClassName("log")[0];
	if(x.children.length == 8){
		x.removeChild(x.children[7])
	}
	let b = document.createElement("h1");
	// b.textContent = `<- Xxx${"x".repeat(Math.random()*17)} X`;
	b.textContent = "<- " + firstName;
	x.prepend(b);
	records.push(idNumber);
	console.log(records);
}

function leave(v){
	console.log("v: " + v);
	// idNumber = v;
	idNumber = v.idNumber;
	firstName = v.firstName;
	lastName = v.lastName;
	console.log("idNum: " + idNumber);
	console.log("First: " + firstName);
	console.log("Last: " + lastName);
	let x = document.getElementsByClassName("counter")[0];
	x.children[0].textContent = (parseInt(x.children[0].textContent)-1).toString().padStart(2,'0');
	x = document.getElementsByClassName("log")[0];
	if(x.children.length == 8){
		x.removeChild(x.children[7])
	}
	let b = document.createElement("h1");
	// b.textContent = `<- Xxx${"x".repeat(Math.random()*17)} X`;
	b.textContent = "-> " + firstName;
	x.prepend(b);
	let remove = records.find(n => n == idNumber).findIndex;
	records.splice(remove, 1);
	console.log(records);
}

async function ban(v){
	console.log("Ban FUNC moment");
	banned.push(v);
	console.log(banned);
	fetch('http://127.0.0.1:3000/ban.json', {
		method: 'POST',
		body: JSON.stringify(banned)
	});
}

function bingle(j){
	if(j==0){
		bingle(3); 
		document.getElementsByTagName("div")[0].classList.add("blur");
		bingle(4);
		document.getElementsByClassName("pop-content")[0].classList.add("pop-shown");
		document.getElementsByClassName("pop-shown")[0].getElementsByTagName("input")[0].focus();
	} else if(j==1){
		bingle(3);
		document.getElementsByTagName("div")[0].classList.add("blur");
		bingle(4);
		document.getElementsByClassName("pop-content")[1].classList.add("pop-shown");
		document.getElementsByClassName("pop-shown")[0].getElementsByTagName("input")[0].focus();
	} else if(j==2){
		bingle(3);
		document.getElementsByTagName("div")[0].classList.remove("blur");
        bingle(4);
	} else if(j==3){
		let x = document.getElementsByTagName("input");
		for(let i=0;i<x.length;i++){x[i].value=""};
	} else if(j==4){
		let x = document.getElementsByClassName("pop-content");
		for(let i=0;i<x.length;i++){x[i].classList.remove("pop-shown")};
	} else if(j==5){
		bingle(3);
		document.getElementsByTagName("div")[0].classList.add("blur");
		bingle(4);
		document.getElementsByClassName("pop-content")[2].classList.add("pop-shown");
	} else if(j==6){
		bingle(3);
		document.getElementsByTagName("div")[0].classList.add("blur");
		bingle(4);
		document.getElementsByClassName("pop-content")[3].classList.add("pop-shown");
		document.getElementsByClassName("pop-shown")[0].getElementsByTagName("input")[0].focus();
	}
}
document.body.addEventListener("keydown", function(e){
	if(e.key == "Escape"){
		bingle(2);
	}
	if(document.getElementsByClassName("pop-shown").length==0){
		if(e.key == "b"){
			bingle(1);
			e.preventDefault();
		} else if(e.key == "m"){
			bingle(0);
			e.preventDefault();
		} else if(e.key == "h"){
			bingle(5);
			e.preventDefault();
		} else if(e.key == "e"){
			bingle(6);
			e.preventDefault();
		}
	}
});
document.body.addEventListener("click", function(e){
	console.log(e.target.classList + "\n" + e.target.parentElement.classList);
	if(e.target.classList.contains("manbutton")){
		submitMan();
	}
	else if(e.target.classList.contains("banbutton")){
		submitBan();
	}
	else if(e.target.classList.contains("editbutton")){
		submitEdit();
	}
	else if(!e.target.classList.contains("clickoff")&&!e.target.parentElement.classList.contains("clickoff")&&e.target.tagName!="BUTTON"){
		bingle(2);
	}
});

document.getElementById('man').addEventListener('keydown', function(e) {
    if (e.which === 38 || e.which === 40) {
        e.preventDefault();
    }
	if (e.which === 13){
		submitMan();
	}
});
document.getElementById('ban').addEventListener('keydown', function(e) {
    if (e.which === 38 || e.which === 40) {
        e.preventDefault();
    }
	if (e.which === 13){
		submitBan();
	}
});
document.getElementById('edit').addEventListener('keydown', function(e) {
    if (e.which === 38 || e.which === 40) {
        e.preventDefault();
    }
	if (e.which === 13){
		submitEdit();
	}
});

function submitMan(){
	let v = document.getElementById("man").value;
	console.log("EventV: " + v);
	if(v.length != 8){
		document.getElementById("splashman").innerText = "Not a valid ID Number";
		document.getElementById("splashman").style.color = "#eb3434";
		document.getElementById("splashman").style.fontWeight = "bold";
		return;
	}
	identifier = v + " MAN"
	bingle(2);
	people(identifier);
}
function submitBan(){
	let v = document.getElementById("ban").value;
	console.log("EventV: " + v);
	if(v.length != 8){
		document.getElementById("splashban").innerText = "Not a valid ID Number";
		document.getElementById("splashban").style.color = "#eb3434";
		document.getElementById("splashban").style.fontWeight = "bold";
		return;
	}
	identifier = v + " BAN"
	bingle(2);
	people(identifier);
}
function submitEdit(){
	let v = document.getElementById("edit").value;
	console.log("EventV: " + v);
	bingle(2);
	let x = document.getElementsByClassName("counter")[0];
	negTest = v.slice(0,1);
	if (negTest == "-"){
		vDown = v.slice(1);
		x.children[0].textContent = (parseInt(x.children[0].textContent)-vDown).toString().padStart(2,'0');

	}else{
		x.children[0].textContent = (parseInt(x.children[0].textContent)+v).toString().padStart(2,'0');
	}
}


async function people(v){
	const fetchPromise = fetch('http://127.0.0.1:3000/people.json');
	fetchPromise
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		console.log(v);
		number = v.slice(0, 8);
		identifier = v.slice(9);
		filtered = data.find(({ idNumber }) => idNumber === number);
		console.log(filtered);
		if(identifier == "" || identifier == "MAN"){
			if(records.find(n => n == filtered.idNumber)){
				console.log("Running leave");
				leave(filtered);
			}else{
				console.log("Running enter");
				enter(filtered);
			}
		}else if(identifier == "BAN"){
			console.log("BAN MOMEN");
			ban(filtered);
		}
  });	
}

async function banGet(){
	const fetchPromise = fetch('http://127.0.0.1:3000/ban.json');
	fetchPromise
	.then((response) => response.json())
	.then((data) => {
		banned = data;
		console.log(banned);
	});
}