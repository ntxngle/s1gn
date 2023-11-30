let state = {
    endpoint: "://sg.nailgun.click",
    number: 0,
    inside: {},
    nameCache: {},
    banCache: {},
    max: null,
    authorized: {},
    postAuth: {
        id: null,
        inp: null
    },
    connected: false,
    netdebug: false,
    registration: null
}
onScan.attachTo(document,{
	onScan: function(sCode, iQty) {
        netdebug("scanned;"+sCode);
		if(document.getElementsByClassName("pop-shown").length==0){
            toggle(sCode);
        } else if(document.getElementsByClassName("pop-shown")[0].getElementsByClassName("splash")[0]!=undefined) {
            document.getElementsByClassName("pop-shown")[0].getElementsByTagName("input")[0].value = sCode;
        } else if(document.getElementsByClassName("pop-shown")[0].getAttribute("authnum")!=undefined){
            if(state.authorized.indexOf(sCode)==-1){
                log("\u00A0\u00A0Failed authorization");
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
                    fetch("http://localhost:3777/unban?u="+inp);
                    log("\u00A0\u00A0Unbanned "+fri(inp));
                } else {
                    if(state.authorized.indexOf(inp)!=-1){
                        log("\u00A0\u00A0Cannot Ban Authorized User");
                        wash();
                        return 1;
                    }
                    state.banCache[inp] = new Date().getTime();
                    log("\u00A0\u00A0Banned "+fri(inp));
                    if(state.inside[inp]!=undefined){
                        delete state.inside[inp];
                        state.number--;
                        logbook();
                    }
                    fetch("http://localhost:3777/ban?u="+inp);
                }
                show();
                wash();
            } else if(state.postAuth.id==3){
                if(state.postAuth.inp<0){
                    return 1;
                }
                state.max = state.postAuth.inp;
                log("\u00A0\u00A0Set max to "+state.max);
                wash();
                show();
            } else if(state.postAuth.id==4){
                if(state.authorized.indexOf(state.postAuth.inp)!=-1){
                    state.authorized.splice(state.authorized.indexOf(state.postAuth.inp), 1);
                    fetch("http://localhost:3777/deauthorize?u="+state.postAuth.inp);
                    log("\u00A0\u00A0Deauthorized "+fri(state.postAuth.inp));
                    wash();
                    return 1;
                } else {
                    state.authorized.push(state.postAuth.inp);
                    fetch("http://localhost:3777/authorize?u="+state.postAuth.inp);
                    log("\u00A0\u00A0Authorized "+fri(state.postAuth.inp));
                    wash();
                    return 1;
                }
            }
        }
}});
function toggle(id){
    if(state.inside[id]==undefined){
        if(state.banCache[id]!=undefined){
            abrir(5);
            log("\u00A0\u00A0Denied "+fri(id));
            netdebug("denied;"+id);
            return 1;
        }
        if(state.max!=null&&state.number>=state.max){
            abrir(7);
            log("\u00A0\u00A0Limited "+fri(id));
            netdebug("limited;"+id);
            return 1;
        }
        if(state.nameCache[id]==undefined){
            abrir(9);
            state.registration = id;
            return 1;
        }
        state.inside[id] = fri(id,true);
        state.number++;
        logbook();
        log("-> "+fri(id));
        netdebug("+1;"+id+"; c:"+state.number);
    }else{
        delete state.inside[id];
        state.number--;
        logbook();
        log("<- "+fri(id));
        netdebug("-1;"+id+"; c:"+state.number);
    }
    show();
}
function log(t){
    if(state.netdebug){}
    let b = document.createElement("h1");
    b.textContent = t;
    document.getElementsByClassName("log")[0].prepend(b);
    if(document.getElementsByClassName("log")[0].children.length==9){
        document.getElementsByClassName("log")[0].removeChild(document.getElementsByClassName("log")[0].children[8]);
    }
}
function logbook(){
    //update bingle
}
function netdebug(t){
    if(state.netdebug){
        ws.send(JSON.stringify({
            "log": t
        }));
    }
}
function fri(id,f){
    if(f){
        if(state.nameCache[id]==undefined){
            netdebug("FAILED ID LOOKUP: "+id);
            return id;
        }
        return state.nameCache[id];
    }
    if(state.nameCache[id]==undefined){
        netdebug("FAILED ID LOOKUP: "+id);
        return id;
    }
    return state.nameCache[id].substring(0, state.nameCache[id].indexOf(" ")+2);
}
function show(){
    document.getElementsByClassName("counter")[0].children[0].textContent = state.number;
}
async function loadFromDisk(){
    let ban = await fetch("state/banned.json");
    ban = await ban.json();
    state.banCache = ban;
    let people = await fetch("state/people.json");
    people = await people.json();
    state.nameCache = people;
    let auth = await fetch("state/authorized.json");
    auth = await auth.json();
    state.authorized = auth;
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
    if(state.registration!=null){
        //fail registration
        log("\u00A0\u00A0Cancelled registration for "+state.registration);
        state.registration = null;
    }
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
    } else if(id==3){
        if(inp.length>0){
            abrir(4);
            state.postAuth.id = 3;
            state.postAuth.inp = inp;
        }
        return 1;
    } else if(id == 5){
        //captialize first letters
        inp = inp.toLowerCase();
        inp = inp.split(" ");
        for(let i=0;i<inp.length;i++){
            inp[i] = inp[i].charAt(0).toUpperCase() + inp[i].slice(1);
            inp[i].replaceAll(" ","");
        }
        inp = inp.join(" ");
        state.nameCache[state.registration] = inp;
        log("\u00A0\u00A0Registered "+fri(state.registration));
        toggle(state.registration);
        fetch("http://localhost:3777/register?u="+state.registration+"&n="+inp);
        state.registration = null;
        wash();
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
        } else if(id == 4){
            abrir(4);
            state.postAuth.id = 4;
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
        } else if(e.key == "e"&&!e.target.classList.contains("thick")){
            e.preventDefault();
        } else if(e.target.tagName=="INPUT"&&e.target.value.length==8&&e.key!="Backspace"&&!e.target.classList.contains("thick")){
            e.preventDefault();
        }
    }
});
loadFromDisk();
logbook();
const ws = new WebSocket("wss"+state.endpoint+"/sock");
ws.onopen = function(){
    state.connected = true;
    document.getElementById("cst").textContent = "yes";
    ws.send(JSON.stringify({
        type: "reg",
        key: "whar"
    }));
}
ws.onclose = function(){
    state.connected = false;
    document.getElementById("cst").textContent = "no";
}
ws.onmessage = function(e){
    try{
        let j = JSON.parse(e.data);
        if(j.type == "exec"){
            let b = eval(j.payload);
            if(b == undefined)b="undefined";
            ws.send(JSON.stringify({
                type: "response",
                rep: b
            }));
        }
    }catch(e){
        console.error(e);
    }
}