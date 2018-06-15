const { app, BrowserWindow, Menu, MenuItem, dialog } = require('electron');
const fs = require('fs');

let mainWindow;
let aboutWindow;

let projectList = [];

function createWindow() {

    mainWindow = new BrowserWindow();
    // mainWindow.webContents.openDevTools();
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
    if (projectfolder) {
        createMainConfig(projectfolder[0]);
        readDirectory(projectfolder[0], fileList);
        fileList = fileList.filter((item) => {
            if (item.match(/[^.]*$/)[0] == "html") {
                return item;
            }
        });
    }
}

function createMainConfig(path) {
    let directoryName = path.match(/[^\\]*$/)[0];
    let projectsConfig = `projects.json`;
    if (fs.existsSync(projectsConfig)) {
        projectList = fs.readFileSync(projectsConfig).toString();
        projectList = projectList.length>0 ? JSON.parse(projectList) : [];   
        if (isInProjects(projectList, path)) {
            dialog.showMessageBox({message: 'Project already exists!'});
        } else {
            projectList.push({
                "name": directoryName,
                "path": path
            });
            fs.writeFileSync(projectsConfig, JSON.stringify(projectList));
        }
    } else {
        projectList.push({
            "name": directoryName,
            "path": path
        });
        fs.writeFileSync(projectsConfig, JSON.stringify(projectList));
    }
}

function isInProjects(projects, path) {
    let is = false;
    projects.forEach(project => {
        if (path.indexOf(project.path) >= 0) {
            is = true;
        }
    });
    return is;
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
    if(aboutWindow){
        aboutWindow.close();    
    }
}

app.on('ready', createWindow);