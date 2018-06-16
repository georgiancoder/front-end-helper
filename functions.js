const { dialog } = require('electron');
const fs = require('fs');

class Functions {
    newProject(projectList) {
        let projectfolder = dialog.showOpenDialog({ properties: ['openDirectory'] })
        let fileList = [];
        if (projectfolder) {
            this.createMainConfig(projectfolder[0], projectList);
            this.readDirectory(projectfolder[0], fileList);
            fileList = fileList.filter((item) => {
                if (item.match(/[^.]*$/)[0] == "html") {
                    return item;
                }
            });
            this.readFiles(fileList);
        }
    }


    createMainConfig(path, projectList) {
        let directoryName = path.match(/[^\\]*$/)[0];
        let projectsConfig = `projects.json`;
        if (fs.existsSync(projectsConfig)) {
            projectList = fs.readFileSync(projectsConfig).toString();
            projectList = projectList.length>0 ? JSON.parse(projectList) : [];
            if (this.isInProjects(projectList, path)) {
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

    readFiles(files){
        var regex = /<body[^>]*>((.|[\n\r])*)<\/body>/g;
        files.forEach(file=>{
            let fileContent = fs.readFileSync(file).toString();
            let fileBody = fileContent.match(regex)[0];
            console.log(fileBody);
        });
    }

    isInProjects(projects, path) {
        let is = false;
        projects.forEach(project => {
            if (path.indexOf(project.path) >= 0) {
                is = true;
            }
        });
        return is;
    }

    readDirectory(path, list) {
        let files = fs.readdirSync(path);
        files.forEach((file) => {
            let filePath = `${path}\\${file}`;
            let fileStat = fs.lstatSync(filePath);
            if (fileStat.isDirectory()) {
                this.readDirectory(filePath, list);
            } else {
                list.push(filePath);
            }
        });
    }

    closeApp() {
        if(aboutWindow){
            aboutWindow.close();
        }
    }
}

module.exports = new Functions();