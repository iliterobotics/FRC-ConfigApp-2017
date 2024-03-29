const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const url = require('url')
let win

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600, show:false})

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  win.once('ready-to-show', () => {
    win.show();
  });
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

//Menu.setApplicationMenu(new Menu()); //null out the inspect element menu
