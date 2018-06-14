const { app, BrowserWindow, Menu, MenuItem } = require('electron');

function createWindow(){
	let win = new BrowserWindow();

	const menuTemplate = [
		{
			label: 'File',
			submenu: [
				{label: 'New Project'},
				{label: 'Exit', role: 'close'}
			]
		},
		{
			label: 'Help',
			submenu: [
				{label: 'About'}
			]
		}
	];

	let menu = Menu.buildFromTemplate(menuTemplate);

	win.setMenu(menu);
}

app.on('ready',createWindow);