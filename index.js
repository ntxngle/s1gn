const { app, BrowserWindow, ipcMain } = require("electron");
const path = require('node:path');
const fs = require('node:fs');
const http = require('http');
const server = http.createServer();
server.on('request', (request, response) => {
	let u = new URL(request.url, 'http://localhost:3777/');
	if(u.pathname == "/ban"){
		//get url param "u"
		let ban = fs.readFileSync(path.join(__dirname, "banned.json"));
		ban = JSON.parse(ban);
		ban[u.searchParams.get("u")] = new Date().getTime();
		fs.writeFileSync(path.join(__dirname, "banned.json"), JSON.stringify(ban));
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end('banned');
	} else if(u.pathname == "/unban"){
		//get url param "u"
		let ban = fs.readFileSync(path.join(__dirname, "banned.json"));
		ban = JSON.parse(ban);
		delete ban[u.searchParams.get("u")];
		fs.writeFileSync(path.join(__dirname, "banned.json"), JSON.stringify(ban));
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end('unbanned');
	} else if(u.pathname == "/register"){
		let people = fs.readFileSync(path.join(__dirname, "people.json"));
		people = JSON.parse(people);
		people[u.searchParams.get("u")] = u.searchParams.get("n");
		fs.writeFileSync(path.join(__dirname, "people.json"), JSON.stringify(people));
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end('registered');
	} else if(u.pathname == "/"){
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end("psuedoIPC ready");
	}
});
server.listen(3777);
function createWindow () {
	const mainWindow = new BrowserWindow({
		show: false,
		frame: true,
		title: "SCANN",
		autoHideMenuBar: true
	});
	mainWindow.loadFile('index.html');
	mainWindow.maximize();
	mainWindow.show();
}
app.whenReady().then(() => {
	createWindow()
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});
app.on('window-all-closed', function () {
	app.quit();
});
