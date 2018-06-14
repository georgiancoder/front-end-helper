const { app, BrowserWindow, Menu, MenuItem, dialog } = require('electron');
const fs = require('fs');

let mainWindow;
let aboutWindow;
let newProjectWindow;

function createWindow(){
	
	mainWindow = new BrowserWindow();
	const menuTemplate = [
		{
			label: 'File',
			submenu: [
				{label: 'New Project', click() { newProject() }},
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
	aboutWindow = new BrowserWindow({parent: 'top', width: 300, height: 300, frame: false});
	aboutWindow.setMenuBarVisibility(false);
	aboutWindow.loadURL(`file://${__dirname}/views/about.html`);
	aboutWindow.on('blur',()=>{
		aboutWindow.close();
	})
}

function newProject(){
	let projectfolder = dialog.showOpenDialog({properties: ['openDirectory', 'multiSelections']})
	fs.readdir(projectfolder[0],(err,data)=>{
		if(err){
			console.log(err);
		} else {
			console.log(data);
		}
	})
}

function closeApp(){
	aboutWindow.close();
}

app.on('ready',createWindow);
