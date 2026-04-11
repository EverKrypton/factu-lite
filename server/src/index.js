'use strict';

const { app, BrowserWindow, Menu, Tray, shell } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');
const PDFDocument = require('pdfkit');

const dbSQLite = require('./db');
const CONFIG = require('./config');
const views = require('./views');

let db;
let PUERTO = 5000;
let mainWindow = null;
let tray = null;
const connections = new Set();

dbSQLite.initDB();
db = dbSQLite.crearCompatibilidad();

function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { resolve({}); } });
    });
}

function getConfigInstalacion() {
    try {
        if (fs.existsSync('./priceless_config.json')) {
            return JSON.parse(fs.readFileSync('./priceless_config.json', 'utf8'));
        }
    } catch(e) {}
    return null;
}

function getIpLocal() {
    const os = require('os');
    const ifaces = os.networkInterfaces();
    for (const name of Object.keys(ifaces)) {
        for (const iface of ifaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

function encontrarPuertoLibre(puertoInicial) {
    return new Promise((resolve, reject) => {
        const tester = net.createServer();
        tester.once('error', err => {
            if (err.code === 'EADDRINUSE') {
                if (puertoInicial >= 5010) {
                    reject(new Error('No hay puertos disponibles (5000-5010)'));
                } else {
                    resolve(encontrarPuertoLibre(puertoInicial + 1));
                }
            } else {
                reject(err);
            }
        });
        tester.once('listening', () => {
            tester.close(() => resolve(puertoInicial));
        });
        tester.listen(puertoInicial, '0.0.0.0');
    });
}

function shutdown() {
    console.log('Cerrando servidor...');
    server.close(() => {
        if (dbSQLite.closeDB) dbSQLite.closeDB();
        process.exit(0);
    });
    setTimeout(() => {
        connections.forEach(socket => socket.destroy());
        connections.clear();
        process.exit(0);
    }, 3000);
}

const ipLocal = getIpLocal();

const routeModules = [
    require('./routes/auth'),
    require('./routes/productos'),
    require('./routes/facturas'),
    require('./routes/clientes'),
    require('./routes/contabilidad'),
    require('./routes/reportes'),
    require('./routes/compras'),
    require('./routes/cartera'),
    require('./routes/bancario'),
    require('./routes/proformas'),
    require('./routes/hardware'),
    require('./routes/kardex')
];

let context;

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }
    
    const url = req.url.split('?')[0];
    const metodo = req.method;
    
    try {
        if (url.startsWith('/api/')) {
            for (const routeModule of routeModules) {
                const handled = await routeModule(req, res, url, metodo, context, PDFDocument);
                if (handled) return;
            }
            
            if (url === '/api/instalacion' && metodo === 'GET') {
                const c = getConfigInstalacion();
                res.writeHead(200); res.end(JSON.stringify({ completada: c?.instalacion_completada || false, db_path: dbSQLite.dbPath(), ip: ipLocal, puerto: PUERTO, version: CONFIG.version }));
                return;
            }
            if (url === '/api/instalacion' && metodo === 'POST') {
                const data = await parseBody(req);
                if (data.db_path) dbSQLite.initDB(data.db_path);
                fs.writeFileSync('./priceless_config.json', JSON.stringify({ instalacion_completada: true, fecha: new Date().toISOString() }));
                res.writeHead(200); res.end(JSON.stringify({ ok: true }));
                return;
            }
            if (url === '/api/backup-db' && metodo === 'POST') {
                const backupPath = dbSQLite.backup();
                res.writeHead(200); res.end(JSON.stringify({ ok: true, backupPath }));
                return;
            }
            if (url === '/api/servidor' && metodo === 'GET') {
                res.writeHead(200); res.end(JSON.stringify({ ip: ipLocal, puerto: PUERTO, version: CONFIG.version }));
                return;
            }
            if (url === '/api/modulos' && metodo === 'GET') {
                const modulos = dbSQLite.getDB().prepare('SELECT * FROM modulos WHERE enabled = 1 ORDER BY orden').all();
                res.writeHead(200); res.end(JSON.stringify(modulos));
                return;
            }
            if (url === '/api/modulos' && metodo === 'PUT') {
                const data = await parseBody(req);
                const sdb = dbSQLite.getDB();
                sdb.prepare('UPDATE modulos SET enabled = 0').run();
                for (const id of (data.activos || [])) sdb.prepare('UPDATE modulos SET enabled = 1 WHERE id = ?').run(id);
                res.writeHead(200); res.end(JSON.stringify({ ok: true }));
                return;
            }
            if (url === '/api/exportar-db' && metodo === 'GET') {
                try {
                    const tmpPath = dbSQLite.dbPath() + '.export_tmp';
                    dbSQLite.getDB().backup(tmpPath);
                    const dbContent = fs.readFileSync(tmpPath);
                    fs.unlinkSync(tmpPath);
                    res.setHeader('Content-Type', 'application/octet-stream');
                    res.setHeader('Content-Disposition', 'attachment; filename="factulite_backup.db"');
                    res.writeHead(200);
                    res.end(dbContent);
                } catch (e) {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: e.message }));
                }
                return;
            }
            if (url === '/api/importar-db' && metodo === 'POST') {
                const chunks = [];
                req.on('data', chunk => chunks.push(chunk));
                req.on('end', () => {
                    try {
                        const dbPath = dbSQLite.dbPath();
                        const backupPath = dbPath + '.backup_' + Date.now();
                        if (fs.existsSync(dbPath)) fs.copyFileSync(dbPath, backupPath);
                        fs.writeFileSync(dbPath, Buffer.concat(chunks));
                        dbSQLite.initDB(dbPath);
                        res.writeHead(200);
                        res.end(JSON.stringify({ ok: true }));
                    } catch(e) {
                        res.writeHead(500);
                        res.end(JSON.stringify({ error: e.message }));
                    }
                });
                return;
            }
            
            res.writeHead(404); res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
            return;
        }
        
        const c = getConfigInstalacion();
        const esPrimera = !c || !c.instalacion_completada;
        
        if (url === '/instrucciones.html' && metodo === 'GET') {
            const htmlPath = path.join(__dirname, '..', 'instrucciones.html');
            if (fs.existsSync(htmlPath)) {
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.writeHead(200);
                res.end(fs.readFileSync(htmlPath));
                return;
            }
        }
        
        const viewMap = {
            '/': esPrimera ? 'instalacion' : 'login',
            '/login': 'login', '/dashboard': 'dashboard', '/pos': 'pos',
            '/inventario': 'inventario', '/facturas': 'facturas',
            '/compras': 'compras', '/reportes': 'reportes',
            '/usuarios': 'admin', '/clientes': 'clientes',
            '/proveedores': 'proveedores', '/cartera': 'cartera',
            '/contabilidad': 'contabilidad', '/kardex': 'kardex',
            '/bancario': 'bancario', '/proformas': 'proformas',
            '/asientos': 'asientos', '/balance': 'balance',
            '/ordenes': 'ordenes', '/factura-lote': 'facturalote'
        };
        
        const viewName = viewMap[url];
        if (viewName && views[viewName]) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.writeHead(200);
            res.end(views[viewName]);
            return;
        }
        
        res.writeHead(404); res.end('No encontrado');
        
    } catch (error) {
        console.error('Error:', error);
        res.writeHead(500); res.end(JSON.stringify({ error: 'Error interno' }));
    }
});

server.on('connection', socket => {
    connections.add(socket);
    socket.on('close', () => connections.delete(socket));
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error('Puerto ocupado:', err.port);
        process.exit(1);
    }
});

const serverInfoHTML = (ip, port) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>FactuLite Server</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #0f2544 0%, #1a3a5c 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
.card {
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    text-align: center;
    max-width: 500px;
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
h1 { color: #0f2544; margin-bottom: 5px; }
.version { color: #999; font-size: 14px; margin-bottom: 30px; }
.status {
    background: #d4edda;
    color: #155724;
    padding: 10px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-weight: 600;
}
.info {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: left;
}
.info-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}
.info-row:last-child { border: none; }
.info-label { color: #666; }
.info-value { font-weight: 600; color: #0f2544; }
.url-box {
    background: #0f2544;
    color: white;
    padding: 15px;
    border-radius: 8px;
    font-size: 18px;
    margin-bottom: 20px;
    font-family: monospace;
}
button {
    background: #2e7d32;
    color: white;
    border: none;
    padding: 14px 30px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    font-weight: 600;
    margin: 5px;
}
button:hover { background: #1b5e20; }
.hint { color: #999; font-size: 12px; margin-top: 20px; }
</style>
</head>
<body>
<div class="card">
    <div class="logo">F</div>
    <h1>FactuLite Server</h1>
    <p class="version">v${CONFIG.version}</p>
    <div class="status">● Servidor Activo</div>
    <div class="url-box">http://${ip}:${port}</div>
    <div class="info">
        <div class="info-row">
            <span class="info-label">IP del Servidor</span>
            <span class="info-value">${ip}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Puerto</span>
            <span class="info-value">${port}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Base de Datos</span>
            <span class="info-value">${dbSQLite.dbPath()}</span>
        </div>
    </div>
    <button onclick="openBrowser()">Abrir en Navegador</button>
    <button onclick="copyUrl()">Copiar URL</button>
    <p class="hint">Los clientes pueden conectarse a esta URL</p>
</div>
<script>
function openBrowser() { window.open('http://${ip}:${port}'); }
function copyUrl() {
    navigator.clipboard.writeText('http://${ip}:${port}');
    alert('URL copiada!');
}
</script>
</body>
</html>
`;

async function startServer() {
    try {
        PUERTO = await encontrarPuertoLibre(process.env.PORT ? parseInt(process.env.PORT) : 5000);
        context = { CONFIG, dbSQLite, db, ipLocal, PUERTO, parseBody, getConfigInstalacion };
        
        server.listen(PUERTO, '0.0.0.0', () => {
            console.log('Servidor iniciado en puerto', PUERTO);
            if (mainWindow) {
                mainWindow.loadURL('data:text/html,' + encodeURIComponent(serverInfoHTML(ipLocal, PUERTO)));
            }
        });
    } catch (err) {
        console.error('Error iniciando servidor:', err);
        process.exit(1);
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
    
    app.whenReady().then(() => {
        mainWindow = new BrowserWindow({
            width: 550,
            height: 600,
            resizable: false,
            title: 'FactuLite Server',
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true
            }
        });
        
        mainWindow.on('close', (e) => {
            e.preventDefault();
            mainWindow.hide();
        });
        
        startServer();
    });
    
    app.on('before-quit', shutdown);
    
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = { server, dbSQLite, CONFIG };
