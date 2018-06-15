const { app, BrowserWindow, Menu, MenuItem, dialog } = require('electron');
const fs = require('fs');

let mainWindow;
let aboutWindow;
let newProjectWindow;

function createWindow() {

    mainWindow = new BrowserWindow();
    const menuTemplate = [{
            label: 'File',
            submenu: [
                { label: 'New Project', click() { newProject() } },
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
    mainWindow.on('close', closeApp);
}


function About() {
    aboutWindow = new BrowserWindow({ parent: 'top', width: 300, height: 300, frame: false });
    aboutWindow.setMenuBarVisibility(false);
    aboutWindow.loadURL(`file://${__dirname}/views/about.html`);
    aboutWindow.on('blur', () => {
        aboutWindow.close();
    })
}

function newProject() {
    let projectfolder = dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] })
    let fileList = [];
    readDirectory(projectfolder[0], fileList);
    console.log(fileList.length);
}

function readDirectory(path, list) {
    let files = fs.readdirSync(path);
    files.forEach((file) => {
        let filePath = `${path}\\${file}`;
        let fileStat = fs.lstatSync(filePath);
        if (fileStat.isDirectory()) {
            readDirectory(filePath, list);
        } else {
            list.push(filePath);
        }
    });
}

function closeApp() {
    aboutWindow.close();
}

app.on('ready', createWindow);