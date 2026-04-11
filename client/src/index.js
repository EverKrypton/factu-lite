'use strict';

const { app, BrowserWindow, dialog, Menu } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow = null;
let configPath = path.join(app.getPath('userData'), 'factulite-config.json');

function getConfig() {
    try {
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
    } catch(e) {}
    return null;
}

function saveConfig(config) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

const configHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FactuLite Client - Configuracion</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    font-family: 'Segoe UI', Tahoma, sans-serif;
    background: linear-gradient(135deg, #0f2544 0%, #1a3a5c 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
.config-box {
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    text-align: center;
    max-width: 450px;
    width: 90%;
}
.logo {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #0f2544, #2e7d32);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    color: white;
    font-size: 36px;
    font-weight: bold;
}
h1 { color: #0f2544; margin-bottom: 10px; font-size: 24px; }
p { color: #666; margin-bottom: 30px; }
input {
    width: 100%;
    padding: 14px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    margin-bottom: 15px;
    text-align: center;
}
input:focus { outline: none; border-color: #2e7d32; }
button {
    width: 100%;
    padding: 14px;
    background: #2e7d32;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    font-weight: 600;
}
button:hover { background: #1b5e20; }
.error { color: #c62828; margin-top: 10px; font-size: 14px; }
.hint { color: #999; font-size: 12px; margin-top: 15px; }
</style>
</head>
<body>
<div class="config-box">
    <div class="logo">F</div>
    <h1>FactuLite Client</h1>
    <p>Conecta con el servidor FactuLite</p>
    <input type="text" id="serverUrl" placeholder="IP del servidor (ej: 192.168.1.50)">
    <input type="number" id="serverPort" placeholder="Puerto (default: 5000)" value="5000">
    <button onclick="connect()">CONECTAR</button>
    <div id="error" class="error"></div>
    <div class="hint">Asegurate de que el servidor FactuLite este corriendo</div>
</div>
<script>
async function connect() {
    const ip = document.getElementById('serverUrl').value.trim();
    const port = document.getElementById('serverPort').value || '5000';
    
    if (!ip) {
        document.getElementById('error').textContent = 'Ingresa la IP del servidor';
        return;
    }
    
    const url = 'http://' + ip + ':' + port;
    
    try {
        const resp = await fetch(url + '/api/servidor', { timeout: 5000 });
        const data = await resp.json();
        if (data.ip) {
            localStorage.setItem('factuliteServer', url);
            window.location.href = url;
        }
    } catch(e) {
        document.getElementById('error').textContent = 'No se puede conectar al servidor. Verifica la IP y que el servidor este corriendo.';
    }
}
document.getElementById('serverUrl').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') connect();
});
</script>
</body>
</html>
`;

function createWindow() {
    const config = getConfig();
    
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 1024,
        minHeight: 600,
        title: 'FactuLite Client',
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
    
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    
    if (config && config.serverUrl) {
        mainWindow.loadURL(config.serverUrl).catch(() => {
            mainWindow.loadURL('data:text/html,' + encodeURIComponent(configHTML));
        });
    } else {
        mainWindow.loadURL('data:text/html,' + encodeURIComponent(configHTML));
    }
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
    
    app.whenReady().then(createWindow);
    
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
}

const menuTemplate = [
    {
        label: 'FactuLite',
        submenu: [
            { label: 'Configurar Servidor', click: () => {
                if (mainWindow) {
                    mainWindow.loadURL('data:text/html,' + encodeURIComponent(configHTML));
                }
            }},
            { type: 'separator' },
            { role: 'quit' }
        ]
    },
    {
        label: 'Ver',
        submenu: [
            { role: 'reload' },
            { role: 'togglefullscreen' },
            { type: 'separator' },
            { role: 'toggleDevTools' }
        ]
    }
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);
