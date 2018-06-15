const { app, BrowserWindow, Menu, MenuItem, dialog } = require('electron');
const fs = require('fs');

let mainWindow;
let aboutWindow;

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
    let projectfolder = dialog.showOpenDialog({ properties: ['openDirectory'] })
    let fileList = [];
    createMainConfig(projectfolder[0]);
    readDirectory(projectfolder[0], fileList);
    fileList = fileList.filter((item)=>{
        if(item.match(/[^.]*$/)[0] == "html"){
            return item;
        }
    });

    console.log(fileList);
}

function createMainConfig(path){
    let directoryName = path.match(/[^\\]*$/)[0];
    let projectsConfig = `projects.json`;
    if(fs.existsSync(projectsConfig)){
        console.log('faili arsebobs');
    } else {
        let projects = [];
        projects.push({
            "name": directoryName,
            "path": path
        });
        fs.writeFileSync(projectsConfig,JSON.stringify(projects));
    }
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