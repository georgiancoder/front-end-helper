const { app, BrowserWindow, Menu, MenuItem } = require('electron');
const fs = require('fs');
const Functions = require('./functions');

let mainWindow;
let aboutWindow;

let projectList = [];

function createWindow() {

    mainWindow = new BrowserWindow();
    // mainWindow.webContents.openDevTools();
    const menuTemplate = [{
            label: 'File',
            submenu: [
                { label: 'New Project', click() { Functions.newProject(projectList) } },
                { label: 'Exit', role: 'close' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                { label: 'About', click() { About(); } }
            ]
        }
    ];

    let menu = Menu.buildFromTemplate(menuTemplate);

    mainWindow.setMenu(menu);

    mainWindow.loadURL(`file://${__dirname}/views/index.html`);
    mainWindow.on('close', Functions.closeApp);
}


function About() {
    aboutWindow = new BrowserWindow({ parent: 'top', width: 300, height: 300, frame: false });
    aboutWindow.setMenuBarVisibility(false);
    aboutWindow.loadURL(`file://${__dirname}/views/about.html`);
    aboutWindow.on('blur', () => {
        aboutWindow.close();
    })
}


app.on('ready', createWindow);