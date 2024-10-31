const { app, BrowserWindow } = require('electron');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1600,
    height: 1200,
    icon: __dirname + '/electron-assets/landcaster.ico' // Ruta al icono
  });

  win.loadFile('dist/landcaster-app/browser/index.html')
};

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
