'use strict';

const { app, BrowserWindow, dialog } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');
const PDFDocument = require('pdfkit');

const dbSQLite = require('./db');
const CONFIG = require('./config');
const views = require('./views');
const migracion = require('./migracion/migrar');

let db;
let PUERTO = 5000;
let mainWindow = null;
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
        const { app } = require('electron');
        const configPath = path.join(app.getPath('userData'), 'priceless_config.json');
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
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
                const configPath = path.join(dbSQLite.getSafeDataPath(), 'priceless_config.json');
                fs.writeFileSync(configPath, JSON.stringify({ instalacion_completada: true, fecha: new Date().toISOString() }));
                res.writeHead(200); res.end(JSON.stringify({ ok: true }));
                return;
            }
            if (url === '/api/cambiar-db' && metodo === 'POST') {
                try {
                    const data = await parseBody(req);
                    if (!data.path) {
                        res.writeHead(400); res.end(JSON.stringify({ error: 'Path requerido' }));
                        return;
                    }
                    dbSQLite.initDB(data.path);
                    res.writeHead(200); res.end(JSON.stringify({ ok: true, db_path: dbSQLite.dbPath() }));
                } catch(e) {
                    res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
                }
                return;
            }
            if (url === '/api/backup-db' && metodo === 'POST') {
                const backupPath = dbSQLite.backup();
                res.writeHead(200); res.end(JSON.stringify({ ok: true, backupPath }));
                return;
            }
            if (url === '/api/servidor' && metodo === 'GET') {
                res.writeHead(200); res.end(JSON.stringify({ ip: ipLocal, puerto: PUERTO, version: CONFIG.version, db_path: dbSQLite.dbPath() }));
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
            if (url === '/api/optimizar-db' && metodo === 'POST') {
                try {
                    const result = dbSQLite.optimizarDB ? dbSQLite.optimizarDB() : false;
                    const stats = fs.statSync(dbSQLite.dbPath());
                    res.writeHead(200);
                    res.end(JSON.stringify({ 
                        ok: result, 
                        dbSize: (stats.size / 1024 / 1024).toFixed(2) + ' MB',
                        message: result ? 'DB optimizada correctamente' : 'Optimización no disponible'
                    }));
                } catch(e) {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: e.message }));
                }
                return;
            }
            if (url === '/api/actualizar' && metodo === 'GET') {
                res.writeHead(200);
                res.end(JSON.stringify({ disponible: false, version: CONFIG.VERSION || '1.0.0' }));
                return;
            }
            if (url === '/api/migrar/analizar' && metodo === 'POST') {
                try {
                    const data = await parseBody(req);
                    if (!data.archivo) {
                        res.writeHead(400);
                        res.end(JSON.stringify({ error: 'Se requiere la ruta del archivo' }));
                        return;
                    }
                    if (!fs.existsSync(data.archivo)) {
                        res.writeHead(404);
                        res.end(JSON.stringify({ error: 'Archivo no encontrado' }));
                        return;
                    }
                    const analisis = migracion.analizarEstructura(data.archivo);
                    res.writeHead(200);
                    res.end(JSON.stringify(analisis));
                } catch(e) {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: e.message }));
                }
                return;
            }
            if (url === '/api/migrar/ejecutar' && metodo === 'POST') {
                try {
                    const data = await parseBody(req);
                    if (!data.archivo) {
                        res.writeHead(400);
                        res.end(JSON.stringify({ error: 'Se requiere la ruta del archivo' }));
                        return;
                    }
                    if (!fs.existsSync(data.archivo)) {
                        res.writeHead(404);
                        res.end(JSON.stringify({ error: 'Archivo no encontrado' }));
                        return;
                    }
                    const resultado = migracion.migrar(data.archivo, dbSQLite.dbPath());
                    res.writeHead(200);
                    res.end(JSON.stringify(resultado));
                } catch(e) {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: e.message }));
                }
                return;
            }
            if (url === '/api/migrar/subir' && metodo === 'POST') {
                const chunks = [];
                req.on('data', chunk => chunks.push(chunk));
                req.on('end', () => {
                    try {
                        const filename = `migracion_${Date.now()}.sql`;
                        const filepath = path.join(process.cwd(), 'uploads', filename);
                        if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads', { recursive: true });
                        fs.writeFileSync(filepath, Buffer.concat(chunks));
                        
                        const analisis = migracion.analizarEstructura(filepath);
                        analisis.archivo = filepath;
                        
                        res.writeHead(200);
                        res.end(JSON.stringify(analisis));
                    } catch(e) {
                        res.writeHead(500);
                        res.end(JSON.stringify({ error: e.message }));
                    }
                });
                return;
            }
            if (url === '/api/imagenes' && metodo === 'POST') {
                try {
                    const data = await parseBody(req);
                    if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads', { recursive: true });
                    if (!fs.existsSync('./uploads/productos')) fs.mkdirSync('./uploads/productos', { recursive: true });
                    
                    const filename = `${Date.now()}_${data.producto_id}.jpg`;
                    const filepath = `./uploads/productos/${filename}`;
                    const buffer = Buffer.from(data.imagen.replace(/^data:image\/\w+;base64,/, ''), 'base64');
                    fs.writeFileSync(filepath, buffer);
                    
                    const sdb = dbSQLite.getDB();
                    sdb.prepare('UPDATE productos SET imagen = ? WHERE id = ?').run(filename, data.producto_id);
                    res.writeHead(200);
                    res.end(JSON.stringify({ ok: true, filename }));
                } catch(e) {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: e.message }));
                }
                return;
            }
            if (url.startsWith('/api/imagenes/') && metodo === 'GET') {
                const filename = url.replace('/api/imagenes/', '');
                const filepath = `./uploads/productos/${filename}`;
                if (fs.existsSync(filepath)) {
                    res.setHeader('Content-Type', 'image/jpeg');
                    res.writeHead(200);
                    res.end(fs.readFileSync(filepath));
                } else {
                    res.writeHead(404);
                    res.end('Not found');
                }
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
            '/ordenes': 'ordenes', '/factura-lote': 'facturalote',
            '/conciliacion': 'conciliacion'
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
        dialog.showErrorBox('Puerto ocupado',
            'El puerto ' + err.port + ' está en uso.\n' +
            'Cierra otras instancias de FactuLite e intenta de nuevo.');
        app.quit();
        process.exit(1);
    }
});

async function startServer() {
    try {
        PUERTO = await encontrarPuertoLibre(process.env.PORT ? parseInt(process.env.PORT) : 5000);
        context = { CONFIG, dbSQLite, db, ipLocal, PUERTO, parseBody, getConfigInstalacion };
        
        server.listen(PUERTO, '0.0.0.0', () => {
            console.log('Servidor iniciado en puerto', PUERTO);
            if (mainWindow) {
                const url = 'http://' + ipLocal + ':' + PUERTO;
                const statusHTML = generarStatusHTML(url);
                mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(statusHTML));
            }
        });
    } catch (err) {
        console.error('Error iniciando servidor:', err);
        dialog.showErrorBox('Error al iniciar', err.message);
        app.quit();
        process.exit(1);
    }
}

function generarStatusHTML(url) {
    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', sans-serif; background: #0f2544; color: white; 
         display:flex; flex-direction:column; align-items:center; justify-content:center; 
         height:100vh; padding:30px; }
  .logo { font-size:48px; font-weight:900; color:#f7ac0f; margin-bottom:8px; }
  .status { color:#56a805; font-size:14px; margin-bottom:24px; display:flex; align-items:center; gap:8px; }
  .dot { width:10px; height:10px; background:#56a805; border-radius:50%; animation:pulse 1.5s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .url-box { background:#1a3a5c; border:2px solid #f7ac0f; border-radius:12px; padding:16px 28px; 
             font-size:22px; font-weight:700; color:#f7ac0f; letter-spacing:1px; margin-bottom:8px; 
             cursor:pointer; user-select:all; }
  .hint { color:#aaa; font-size:12px; margin-bottom:20px; }
  .local { color:#666; font-size:12px; }
  button { background:#f7ac0f; color:#0f2544; border:none; border-radius:8px; 
           padding:10px 24px; font-size:14px; font-weight:700; cursor:pointer; margin-top:16px; }
  button:hover { background:#e6a000; }
</style></head>
<body>
  <div class="logo">F</div>
  <div class="status"><div class="dot"></div> Servidor Activo — Puerto ${PUERTO}</div>
  <div class="url-box" onclick="copyURL()" title="Clic para copiar">${url}</div>
  <div class="hint">↑ Usa esta URL en los clientes de tu red. Clic para copiar.</div>
  <div class="local">También accesible en esta PC: http://localhost:${PUERTO}</div>
  <button onclick="openBrowser()">Abrir en Navegador</button>
  <script>
    function copyURL() {
      navigator.clipboard.writeText('${url}').then(() => {
        document.querySelector('.url-box').textContent = '¡Copiado!';
        setTimeout(() => { document.querySelector('.url-box').textContent = '${url}'; }, 1500);
      });
    }
    function openBrowser() {
      window.open('${url}');
    }
  </script>
</body></html>`;
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
        const iconPath = path.join(__dirname, '..', 'build', 'icon.ico');
        const windowOptions = {
            width: 480,
            height: 340,
            resizable: false,
            title: 'FactuLite Server',
            webPreferences: { nodeIntegration: false, contextIsolation: true }
        };
        if (fs.existsSync(iconPath)) {
            windowOptions.icon = iconPath;
        }
        mainWindow = new BrowserWindow(windowOptions);
        
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
