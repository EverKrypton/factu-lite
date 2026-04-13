'use strict';
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow = null;

const CONFIG_PATH = path.join(app.getPath('userData'), 'server-config.json');

function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_PATH)) return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch(e) {}
    return null;
}

function saveConfig(cfg) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
}

const CONFIG_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>FactuLite Client — Conectar</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Segoe UI',sans-serif; background:linear-gradient(135deg,#0f2544,#1a3a5c); 
         min-height:100vh; display:flex; align-items:center; justify-content:center; }
  .box { background:white; padding:40px; border-radius:16px; width:420px; max-width:95%; 
         box-shadow:0 20px 60px rgba(0,0,0,0.4); text-align:center; }
  .logo { width:72px; height:72px; background:#f7ac0f; border-radius:14px; 
          display:flex; align-items:center; justify-content:center; font-size:34px; 
          font-weight:900; color:#0f2544; margin:0 auto 16px; }
  h1 { color:#0f2544; font-size:22px; margin-bottom:4px; }
  p { color:#888; font-size:13px; margin-bottom:24px; }
  input { width:100%; padding:14px; border:2px solid #e0e0e0; border-radius:8px; 
          font-size:15px; margin-bottom:12px; text-align:center; outline:none; }
  input:focus { border-color:#f7ac0f; }
  button { width:100%; padding:14px; background:#f7ac0f; color:#0f2544; border:none; 
           border-radius:8px; font-size:16px; font-weight:700; cursor:pointer; margin-bottom:8px; }
  button:hover { background:#e6a000; }
  .err { color:#c62828; font-size:13px; margin-top:8px; }
  .hint { color:#aaa; font-size:11px; margin-top:12px; }
</style>
</head>
<body>
<div class="box">
  <div class="logo">F</div>
  <h1>FactuLite Client</h1>
  <p>Ingresa la IP del servidor FactuLite en tu red</p>
  <input id="ip" placeholder="Ejemplo: 192.168.1.50" type="text">
  <input id="port" placeholder="Puerto (default: 5000)" type="number" value="5000">
  <button onclick="conectar()">CONECTAR</button>
  <div id="err" class="err"></div>
  <div class="hint">Asegúrate que el servidor FactuLite esté corriendo</div>
</div>
<script>
async function conectar() {
  const ip = document.getElementById('ip').value.trim();
  const port = document.getElementById('port').value || '5000';
  if (!ip) { document.getElementById('err').textContent = 'Ingresa la IP del servidor'; return; }
  const url = 'http://' + ip + ':' + port;
  document.getElementById('err').textContent = 'Verificando conexión...';
  try {
    const r = await fetch(url + '/api/servidor', { signal: AbortSignal.timeout(4000) });
    const d = await r.json();
    if (d.ip || d.version) {
      window.__serverUrl = url;
      const { ipcRenderer } = require('electron');
      ipcRenderer.send('save-server-url', url);
      window.location.href = url;
    } else {
      document.getElementById('err').textContent = 'Respuesta inválida del servidor';
    }
  } catch(e) {
    document.getElementById('err').textContent = 'No se puede conectar. Verifica la IP y que el servidor esté activo.';
  }
}
document.getElementById('ip').addEventListener('keypress', e => { if(e.key==='Enter') conectar(); });
</script>
</body>
</html>`;

function createWindow() {
    const config = loadConfig();
    mainWindow = new BrowserWindow({
        width: 1280, height: 800, minWidth: 1024, minHeight: 600,
        title: 'FactuLite Client',
        webPreferences: { nodeIntegration: true, contextIsolation: false }
    });
    
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => { mainWindow = null; });
    
    if (config && config.serverUrl) {
        mainWindow.loadURL(config.serverUrl).catch(() => {
            mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(CONFIG_HTML));
        });
    } else {
        mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(CONFIG_HTML));
    }
}

ipcMain.on('save-server-url', (event, url) => {
    saveConfig({ serverUrl: url });
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => { if (mainWindow) { if (mainWindow.isMinimized()) mainWindow.restore(); mainWindow.focus(); }});
    app.whenReady().then(createWindow);
    app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
}

const menu = Menu.buildFromTemplate([
    { label: 'FactuLite', submenu: [
        { label: 'Cambiar Servidor', click: () => { if (mainWindow) mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(CONFIG_HTML)); }},
        { type: 'separator' },
        { role: 'quit' }
    ]},
    { label: 'Ver', submenu: [
        { role: 'reload' }, { role: 'togglefullscreen' }, { type: 'separator' }, { role: 'toggleDevTools' }
    ]}
]);
Menu.setApplicationMenu(menu);