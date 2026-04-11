'use strict';

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
    console.log('\nCerrando servidor...');
    server.close(() => {
        if (dbSQLite.closeDB) dbSQLite.closeDB();
        console.log('Servidor cerrado correctamente');
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
                    console.error('Error exportando DB:', e);
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
        console.error('ERROR: Puerto', err.port, 'está en uso.');
        process.exit(1);
    }
});

async function startServer() {
    try {
        PUERTO = await encontrarPuertoLibre(process.env.PORT ? parseInt(process.env.PORT) : 5000);
        context = { CONFIG, dbSQLite, db, ipLocal, PUERTO, parseBody, getConfigInstalacion };
        
        server.listen(PUERTO, '0.0.0.0', () => {
            console.log('');
            console.log('╔══════════════════════════════════════════════════════════╗');
            console.log('║           FACTULITE SERVER v' + CONFIG.version + '                       ║');
            console.log('╠══════════════════════════════════════════════════════════╣');
            console.log('║  Puerto: ' + PUERTO);
            console.log('║  Local:  http://localhost:' + PUERTO);
            console.log('║  Red:    http://' + ipLocal + ':' + PUERTO);
            console.log('║  DB:     ' + dbSQLite.dbPath());
            console.log('╠══════════════════════════════════════════════════════════╣');
            console.log('║  Los clientes pueden conectarse a:                       ║');
            console.log('║  http://' + ipLocal + ':' + PUERTO);
            console.log('╚══════════════════════════════════════════════════════════╝');
            console.log('');
        });
    } catch (err) {
        console.error('Error iniciando servidor:', err);
        process.exit(1);
    }
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();

module.exports = { server, dbSQLite, CONFIG };
