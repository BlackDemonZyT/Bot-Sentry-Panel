const { app, BrowserWindow } = require('electron')
const express = require('express');
const server = express();


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + '/icon.ico',
    //frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  server.use('/', express.static(__dirname));
  const infos = server.listen(0, 'localhost', () => win.loadURL(`http://localhost:${infos.address().port}/start/index.html`));
  win.loadFile('start/index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('browser-window-created',function(e,window) {
    window.setMenu(null);
});

// Enable live reload for all the files inside your project directory
require('electron-reload')(__dirname);

const electron = require('electron')

// Enable live reload for Electron too
require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
});