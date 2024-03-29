const { app, BrowserWindow } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    fullscreen: true,
  });

  // win.webContents.openDevTools();

  win.loadURL("http://localhost:3000");

  win.once("ready-to-show", () => {
    win.show();
  });
};

// app.whenReady().then(() => {
//   createWindow();
// });

app.on("window-all-closed", () => {
  // if (process.platform !== "darwin")
  app.quit();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// npm run make
