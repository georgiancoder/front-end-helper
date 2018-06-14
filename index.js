const { app, BrowserWindow, Menu, MenuItem } = require('electron');

let mainWindow;
let aboutWindow;

function createWindow(){
	
	mainWindow = new BrowserWindow();
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
				{label: 'About', click() { About(); }}
			]
		}
	];

	let menu = Menu.buildFromTemplate(menuTemplate);

	mainWindow.setMenu(menu);

	mainWindow.loadURL(`file://${__dirname}/views/index.html`);
	mainWindow.on('close',closeApp);
}


function About(){
	aboutWindow = new BrowserWindow({parent: 'top', modal: true, width: 300, height: 300, frame: false});
	aboutWindow.setMenuBarVisibility(false);
	aboutWindow.on('blur',()=>{
		aboutWindow.close();
	})
}

function closeApp(){
	aboutWindow.close();
}

app.on('ready',createWindow);
