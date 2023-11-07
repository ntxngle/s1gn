const { app, BrowserWindow, ipcMain } = require("electron");
const path = require('node:path');
const fs = require('node:fs');
function createWindow () {
	const mainWindow = new BrowserWindow({
		show: false,
		frame: false,
		autoHideMenuBar: true,
		webPreferences: {
			contextIsolation: true,
			preload: path.join(__dirname, 'prehook.js'),
		}
	});
	mainWindow.loadFile('index.html');
	mainWindow.maximize();
	mainWindow.show();
}
ipcMain.handle('toMain', async function toMain(_event, data) {
	if(data.verb==undefined) return 1;
	if(data.verb == "ban"){
		let ban = fs.readFileSync(path.join(__dirname, "banned.json"));
		ban = JSON.parse(ban);
		ban[data.id] = new Date().getTime();
		fs.writeFileSync(path.join(__dirname, "banned.json"), JSON.stringify(ban));
	} else if(data.verb == "unban"){
		let ban = fs.readFileSync(path.join(__dirname, "banned.json"));
		ban = JSON.parse(ban);
		delete ban[data.id];
		fs.writeFileSync(path.join(__dirname, "banned.json"), JSON.stringify(ban));
	}
});
app.whenReady().then(() => {
	createWindow()
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});
app.on('window-all-closed', function () {
	app.quit();
});
