let state = {
    endpoint: "https://localhost:3000",
    number: 0,
    inside: [],
    nameCache: {},
    banCache: {},
    authorized: [
        "28329274",
        "11111111"
    ],
    postAuth: {
        id: null,
        inp: null
    }
}
onScan.attachTo(document,{
	onScan: function(sCode, iQty) {
		console.log('Scanned: ' + iQty + 'x ' + sCode);
		if(document.getElementsByClassName("pop-shown").length==0){
            toggle(sCode);
        } else if(document.getElementsByClassName("pop-shown")[0].getElementsByClassName("splash")[0]!=undefined) {
            document.getElementsByClassName("pop-shown")[0].getElementsByTagName("input")[0].value = sCode;
        } else if(document.getElementsByClassName("pop-shown")[0].getAttribute("authnum")!=undefined){
            if(state.authorized.indexOf(sCode)==-1){
                log("  Failed authorization");
                wash();
                return 1;
            }
            if(state.postAuth.id==2){
                if(state.postAuth.inp.length>0){
                    state.number += parseInt(state.postAuth.inp);
                    show();
                    wash();
                }
            } else if(state.postAuth.id==1){
                let inp = state.postAuth.inp;
                if(state.banCache[inp]!=undefined){
                    delete state.banCache[inp];
                    log("  Unbanned "+fri(inp));
                    window.API.toMain({
                        "verb": "unban",
                        "id": inp
                    });
                } else {
                    state.banCache[inp] = new Date().getTime();
                    log("  Banned "+fri(inp));
                    if(state.inside.indexOf(inp)!=-1){
                        state.inside.splice(state.inside.indexOf(inp),1);
                        state.number--;
                    }
                    window.API.toMain({
                        "verb": "ban",
                        "id": inp
                    });
                }
                show();
                wash();
            }
        }
}});
function toggle(id){
    if(state.inside.indexOf(id)==-1){
        if(state.banCache[id]!=undefined){
            abrir(5);
            log("  Denied "+fri(id));
            return 1;
        }
        state.inside.push(id);
        state.number++;
        log("-> "+fri(id));
    }else{
        state.inside.splice(state.inside.indexOf(id),1);
        state.number--;
        log("<- "+fri(id));
    }
    show();
}
function log(t){
    let b = document.createElement("h1");
    b.textContent = t;
    document.getElementsByClassName("log")[0].prepend(b);
    if(document.getElementsByClassName("log")[0].children.length==9){
        document.getElementsByClassName("log")[0].removeChild(document.getElementsByClassName("log")[0].children[8]);
    }
}
function fri(id){
    if(state.nameCache[id]==undefined) return id;
    return state.nameCache[id].substring(0, state.nameCache[id].indexOf(" ")+2);
}
function show(){
    document.getElementsByClassName("counter")[0].children[0].textContent = state.number;
}
async function loadFromDisk(){
    let ban = await fetch("banned.json");
    ban = await ban.json();
    state.banCache = ban;
    let people = await fetch("people.json");
    people = await people.json();
    state.nameCache = people;
    return 1;
}
function wash(){
    let x = document.getElementsByTagName("input");
    for(let i=0;i<x.length;i++){x[i].value=""};
    document.getElementsByTagName("div")[0].classList.remove("blur");
    x = document.getElementsByClassName("pop-content");
    for(let i=0;i<x.length;i++){x[i].classList.remove("pop-shown")};
    x = document.getElementsByClassName("splash");
    for(let i=0;i<x.length;i++){x[i].classList.remove("bad-splash");x[i].textContent="Input ID Number";};
    state.postAuth.id = null;
    state.postAuth.inp = null;
}
function abrir(id){
    wash();
	document.getElementsByTagName("div")[0].classList.add("blur");
    document.getElementsByClassName("pop-content")[id].classList.add("pop-shown");
    if(document.getElementsByClassName("pop-shown")[0].getElementsByTagName("input")[0]!=undefined) document.getElementsByClassName("pop-shown")[0].getElementsByTagName("input")[0].focus();
}
function subact(id){
    let inp = document.getElementsByClassName("pop-shown")[0].getElementsByTagName("input")[0].value;
    if(id==2){
        if(inp.length>0){
            abrir(4);
            state.postAuth.id = 2;
            state.postAuth.inp = inp;
        }
        return 1;
    }
    if(inp.length!=8){
        document.getElementsByClassName("pop-shown")[0].getElementsByClassName("splash")[0].classList.add("bad-splash");
        document.getElementsByClassName("pop-shown")[0].getElementsByClassName("splash")[0].textContent="Not a valid ID Number";
    } else {
        if(id==0){
            wash();
            toggle(inp);
        } else if(id==1){
            abrir(4);
            state.postAuth.id = 1;
            state.postAuth.inp = inp;
        }
    }
}
document.body.addEventListener("click", function(e){
    if(!e.target.classList.contains("clickoff")&&!e.target.parentElement.classList.contains("clickoff")&&e.target.tagName!="BUTTON"){
        wash();
	}
});
document.body.addEventListener("keydown", function(e){
	if(e.key == "Escape"){
		wash();
	}
	if(document.getElementsByClassName("pop-shown").length==0){
		if(e.key == "b"){
			abrir(1);
			e.preventDefault();
		} else if(e.key == "m"){
			abrir(0);
			e.preventDefault();
		} else if(e.key == "h"){
			abrir(2);
			e.preventDefault();
		} else if(e.key == "e"){
			abrir(3);
			e.preventDefault();
		}
	} else {
        if(e.target.tagName=="INPUT"&&e.key=="Enter"){
            e.target.parentElement.getElementsByTagName("button")[0].click();
            e.preventDefault();
        } else if(e.key == "e"){
            e.preventDefault();
        } else if(e.target.tagName=="INPUT"&&e.target.value.length==8&&e.key!="Backspace"){
            e.preventDefault();
        }
    }
});
loadFromDisk();