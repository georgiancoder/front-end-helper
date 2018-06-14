const { app, BrowserWindow } = require('electron');

function createWindow(){
	let win = new BrowserWindow();
}

app.on('ready',createWindow);