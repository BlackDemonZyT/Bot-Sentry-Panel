const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    //frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

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