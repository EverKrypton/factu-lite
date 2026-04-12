'use strict';

const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow = null;
let configPath = path.join(app.getPath('userData'), 'factulite-config.json');
let dbPath = path.join(app.getPath('userData'), 'factulite-offline.db');

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
    max-width: 500px;
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
h1 { color: #0f2544; margin-bottom: 5px; font-size: 24px; }
.version { color: #999; font-size: 12px; margin-bottom: 20px; }
p { color: #666; margin-bottom: 20px; }
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
    margin-bottom: 10px;
}
button:hover { background: #1b5e20; }
button.secondary { background: #0f2544; }
button.secondary:hover { background: #1a3a5c; }
.error { color: #c62828; margin-top: 10px; font-size: 14px; }
.success { color: #2e7d32; margin-top: 10px; font-size: 14px; }
.hint { color: #999; font-size: 12px; margin-top: 15px; }
.status { 
    padding: 10px; 
    border-radius: 8px; 
    margin-bottom: 15px;
    font-size: 14px;
}
.status.online { background: #d4edda; color: #155724; }
.status.offline { background: #f8d7da; color: #721c24; }
</style>
</head>
<body>
<div class="config-box">
    <div class="logo">F</div>
    <h1>FactuLite Client</h1>
    <p class="version">v1.3.0 - Modo Offline con Usuarios</p>
    
    <div id="status" class="status offline">Verificando conexion...</div>
    
    <input type="text" id="serverUrl" placeholder="IP del servidor (ej: 192.168.1.50)">
    <input type="number" id="serverPort" placeholder="Puerto (default: 5000)" value="5000">
    
    <button onclick="connect()">CONECTAR AL SERVIDOR</button>
    <button class="secondary" onclick="workOffline()">TRABAJAR OFFLINE</button>
    
    <div id="error" class="error"></div>
    <div id="success" class="success"></div>
    <div class="hint">Cada usuario ve su historial. Admin ve todo.</div>
</div>
<script>
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

let serverUrl = '';
let offlineDB = null;
window.offlineDB = null;

async function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('FactuLiteOffline', 2);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            offlineDB = request.result;
            window.offlineDB = request.result;
            resolve(offlineDB);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('productos')) {
                db.createObjectStore('productos', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('clientes')) {
                db.createObjectStore('clientes', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('usuarios')) {
                db.createObjectStore('usuarios', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('facturas')) {
                const store = db.createObjectStore('facturas', { keyPath: 'id', autoIncrement: true });
                store.createIndex('synced', 'synced', { unique: false });
                store.createIndex('usuario', 'usuario', { unique: false });
            }
            if (!db.objectStoreNames.contains('tickets')) {
                const store = db.createObjectStore('tickets', { keyPath: 'id', autoIncrement: true });
                store.createIndex('synced', 'synced', { unique: false });
                store.createIndex('usuario', 'usuario', { unique: false });
            }
            if (!db.objectStoreNames.contains('syncQueue')) {
                db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

async function checkServer() {
    const ip = document.getElementById('serverUrl').value.trim();
    const port = document.getElementById('serverPort').value || '5000';
    const url = 'http://' + ip + ':' + port;
    
    try {
        const resp = await fetch(url + '/api/servidor', { signal: AbortSignal.timeout(3000) });
        const data = await resp.json();
        if (data.ip) {
            document.getElementById('status').className = 'status online';
            document.getElementById('status').textContent = 'Servidor conectado: ' + url;
            serverUrl = url;
            return true;
        }
    } catch(e) {
        document.getElementById('status').className = 'status offline';
        document.getElementById('status').textContent = 'Servidor no disponible - Puedes trabajar offline';
    }
    return false;
}

async function connect() {
    const ip = document.getElementById('serverUrl').value.trim();
    const port = document.getElementById('serverPort').value || '5000';
    
    if (!ip) {
        document.getElementById('error').textContent = 'Ingresa la IP del servidor';
        return;
    }
    
    const url = 'http://' + ip + ':' + port;
    document.getElementById('error').textContent = '';
    document.getElementById('success').textContent = 'Conectando...';
    
    const connected = await checkServer();
    
    if (connected) {
        localStorage.setItem('factuliteServer', url);
        localStorage.setItem('factuliteMode', 'online');
        
        await syncFromServer(url);
        
        document.getElementById('success').textContent = 'Conectado y sincronizado!';
        setTimeout(() => {
            window.location.href = url;
        }, 1000);
    } else {
        document.getElementById('error').textContent = 'No se puede conectar. Verifica la IP o trabaja offline.';
        document.getElementById('success').textContent = '';
    }
}

async function workOffline() {
    localStorage.setItem('factuliteMode', 'offline');
    await initIndexedDB();
    document.getElementById('success').textContent = 'Modo offline activado. Ingresa tus credenciales.';
    setTimeout(() => {
        loadOfflineLogin();
    }, 1000);
}

async function syncFromServer(url) {
    try {
        await initIndexedDB();
        
        const productos = await fetch(url + '/api/productos').then(r => r.json());
        const clientes = await fetch(url + '/api/clientes').then(r => r.json());
        const usuarios = await fetch(url + '/api/usuarios').then(r => r.json());
        
        const tx = offlineDB.transaction(['productos', 'clientes', 'usuarios'], 'readwrite');
        const prodStore = tx.objectStore('productos');
        const clientStore = tx.objectStore('clientes');
        const userStore = tx.objectStore('usuarios');
        
        productos.forEach(p => prodStore.put(p));
        clientes.forEach(c => clientStore.put(c));
        usuarios.forEach(u => {
            userStore.put({
                id: u.id,
                username: u.username,
                password: u.password,
                rol: u.rol,
                nombre: u.nombre,
                activo: u.activo
            });
        });
        
        await new Promise((resolve, reject) => {
            tx.oncomplete = resolve;
            tx.onerror = reject;
        });
        
        console.log('Sincronizados', productos.length, 'productos,', clientes.length, 'clientes,', usuarios.length, 'usuarios');
    } catch(e) {
        console.error('Error sincronizando:', e);
    }
}

function loadOfflineLogin() {
    const html = \`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>FactuLite - Login Offline</title>
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
.login-box {
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    text-align: center;
    max-width: 400px;
    width: 90%;
}
.logo {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, #0f2544, #2e7d32);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    color: white;
    font-size: 32px;
    font-weight: bold;
}
h1 { color: #0f2544; margin-bottom: 5px; font-size: 22px; }
.badge { background: #f7ac0f; color: #0f2544; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; display: inline-block; margin-bottom: 20px; }
input { width: 100%; padding: 14px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px; margin-bottom: 12px; }
input:focus { outline: none; border-color: #2e7d32; }
button { width: 100%; padding: 14px; background: #2e7d32; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; font-weight: 600; }
button:hover { background: #1b5e20; }
.error { color: #c62828; margin-top: 10px; font-size: 14px; }
.link { color: #2e7d32; cursor: pointer; margin-top: 15px; font-size: 14px; }
</style>
</head>
<body>
<div class="login-box">
    <div class="logo">F</div>
    <h1>Iniciar Sesion</h1>
    <span class="badge">MODO OFFLINE</span>
    <input type="text" id="username" placeholder="Usuario">
    <input type="password" id="password" placeholder="Contrasena">
    <button onclick="loginOffline()">INGRESAR</button>
    <div id="error" class="error"></div>
    <div class="link" onclick="backToConfig()">Volver a configuracion</div>
</div>
<script>
async function loginOffline() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username) {
        document.getElementById('error').textContent = 'Ingresa tu usuario';
        return;
    }
    
    const tx = window.offlineDB.transaction(['usuarios'], 'readonly');
    const store = tx.objectStore('usuarios');
    const users = await new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = reject;
    });
    
    const user = users.find(u => u.username === username && u.password === password && u.activo === 1);
    
    if (user) {
        localStorage.setItem('factuliteUser', JSON.stringify({
            id: user.id,
            username: user.username,
            nombre: user.nombre,
            rol: user.rol
        }));
        loadOfflineUI(user);
    } else {
        document.getElementById('error').textContent = 'Usuario o contrasena incorrectos';
    }
}

function backToConfig() {
    location.reload();
}
</script>
</body>
</html>\`;
    document.body.innerHTML = '';
    document.write(html);
}

function loadOfflineUI(currentUser) {
    const isAdmin = currentUser.rol === 'admin';
    const html = \`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>FactuLite - Modo Offline</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', sans-serif; background: #f0f4f8; }
.header { background: linear-gradient(135deg, #0f2544, #1a3a5c); color: white; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; }
.header-left { display: flex; align-items: center; gap: 15px; }
.header h1 { font-size: 18px; }
.user-info { display: flex; align-items: center; gap: 10px; }
.user-name { font-weight: 600; }
.user-role { background: #2e7d32; padding: 3px 10px; border-radius: 10px; font-size: 11px; }
.badge { background: #f7ac0f; color: #0f2544; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
.btn-logout { background: transparent; border: 1px solid white; color: white; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; }
.container { padding: 20px; max-width: 1200px; margin: 0 auto; }
.tabs { display: flex; gap: 10px; margin-bottom: 20px; }
.tab { padding: 12px 24px; background: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; }
.tab.active { background: #2e7d32; color: white; }
.card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 20px; }
.sync-banner { background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
.sync-banner button { background: #0f2544; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
th { background: #f8f9fa; font-weight: 600; color: #0f2544; }
input, select { padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
.btn { padding: 10px 20px; background: #2e7d32; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; }
.btn:hover { background: #1b5e20; }
.filter-row { margin-bottom: 15px; }
.filter-row select { padding: 8px; border-radius: 6px; }
</style>
</head>
<body>
<div class="header">
    <div class="header-left">
        <h1>FactuLite</h1>
        <span class="badge">OFFLINE</span>
    </div>
    <div class="user-info">
        <span class="user-name">\${currentUser.nombre}</span>
        <span class="user-role">\${currentUser.rol.toUpperCase()}</span>
        <button class="btn-logout" onclick="logout()">Cerrar Sesion</button>
    </div>
</div>
<div class="container">
    <div class="sync-banner">
        <span>Pendientes por sincronizar: <strong id="pendingCount">0</strong></span>
        <button onclick="trySync()">Sincronizar con Servidor</button>
    </div>
    
    <div class="tabs">
        <button class="tab active" onclick="showTab('pos')">POS</button>
        <button class="tab" onclick="showTab('productos')">Productos</button>
        <button class="tab" onclick="showTab('clientes')">Clientes</button>
        <button class="tab" onclick="showTab('historial')">Mi Historial</button>
        \${isAdmin ? '<button class="tab" onclick="showTab(\'admin\')">Todo el Historial</button>' : ''}
    </div>
    
    <div id="content"></div>
</div>
<script>
let productos = [];
let clientes = [];
let carrito = [];
const currentUser = \${JSON.stringify(currentUser)};
const isAdmin = \${isAdmin};

async function loadData() {
    const tx = window.offlineDB.transaction(['productos', 'clientes', 'facturas', 'tickets'], 'readonly');
    productos = await getAll(tx.objectStore('productos'));
    clientes = await getAll(tx.objectStore('clientes'));
    updatePendingCount();
}

function getAll(store) {
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = reject;
    });
}

async function updatePendingCount() {
    const tx = window.offlineDB.transaction(['syncQueue'], 'readonly');
    const queue = await getAll(tx.objectStore('syncQueue'));
    document.getElementById('pendingCount').textContent = queue.length;
}

function showTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    if (tab === 'pos') renderPOS();
    else if (tab === 'productos') renderProductos();
    else if (tab === 'clientes') renderClientes();
    else if (tab === 'historial') renderHistorial(false);
    else if (tab === 'admin') renderHistorial(true);
}

function renderPOS() {
    document.getElementById('content').innerHTML = \`
    <div class="card">
        <h2 style="margin-bottom:15px;">Punto de Venta - \${currentUser.nombre}</h2>
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;">
            <div>
                <input type="text" id="buscarProd" placeholder="Buscar producto..." style="width:100%;margin-bottom:10px;" onkeyup="filtrarProductos()">
                <div id="listaProd" style="max-height:400px;overflow-y:auto;"></div>
            </div>
            <div>
                <h3>Carrito</h3>
                <div id="carrito" style="min-height:200px;"></div>
                <div style="margin-top:10px;padding:10px;background:#f0f4f8;border-radius:8px;">
                    <strong>Total: C$ <span id="totalCarrito">0.00</span></strong>
                </div>
                <button class="btn" style="width:100%;margin-top:10px;" onclick="guardarFactura()">Guardar Factura</button>
                <button class="btn" style="width:100%;margin-top:10px;background:#0f2544;" onclick="guardarTicket()">Guardar Ticket</button>
            </div>
        </div>
    </div>\`;
    filtrarProductos();
}

function filtrarProductos() {
    const q = document.getElementById('buscarProd')?.value?.toLowerCase() || '';
    const filtrados = productos.filter(p => p.nombre?.toLowerCase().includes(q) || p.codigo_barra?.includes(q));
    document.getElementById('listaProd').innerHTML = filtrados.slice(0,20).map(p => \`
        <div style="display:flex;justify-content:space-between;padding:10px;border:1px solid #eee;border-radius:6px;margin-bottom:8px;cursor:pointer;" onclick="agregarCarrito(\${JSON.stringify(p).replace(/"/g, '&quot;')})">
            <div><strong>\${p.nombre}</strong><br><small>\${p.codigo_barra || '-'}</small></div>
            <div style="text-align:right;"><strong>C$ \${p.precio?.toFixed(2)}</strong><br><small>Stock: \${p.cantidad}</small></div>
        </div>\`).join('') || '<p style="color:#999;text-align:center;padding:20px;">No hay productos</p>';
}

function agregarCarrito(p) {
    const existing = carrito.find(c => c.id === p.id);
    if (existing) existing.cantidad++;
    else carrito.push({...p, cantidad: 1});
    renderCarrito();
}

function renderCarrito() {
    document.getElementById('carrito').innerHTML = carrito.map((p, i) => \`
        <div style="display:flex;justify-content:space-between;padding:8px;border-bottom:1px solid #eee;">
            <span>\${p.nombre} x\${p.cantidad}</span>
            <span>C$ \${(p.cantidad * p.precio).toFixed(2)}</span>
        </div>\`).join('') || '<p style="color:#999;text-align:center;padding:20px;">Carrito vacio</p>';
    const total = carrito.reduce((s, p) => s + p.cantidad * p.precio, 0);
    document.getElementById('totalCarrito').textContent = total.toFixed(2);
}

async function guardarFactura() {
    if (carrito.length === 0) { alert('Carrito vacio'); return; }
    const total = carrito.reduce((s, p) => s + p.cantidad * p.precio, 0);
    const factura = {
        tipo: 'factura',
        items: carrito,
        total,
        cliente_nombre: 'Publico General',
        fecha: new Date().toISOString(),
        usuario_id: currentUser.id,
        usuario: currentUser.username,
        usuario_nombre: currentUser.nombre,
        synced: false
    };
    
    const tx = window.offlineDB.transaction(['facturas', 'syncQueue'], 'readwrite');
    const facStore = tx.objectStore('facturas');
    const queueStore = tx.objectStore('syncQueue');
    
    facStore.add(factura);
    queueStore.add({ tipo: 'factura', data: factura, fecha: new Date().toISOString(), usuario: currentUser.username });
    
    await new Promise(r => { tx.oncomplete = r; });
    
    carrito = [];
    renderCarrito();
    updatePendingCount();
    alert('Factura guardada localmente por ' + currentUser.nombre + '. Sincroniza cuando haya conexion.');
}

async function guardarTicket() {
    if (carrito.length === 0) { alert('Carrito vacio'); return; }
    const total = carrito.reduce((s, p) => s + p.cantidad * p.precio, 0);
    const ticket = {
        tipo: 'ticket',
        items: carrito,
        total,
        fecha: new Date().toISOString(),
        usuario_id: currentUser.id,
        usuario: currentUser.username,
        usuario_nombre: currentUser.nombre,
        synced: false
    };
    
    const tx = window.offlineDB.transaction(['tickets', 'syncQueue'], 'readwrite');
    const tickStore = tx.objectStore('tickets');
    const queueStore = tx.objectStore('syncQueue');
    
    tickStore.add(ticket);
    queueStore.add({ tipo: 'ticket', data: ticket, fecha: new Date().toISOString(), usuario: currentUser.username });
    
    await new Promise(r => { tx.oncomplete = r; });
    
    carrito = [];
    renderCarrito();
    updatePendingCount();
    alert('Ticket guardado localmente por ' + currentUser.nombre + '. Sincroniza cuando haya conexion.');
}

function renderProductos() {
    document.getElementById('content').innerHTML = \`
    <div class="card">
        <h2 style="margin-bottom:15px;">Productos (<span id="prodCount">\${productos.length}</span>)</h2>
        <table><thead><tr><th>Codigo</th><th>Nombre</th><th>Precio</th><th>Stock</th></tr></thead>
        <tbody id="prodTable"></tbody></table>
    </div>\`;
    document.getElementById('prodTable').innerHTML = productos.map(p => \`
        <tr><td>\${p.codigo_barra || '-'}</td><td>\${p.nombre}</td><td>C$ \${p.precio?.toFixed(2)}</td><td>\${p.cantidad}</td></tr>\`).join('');
}

function renderClientes() {
    document.getElementById('content').innerHTML = \`
    <div class="card">
        <h2 style="margin-bottom:15px;">Clientes (<span id="clientCount">\${clientes.length}</span>)</h2>
        <table><thead><tr><th>Nombre</th><th>RUC</th><th>Telefono</th></tr></thead>
        <tbody id="clientTable"></tbody></table>
    </div>\`;
    document.getElementById('clientTable').innerHTML = clientes.map(c => \`
        <tr><td>\${c.nombre}</td><td>\${c.ruc || '-'}</td><td>\${c.telefono || '-'}</td></tr>\`).join('');
}

async function renderHistorial(verTodos) {
    const tx = window.offlineDB.transaction(['facturas', 'tickets'], 'readonly');
    let facturas = await getAll(tx.objectStore('facturas'));
    let tickets = await getAll(tx.objectStore('tickets'));
    
    if (!verTodos && !isAdmin) {
        facturas = facturas.filter(f => f.usuario_id === currentUser.id);
        tickets = tickets.filter(t => t.usuario_id === currentUser.id);
    }
    
    const todos = [...facturas, ...tickets].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    const titulo = verTodos ? 'Todo el Historial (Admin)' : 'Mi Historial';
    
    document.getElementById('content').innerHTML = \`
    <div class="card">
        <h2 style="margin-bottom:15px;">\${titulo}</h2>
        <table><thead><tr><th>Tipo</th><th>Usuario</th><th>Fecha</th><th>Total</th><th>Estado</th></tr></thead>
        <tbody id="histTable"></tbody></table>
    </div>\`;
    document.getElementById('histTable').innerHTML = todos.map(d => \`
        <tr>
            <td>\${d.tipo}</td>
            <td>\${d.usuario_nombre || d.usuario || '-'}</td>
            <td>\${new Date(d.fecha).toLocaleString()}</td>
            <td>C$ \${d.total?.toFixed(2)}</td>
            <td style="color:\${d.synced ? 'green' : 'orange'}">\${d.synced ? 'Sincronizado' : 'Pendiente'}</td>
        </tr>\`).join('') || '<tr><td colspan="5" style="text-align:center;color:#999;">Sin registros</td></tr>';
}

async function trySync() {
    const ip = document.getElementById('serverUrl')?.value || localStorage.getItem('factuliteServer')?.replace('http://', '').split(':')[0];
    const port = document.getElementById('serverPort')?.value || '5000';
    const url = 'http://' + ip + ':' + port;
    
    try {
        const resp = await fetch(url + '/api/servidor', { signal: AbortSignal.timeout(3000) });
        const data = await resp.json();
        
        if (data.ip) {
            const tx = window.offlineDB.transaction(['syncQueue'], 'readonly');
            const queue = await getAll(tx.objectStore('syncQueue'));
            
            let synced = 0;
            for (const item of queue) {
                try {
                    const endpoint = item.tipo === 'factura' ? '/api/factura' : '/api/ticket';
                    const r = await fetch(url + endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item.data)
                    });
                    if (r.ok) {
                        const tx2 = window.offlineDB.transaction([item.tipo + 's'], 'readwrite');
                        const store = tx2.objectStore(item.tipo + 's');
                        const allItems = await getAll(window.offlineDB.transaction([item.tipo + 's'], 'readonly').objectStore(item.tipo + 's'));
                        const found = allItems.find(x => x.fecha === item.data.fecha && x.total === item.data.total);
                        if (found) {
                            found.synced = true;
                            store.put(found);
                        }
                        await new Promise(r2 => { tx2.oncomplete = r2; });
                        synced++;
                    }
                } catch(e) {}
            }
            
            if (synced > 0) {
                const tx3 = window.offlineDB.transaction(['syncQueue'], 'readwrite');
                tx3.objectStore('syncQueue').clear();
                await new Promise(r => { tx3.oncomplete = r; });
            }
            
            updatePendingCount();
            alert('Sincronizados ' + synced + ' de ' + queue.length + ' registros');
        }
    } catch(e) {
        alert('No hay conexion con el servidor');
    }
}

function logout() {
    localStorage.removeItem('factuliteUser');
    location.reload();
}

loadData().then(() => renderPOS());
</script>
</body>
</html>\`;
    document.body.innerHTML = '';
    document.write(html);
}

document.getElementById('serverUrl').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') connect();
});

const config = JSON.parse(localStorage.getItem('factulite-config') || '{}');
if (config.serverIp) document.getElementById('serverUrl').value = config.serverIp;

checkServer();
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
            nodeIntegration: true,
            contextIsolation: false
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
            { label: 'Trabajar Offline', click: () => {
                if (mainWindow) {
                    mainWindow.loadURL('data:text/html,' + encodeURIComponent(configHTML));
                    mainWindow.webContents.executeJavaScript('workOffline()');
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
