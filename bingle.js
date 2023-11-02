function enter(v){
	console.log("v: " + v);
	idNumber = v;
	console.log("idNum: " + idNumber);
	let x = document.getElementsByClassName("counter")[0];
	x.children[0].textContent = (parseInt(x.children[0].textContent)+1).toString().padStart(2,'0');
	x = document.getElementsByClassName("log")[0];
	if(x.children.length == 8){
		x.removeChild(x.children[7])
	}
	let b = document.createElement("h1");
	// b.textContent = `<- Xxx${"x".repeat(Math.random()*17)} X`;
	b.textContent = "<- " + idNumber;
	x.prepend(b);
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
		let v = document.getElementById("man").value;
		// let n = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
		console.log("EventV: " + v);
		if(v.length != 8){
			document.getElementById("splash").innerText = "Not a valid ID Number";
			document.getElementById("splash").style.color = "#eb3434";
			document.getElementById("splash").style.fontWeight = "bold";
			console.log(!n);
			return;
		}
		bingle(2);
		enter(v);
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
		let v = document.getElementById("man").value;
		// let n = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
		console.log("EventV: " + v);
		if(v.length != 8){
			document.getElementById("splash").innerText = "Not a valid ID Number";
			document.getElementById("splash").style.color = "#eb3434";
			document.getElementById("splash").style.fontWeight = "bold";
			console.log(!n);
			return;
		}
		bingle(2);
		enter(v);
	}
});