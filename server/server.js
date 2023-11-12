let client = null;
let remote = null;
Bun.serve({
	port: 3000,
	async fetch(req,server) {
		const url = new URL(req.url);
		if(url.pathname == "/"){
			return new Response("bingle servidor");
		} else if(url.pathname == "/mod"){
			return new Response(Bun.file("mod.html"));
		} else if(url.pathname == "/sock"){
			server.upgrade(req);
			return;
		} else {
			console.log("nuh uh "+url.pathname);
			return new Response("wtf !!!");
		}
	},
	error() {
		return new Response(null, { status: 404 });
	},
	websocket: {
		close(ws) {
			if(client == ws){
				client = null;
			}
		},
		message(ws, message) {
			let d = JSON.parse(message);
			if(d.type == "reg"){
				if(d.key == "nuh-uh"){
					ws.send(JSON.stringify({type: "reg", status: "ok"}));
					client = ws;
				} else if(d.key == "whar"){
					ws.send(JSON.stringify({type: "reg", status: "ok"}));
					remote = ws;
				}
			} else if(d.type == "response" && ws == remote){
				if(client){
					client.send(JSON.stringify(d));
				}
			} else if(d.log != undefined && ws == remote){
				if(client){
					client.send(JSON.stringify(d));
				}
			} else if(d.type == "exec" && ws == client){
				if(remote){
					remote.send(JSON.stringify(d));
				}
			}
		}
	}
});
