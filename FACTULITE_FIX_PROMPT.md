# PROMPT: FactuLite v1.7.0 — Fix Completo de Bugs Críticos

> **Modelo destino:** Minimax 2.5  
> **Proyecto:** FactuLite — Sistema de facturación Electron + Node.js (sin framework) + SQLite (better-sqlite3)  
> **Urgencia:** PRODUCCIÓN — Entrega inmediata  
> **Stack:** Electron 28, Vanilla JS, SQLite better-sqlite3, PDFKit, Node.js HTTP nativo  

---

## CONTEXTO DEL PROYECTO

FactuLite es una aplicación de escritorio (Electron) con arquitectura cliente-servidor local:

- **`server/`** — Proceso principal Electron. Levanta un servidor HTTP Node.js nativo en el puerto 5000 que sirve la UI y la API REST. Usa SQLite (`priceless.db`) como base de datos. **NO usa Express ni ningún framework**.
- **`client/`** — Segunda instalación Electron que solo abre una ventana browser apuntando a la IP del servidor.

La UI es HTML/CSS/JS vanilla inyectado como strings desde `server/src/views/index.js`. Cada vista es una función que retorna un string HTML completo.

---

## BUGS CRÍTICOS A CORREGIR — LISTA EXHAUSTIVA

### 🔴 BUG 1: Instalación se repite en cada apertura (CRÍTICO - BLOQUEANTE)

**Archivo:** `server/src/index.js` y `server/src/db.js`

**Problema:** La función `getConfigInstalacion()` busca `priceless_config.json` en `getSafeDataPath()`, pero `getSafeDataPath()` usa `process.execPath` en producción (build), que apunta dentro de los archivos ASAR. Al cerrarse la app, el JSON nunca persiste porque la ruta calculada cambia entre sesiones o no es escribible. La condición `esPrimera = !c || !c.instalacion_completada` siempre es `true`.

**Fix requerido en `server/src/index.js`:**
```javascript
// REEMPLAZAR getConfigInstalacion() con esto:
function getConfigInstalacion() {
    try {
        // En Electron, app.getPath('userData') es la única ruta confiable y persistente
        const { app } = require('electron');
        const configPath = path.join(app.getPath('userData'), 'priceless_config.json');
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
    } catch(e) {
        console.error('Error leyendo config instalacion:', e);
    }
    return null;
}

// REEMPLAZAR el handler POST /api/instalacion para que guarde en app.getPath('userData'):
if (url === '/api/instalacion' && metodo === 'POST') {
    const data = await parseBody(req);
    const { app } = require('electron');
    const configPath = path.join(app.getPath('userData'), 'priceless_config.json');
    const config = { instalacion_completada: true, fecha: new Date().toISOString() };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    res.writeHead(200); res.end(JSON.stringify({ ok: true }));
    return;
}
```

**Fix requerido en `server/src/db.js` — `getSafeDataPath()`:**
```javascript
function getSafeDataPath() {
    try {
        if (process.type === 'browser' || process.versions.electron) {
            const { app } = require('electron');
            // app.getPath('userData') es siempre escribible y persistente entre sesiones
            const userDataPath = app.getPath('userData');
            if (!fs.existsSync(userDataPath)) fs.mkdirSync(userDataPath, { recursive: true });
            return userDataPath;
        }
    } catch(e) {}
    // Fallback para modo CLI (node src/index.js)
    return path.dirname(process.execPath);
}
```

**También:** En `server/src/index.js`, el router principal debe evaluar `esPrimera` en cada request (no en un closure estático), porque después de la instalación el flag debe cambiar sin reiniciar:
```javascript
// CAMBIAR: la constante esPrimera debe calcularse en cada request HTTP, no una sola vez
const server = http.createServer(async (req, res) => {
    // ...
    // Al inicio del handler, ANTES de usarla:
    const c = getConfigInstalacion();
    const esPrimera = !c || !c.instalacion_completada;
    // ...
});
```

---

### 🔴 BUG 2: Servidor solo muestra `localhost` — No muestra IP de red

**Archivo:** `server/src/index.js`

**Problema:** La ventana Electron carga `http://localhost:${PUERTO}` correctamente para el servidor, pero el endpoint `/api/servidor` y la UI de instalación muestran la IP correctamente. El problema real es que la **ventana Electron del servidor** (que es lo que ve el usuario en el escritorio) no informa visualmente la IP de red al usuario de forma prominente.

**Fix requerido:** Crear una ventana de status del servidor que muestre la URL de red, en lugar de solo cargar `localhost` sin más contexto:

```javascript
// En server/src/index.js, reemplazar la creación de mainWindow:
app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 480,
        height: 340,
        resizable: false,
        title: 'FactuLite Server',
        webPreferences: { nodeIntegration: false, contextIsolation: true }
    });
    
    startServer().then(() => {
        // Cargar página de status con IP y puerto visibles
        const statusHTML = generarStatusHTML();
        mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(statusHTML));
    });
    
    mainWindow.on('close', (e) => {
        e.preventDefault();
        mainWindow.hide();
    });
});

function generarStatusHTML() {
    const ip = getIpLocal();
    const url = `http://${ip}:${PUERTO}`;
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
      require ? require('electron').shell?.openExternal('${url}') : window.open('${url}');
    }
  </script>
</body></html>`;
}
```

**Nota:** Para `openBrowser()` desde una página cargada como `data:`, necesitas IPC. Alternativa más simple: agregar `shell` al preload, o bien solo usar `shell.openExternal` desde el proceso principal con un menú.

---

### 🔴 BUG 3: "Error interno" en Facturación por Lotes (`/api/factura-lote`)

**Archivo:** `server/src/routes/facturas.js` — handler `POST /api/factura-lote`

**Problema A:** El INSERT de `factura_items` no incluye el campo `unidad` que tiene `NOT NULL` implícito por DEFAULT, y falla cuando `item.unidad` es `undefined`.

**Problema B:** El cálculo de `subtotal` dentro del loop de clientes usa `data.items` (que son objetos con `precio` y `cantidad`), pero si algún item tiene `precio` como string (viene del frontend serializado), `item.cantidad * item.precio` da `NaN`, lo que hace fallar la constraint `NOT NULL` del campo `total` en SQLite.

**Problema C:** `sdb.prepare(...).run(...)` dentro de un loop de clientes sin transacción puede dejar datos parcialmente escritos si falla a mitad.

**Fix completo del handler:**
```javascript
if (metodo === 'POST' && url === '/api/factura-lote') {
    const data = await parseBody(req);
    const config = dbSQLite.getConfigEmpresa 
        ? dbSQLite.getConfigEmpresa() 
        : sdb.prepare('SELECT * FROM config_empresa WHERE id = 1').get();
    
    if (!data.clientes || data.clientes.length === 0) {
        res.writeHead(400); res.end(JSON.stringify({ error: 'Se requiere al menos un cliente' }));
        return true;
    }
    if (!data.items || data.items.length === 0) {
        res.writeHead(400); res.end(JSON.stringify({ error: 'Se requiere al menos un producto' }));
        return true;
    }
    
    const grupo = 'LOTE' + Date.now().toString().slice(-8);
    const facturasCreadas = [];
    
    // Envolver todo en una transacción SQLite para atomicidad
    const crearLote = sdb.transaction((clientes, items) => {
        for (const cliente of clientes) {
            const numero = generarNumeroCorrelativo(config, 'factura');
            sdb.prepare('UPDATE config_empresa SET numero_siguiente_factura = numero_siguiente_factura + 1 WHERE id = 1').run();
            
            let subtotal = 0;
            for (const item of items) {
                const precio = parseFloat(item.precio) || 0;
                const cantidad = parseInt(item.cantidad) || 0;
                subtotal += cantidad * precio;
            }
            
            const stmtF = sdb.prepare(`INSERT INTO facturas 
                (numero, cliente_id, cliente_nombre, cliente_ruc, cliente_direccion, 
                 subtotal, descuento, impuesto, total, metodo, estado, usuario, terminos, 
                 fecha, grupo_facturacion, vendedor_nombre)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,?,?)`);
            const resultF = stmtF.run(
                numero,
                cliente.id || null,
                cliente.nombre || 'Cliente',
                cliente.ruc || '',
                cliente.direccion || '',
                subtotal, 0, 0, subtotal,
                'efectivo', 'activa',
                data.usuario || 'sistema',
                'Contado',
                grupo,
                data.usuario || 'sistema'
            );
            const facturaId = resultF.lastInsertRowid;
            
            const stmtItem = sdb.prepare(`INSERT INTO factura_items 
                (factura_id, producto_id, codigo, nombre, cantidad, precio, subtotal, total, unidad, descuento_pct, impuesto_pct)
                VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
            const stmtStock = sdb.prepare(`UPDATE productos SET cantidad = cantidad - ? WHERE id = ?`);
            
            for (const item of items) {
                const precio = parseFloat(item.precio) || 0;
                const cantidad = parseInt(item.cantidad) || 0;
                const itemTotal = cantidad * precio;
                stmtItem.run(
                    facturaId,
                    item.id || null,
                    item.codigo_barra || item.codigo || '',
                    item.nombre || '',
                    cantidad, precio, itemTotal, itemTotal,
                    item.unidad || 'UN',
                    0, 0
                );
                if (item.id) stmtStock.run(cantidad, item.id);
            }
            
            facturasCreadas.push({ numero, cliente: cliente.nombre, total: subtotal });
        }
    });
    
    try {
        crearLote(data.clientes, data.items);
        res.writeHead(200); 
        res.end(JSON.stringify({ 
            grupo, 
            cantidad: facturasCreadas.length, 
            facturas: facturasCreadas 
        }));
    } catch (err) {
        console.error('Error en factura-lote:', err);
        res.writeHead(500); 
        res.end(JSON.stringify({ error: 'Error interno: ' + err.message }));
    }
    return true;
}
```

---

### 🔴 BUG 4: SQL Injection en `bancario.js` y `contabilidad.js`

**Archivo A:** `server/src/routes/bancario.js` líneas 33–37  
**Archivo B:** `server/src/routes/contabilidad.js` líneas 43–46

**Fix para `bancario.js`:**
```javascript
// REEMPLAZAR el bloque GET /api/movimientos-bancarios:
if (metodo === 'GET' && pathname === '/api/movimientos-bancarios') {
    const cuentaId = params.get('cuentaId');
    const fi = params.get('fi') || '';
    const ff = params.get('ff') || '';
    
    let query = 'SELECT * FROM movimientos_bancarios WHERE 1=1';
    const args = [];
    
    if (cuentaId && !isNaN(parseInt(cuentaId))) {
        query += ' AND cuenta_id = ?';
        args.push(parseInt(cuentaId));
    }
    if (fi && /^\d{4}-\d{2}-\d{2}/.test(fi)) {
        query += ' AND fecha >= ?';
        args.push(fi);
    }
    if (ff && /^\d{4}-\d{2}-\d{2}/.test(ff)) {
        query += ' AND fecha <= ?';
        args.push(ff + 'T23:59:59');
    }
    query += ' ORDER BY fecha DESC LIMIT 500';
    
    res.writeHead(200); 
    res.end(JSON.stringify(sdb.prepare(query).all(...args)));
    return true;
}
```

**Fix para `contabilidad.js`:**
```javascript
// REEMPLAZAR el bloque GET /api/asientos:
if (url === '/api/asientos' && metodo === 'GET') {
    const urlObj = new URL(req.url, 'http://localhost');
    const fechaIni = urlObj.searchParams.get('fechaIni') || urlObj.searchParams.get('fi');
    const fechaFin = urlObj.searchParams.get('fechaFin') || urlObj.searchParams.get('ff');
    
    let query = 'SELECT * FROM asientos WHERE 1=1';
    const args = [];
    
    if (fechaIni && /^\d{4}-\d{2}-\d{2}/.test(fechaIni)) {
        query += ' AND fecha >= ?';
        args.push(fechaIni);
    }
    if (fechaFin && /^\d{4}-\d{2}-\d{2}/.test(fechaFin)) {
        query += ' AND fecha <= ?';
        args.push(fechaFin);
    }
    query += ' ORDER BY fecha DESC, id DESC';
    
    const asientos = db.prepare(query).all(...args);
    res.writeHead(200);
    res.end(JSON.stringify(asientos));
    return true;
}
```

---

### 🔴 BUG 5: `.toFixed()` en valores `null`/`undefined` causa crashes

**Archivos afectados:** `server/src/routes/facturas.js`, `server/src/views/index.js`

**Fix global — agregar esta función helper al inicio de `facturas.js` y de los scripts inline en `views/index.js`:**

```javascript
// Helper seguro — agregar donde se use toFixed()
const fmt = (n) => (parseFloat(n) || 0).toFixed(2);
const fmtN = (n) => parseFloat(n) || 0;
```

**En `facturas.js`, función `generarHTMLFactura()`**, reemplazar todas las ocurrencias de:
- `i.precio.toFixed(2)` → `fmt(i.precio)`
- `doc.total.toFixed(2)` → `fmt(doc.total)`
- `(doc.total / doc.tipo_cambio).toFixed(2)` → `(fmtN(doc.tipo_cambio) > 0 ? fmtN(doc.total) / fmtN(doc.tipo_cambio) : 0).toFixed(2)`
- `subtotalGeneral.toFixed(2)` → `fmt(subtotalGeneral)`
- Cualquier `.toFixed(2)` precedido por una variable que puede ser `null`

**En `views/index.js`**, en los scripts inline de cada vista, reemplazar patrones como:
- `(t.total||0).toFixed(2)` — este está bien, mantener el patrón `||0` antes de `.toFixed()`
- `d.totalGeneral.toFixed(2)` → `(d.totalGeneral||0).toFixed(2)`
- `d.total.toFixed(2)` → `(d.total||0).toFixed(2)`

---

### 🔴 BUG 6: Tipo de movimiento bancario incorrecto (`entrada` vs `deposito`)

**Archivo:** `server/src/routes/bancario.js` línea 51

**Problema:** El frontend envía `tipo` con valores `deposito`, `cheque`, `transferencia`, `gasto`. El backend compara con `'entrada'`, haciendo que los depósitos resten el saldo en lugar de sumarlo.

**Fix:**
```javascript
// REEMPLAZAR la línea del cálculo de nuevoSaldo:
const TIPOS_ENTRADA = new Set(['deposito', 'entrada', 'transferencia_entrada']);
const nuevoSaldo = TIPOS_ENTRADA.has(data.tipo) 
    ? cuenta.saldo_actual + fmtN(data.monto)
    : cuenta.saldo_actual - fmtN(data.monto);
```

---

### 🔴 BUG 7: `event.target` no definido en función `hacer()` del POS

**Archivo:** `server/src/views/index.js` — vista `pos`, función `async function hacer(tipo)`

**Problema:** `const btn = event.target;` depende de `window.event` global, que no está disponible en modo estricto ni en algunos contextos Electron.

**Fix:** Pasar el elemento como parámetro desde el HTML:
```html
<!-- En el HTML del POS, cambiar los botones de acción: -->
<button class="btn btn-primary" onclick="hacer('factura', this)" ...>FACTURA</button>
<button class="btn" onclick="hacer('ticket', this)" ...>Ticket</button>
```
```javascript
// Y en la función:
async function hacer(tipo, btnEl) {
    if (carousel.length === 0) return;
    const btn = btnEl; // ya no usamos event.target
    const originalText = btn.innerHTML;
    btn.classList.add('loading');
    btn.innerHTML = '<span class="spinner"></span>Procesando...';
    // ... resto igual
}
```

---

### 🔴 BUG 8: Typo en setter `cuentasCorientes` en `db.js`

**Archivo:** `server/src/db.js` línea 759

**Fix:**
```javascript
// CAMBIAR:
set cuentasCorientes(val) { },  // typo
// POR:
set cuentasCorrientes(val) { },  // correcto
```

---

### 🔴 BUG 9: Filtro `WHERE activo = 1` excluye proveedores en compras

**Archivo:** `server/src/routes/clientes.js`

**Problema:** Los proveedores inactivos no aparecen en el selector de compras, rompiendo el historial de órdenes antiguas.

**Fix:** Añadir un endpoint alternativo que devuelva todos (activos e inactivos) para contextos históricos, y en el selector de compras usar el endpoint con todos:

```javascript
// Agregar endpoint adicional en clientes.js:
if (url === '/api/proveedores/todos' && metodo === 'GET') {
    const proveedores = sdb.prepare('SELECT * FROM proveedores ORDER BY nombre').all();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(proveedores));
    return true;
}
```

En la vista de compras (`views/index.js`), cambiar `fetch('/api/proveedores')` por `fetch('/api/proveedores/todos')` en el selector de órdenes de compra.

---

### 🔴 BUG 10: Config empresa retorna `{}` cuando no existe fila

**Archivo:** `server/src/routes/auth.js` — endpoint `/api/config-empresa`

**Fix:**
```javascript
if (url === '/api/config-empresa' && metodo === 'GET') {
    let config = sdb.prepare('SELECT * FROM config_empresa WHERE id = 1').get();
    if (!config) {
        // Crear fila default si no existe
        sdb.prepare(`INSERT OR IGNORE INTO config_empresa (id) VALUES (1)`).run();
        config = sdb.prepare('SELECT * FROM config_empresa WHERE id = 1').get();
    }
    res.writeHead(200);
    res.end(JSON.stringify(config || {}));
    return true;
}
```

---

### 🔴 BUG 11: Cliente crea base de datos propia — debe usar la del servidor

**Archivo:** `client/src/index.js`

**Problema:** El cliente tiene lógica de IndexedDB/offline que crea su propia DB local, lo cual entra en conflicto con el servidor. El cliente **NO debe** almacenar datos de negocio propios. Es solo un browser wrapper.

**Fix — simplificar `client/src/index.js` completamente:**

El cliente debe:
1. Mostrar pantalla de configuración de IP al primer inicio
2. Guardar la URL del servidor en `electron.app.getPath('userData')/server-config.json`
3. Cargar directamente la URL del servidor sin ninguna lógica de DB offline
4. No tener IndexedDB ni sync

```javascript
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

// HTML de configuración minimalista — SIN lógica de DB offline
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
      // Guardar y navegar
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
```

---

### 🟡 BUG 12: Parámetros inconsistentes entre reportes frontend/backend

**Archivo:** `server/src/views/index.js` — vista `reportes`

**Problema:** El frontend de reportes envía `fi` y `ff` pero el backend de `/api/reporte-productos` espera `fechaIni` y `fechaFin`. El backend de `/api/reporte-mensual` espera `anio` y `mes` pero el frontend envía `fecha=2024-03`.

**Fix en la vista `reportes` de `views/index.js`:**
```javascript
// Función reporteProductos — corregir URL:
async function reporteProductos(){
    const fi = document.getElementById('fechaInicio').value;
    const ff = document.getElementById('fechaFin').value;
    // CAMBIAR: /api/reporte-productos?fi=... → /api/reporte-productos?fechaIni=...&fechaFin=...
    const d = await fetch('/api/reporte-productos?fechaIni='+fi+'&fechaFin='+ff).then(r=>r.json());
    // ...
}

// Función reporteMensual — extraer anio y mes de la fecha:
async function reporteMensual(){
    const fechaStr = document.getElementById('fechaInicio').value; // ej: "2026-04"
    const [anio, mes] = fechaStr.substring(0,7).split('-');
    // CAMBIAR: /api/reporte-mensual?fecha=... → /api/reporte-mensual?anio=...&mes=...
    const d = await fetch('/api/reporte-mensual?anio='+anio+'&mes='+parseInt(mes)).then(r=>r.json());
    // ...
}

// También agregar los filtros de fecha al input del reporteMensual:
// Cambiar el type del input fechaInicio a "month" cuando se selecciona reporte mensual
```

---

## FORMATO DE FACTURA — DEBE IGUALAR A MÓNICA 11

### Descripción del formato requerido (basado en factura física adjunta)

La factura impresa de Mónica 11 tiene estas características que deben replicarse:

```
┌─────────────────────────────────────────────────────┐
│  [LOGO EMPRESA]    NOMBRE DE LA EMPRESA             │
│                    www.sitio.com                    │
│  FACTURA           RUC: XXXXXXXXX                   │
│  No. 0062831       Teléfono: XXXX-XXXX              │
│──────────────────────────────────────────────────── │
│  No.     FACTURA CONTADO         Página: 1 de 1    │
│  Fecha:  13/04/2026              Número: 62831      │
│──────────────────────────────────────────────────── │
│  Vendedor: NOMBRE VENDEDOR                          │
│  Cliente:  NOMBRE CLIENTE                           │
│  Código Cliente: XXXX                               │
│  RUC: XXXXXXXXX   Moneda: Nacional C$               │
│  Tipo Comprobante:                Referencia:       │
│  Dirección: CALLE Y NÚMERO                          │
│──────────────────────────────────────────────────── │
│ Item │Cod.Producto│Descripción│Ref│Cant│Un│Precio  │
│──────────────────────────────────────────────────── │
│  1   │ 740985XXXX │ PRODUCTO  │PRI│1.00│UN│1,318.32│
│  2   │ 741360XXXX │ PRODUCTO 2│PRI│1.00│UN│  732.40│
│  3   │ DELIVERY   │ SERV.DEL. │PRI│1.00│UN│   20.00│
│──────────────────────────────────────────────────── │
│              Subtotal:              2,070.72        │
│              Dsct. parcial:                         │
│              Dsct. Global:                          │
│              TOTAL:              C$ 1,865.66        │
│──────────────────────────────────────────────────── │
│  CUOTA FIJA:  205.07                                │
│──────────────────────────────────────────────────── │
│  Aviso: Elaborar Cheque a nombre de [EMPRESA]       │
│  No se aceptan devoluciones de mercadería           │
│  Firma: _________________________________           │
└─────────────────────────────────────────────────────┘
```

### Reemplazar `generarHTMLFactura()` en `server/src/routes/facturas.js`

```javascript
function generarHTMLFactura(doc, items, config) {
    const fmt = (n) => (parseFloat(n) || 0).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const fechaEmision = new Date(doc.fecha).toLocaleDateString('es-NI');
    const horaEmision = new Date(doc.fecha).toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit' });
    const fechaVence = doc.fecha_vencimiento ? new Date(doc.fecha_vencimiento).toLocaleDateString('es-NI') : '-';
    const tipoCambio = parseFloat(doc.tipo_cambio) || parseFloat(config?.tipo_cambio_usd) || 1;
    
    // Calcular totales con validación
    let subtotal = 0, descuentoTotal = 0, impuestoTotal = 0;
    const itemsHTML = items.map((item, idx) => {
        const precio = parseFloat(item.precio) || 0;
        const cantidad = parseInt(item.cantidad) || 0;
        const descPct = parseFloat(item.descuento_pct) || 0;
        const base = cantidad * precio;
        const desc = base * descPct / 100;
        const sub = base - desc;
        subtotal += base;
        descuentoTotal += desc;
        return `<tr>
            <td style="padding:5px 8px;border:1px solid #ccc;text-align:center;">${idx + 1}</td>
            <td style="padding:5px 8px;border:1px solid #ccc;font-size:11px;">${item.codigo || item.codigo_barra || '-'}</td>
            <td style="padding:5px 8px;border:1px solid #ccc;">${item.nombre}</td>
            <td style="padding:5px 8px;border:1px solid #ccc;text-align:center;">${doc.ref_cliente || '-'}</td>
            <td style="padding:5px 8px;border:1px solid #ccc;text-align:center;">${cantidad}.00</td>
            <td style="padding:5px 8px;border:1px solid #ccc;text-align:center;">${item.unidad || 'UN'}</td>
            <td style="padding:5px 8px;border:1px solid #ccc;text-align:right;">${fmt(sub)}</td>
        </tr>`;
    }).join('');
    
    const totalGeneral = subtotal - descuentoTotal + (parseFloat(doc.miscelaneos) || 0);
    const totalUSD = tipoCambio > 0 ? (totalGeneral / tipoCambio) : 0;
    const esCredito = doc.terminos === 'Crédito' || doc.terminos === 'Credito';
    const cuotaFija = esCredito && totalGeneral > 0 ? (totalGeneral / 12) : 0;
    
    // Número de factura limpio (solo dígitos para mostrar como Mónica)
    const numLimpio = (doc.numero || '').replace(/\D/g, '');
    
    return `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>Factura ${doc.numero}</title>
<style>
  @media print { @page { margin: 8mm; size: letter portrait; } }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; font-size: 12px; color: #000; background: #fff; max-width: 210mm; margin: 0 auto; padding: 10px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; border-bottom: 2px solid #000; padding-bottom: 10px; }
  .empresa-info h1 { font-size: 20px; font-weight: 900; color: #003366; }
  .empresa-info p { font-size: 11px; line-height: 1.5; }
  .factura-badge { text-align: right; }
  .factura-badge .tipo { font-size: 11px; color: #666; text-transform: uppercase; }
  .factura-badge .numero-grande { font-size: 28px; font-weight: 900; color: #c00; letter-spacing: 1px; }
  .meta-box { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid #000; margin-bottom: 8px; }
  .meta-box .col { padding: 6px 10px; }
  .meta-box .col:first-child { border-right: 1px solid #000; }
  .meta-label { font-size: 10px; color: #555; text-transform: uppercase; font-weight: 600; }
  .meta-value { font-size: 12px; font-weight: 600; }
  .info-cliente { border: 1px solid #000; padding: 8px 10px; margin-bottom: 8px; font-size: 11px; line-height: 1.8; }
  .info-row { display: flex; gap: 20px; }
  .info-row span { min-width: 80px; font-weight: 600; color: #444; }
  table.items { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 11px; }
  table.items th { background: #003366; color: white; padding: 6px 8px; text-align: left; border: 1px solid #002244; font-size: 10px; text-transform: uppercase; }
  table.items td { border: 1px solid #ccc; padding: 5px 8px; }
  table.items tr:nth-child(even) { background: #f5f8ff; }
  .totales { margin-left: auto; width: 280px; border: 1px solid #000; margin-bottom: 8px; }
  .totales tr td { padding: 4px 10px; font-size: 12px; border-bottom: 1px solid #eee; }
  .totales tr td:last-child { text-align: right; font-weight: 600; }
  .totales .grand-total td { font-size: 16px; font-weight: 900; color: #003366; background: #eef3ff; border-top: 2px solid #003366; }
  .footer-aviso { border: 1px solid #999; padding: 8px; font-size: 10px; color: #444; margin-top: 8px; }
  .firma-box { margin-top: 20px; display: flex; justify-content: flex-end; }
  .firma-line { width: 200px; border-top: 1px solid #000; text-align: center; padding-top: 4px; font-size: 10px; color: #666; }
  .cuota { background: #fffde7; border: 1px solid #f9a825; padding: 6px 10px; font-size: 12px; font-weight: 700; color: #e65100; margin-bottom: 8px; text-align: right; }
  .badge-tipo { display: inline-block; background: #003366; color: white; padding: 2px 10px; border-radius: 3px; font-size: 10px; font-weight: 700; margin-bottom: 4px; }
  @media print { .no-print { display: none; } }
</style>
</head>
<body>

<div class="header">
  <div class="empresa-info">
    <h1>${config?.nombre || 'Mi Empresa'}</h1>
    ${config?.sitio_web ? `<p>${config.sitio_web}</p>` : ''}
    <p>${config?.direccion || ''}</p>
    <p>Teléfono: ${config?.telefono || 'N/A'}</p>
    <p>RUC No. ${config?.ruc || 'N/A'}</p>
    ${config?.email ? `<p>${config.email}</p>` : ''}
    ${config?.slogan ? `<p style="font-style:italic;color:#666;">${config.slogan}</p>` : ''}
  </div>
  <div class="factura-badge">
    <div class="badge-tipo">FACTURA</div>
    <div class="numero-grande">No. ${numLimpio.padStart(7, '0')}</div>
    <div style="font-size:11px;color:#555;margin-top:4px;">
      <strong>Fecha:</strong> ${fechaEmision} ${horaEmision}<br>
      <strong>Vence:</strong> ${fechaVence}<br>
      <strong>Página:</strong> 1 de 1
    </div>
  </div>
</div>

<div class="meta-box">
  <div class="col">
    <div class="meta-label">Número</div>
    <div class="meta-value">${doc.numero}</div>
  </div>
  <div class="col">
    <div class="meta-label">Tipo de Documento</div>
    <div class="meta-value">FACTURA ${doc.terminos?.toUpperCase() || 'CONTADO'}</div>
  </div>
</div>

<div class="info-cliente">
  <div class="info-row"><span>Vendedor:</span><strong>${doc.vendedor_nombre || doc.usuario || '-'}</strong></div>
  <div class="info-row"><span>Cliente:</span><strong>${doc.cliente_nombre || 'Público General'}</strong></div>
  ${doc.cliente_id ? `<div class="info-row"><span>Cód. Cliente:</span>${doc.cliente_id}</div>` : ''}
  <div class="info-row"><span>RUC:</span>${doc.cliente_ruc || '-'} &nbsp;&nbsp; <span>Moneda:</span> Nacional C$</div>
  <div class="info-row"><span>Referencia:</span>${doc.ref_cliente || '-'} &nbsp;&nbsp; <span>Comprobante:</span> ${doc.comprobante || '-'}</div>
  ${doc.cliente_direccion ? `<div class="info-row"><span>Dirección:</span>${doc.cliente_direccion}</div>` : ''}
</div>

<table class="items">
  <thead>
    <tr>
      <th style="width:30px;">Item</th>
      <th style="width:100px;">Cód. Producto</th>
      <th>Descripción Producto</th>
      <th style="width:40px;">Ref.</th>
      <th style="width:50px;">Cant.</th>
      <th style="width:35px;">Un</th>
      <th style="width:90px;text-align:right;">Precio</th>
    </tr>
  </thead>
  <tbody>${itemsHTML}</tbody>
</table>

<div style="display:flex;justify-content:flex-end;">
  <table class="totales">
    <tr><td>Subtotal</td><td>C$ ${fmt(subtotal)}</td></tr>
    <tr><td>Dsct. Parcial</td><td>C$ ${fmt(descuentoTotal)}</td></tr>
    <tr><td>Dsct. Global</td><td>C$ ${fmt(parseFloat(doc.descuento) || 0)}</td></tr>
    <tr><td>Misceláneos</td><td>C$ ${fmt(doc.miscelaneos)}</td></tr>
    <tr class="grand-total"><td>TOTAL</td><td>C$ ${fmt(totalGeneral)}</td></tr>
    ${tipoCambio > 1 ? `<tr style="font-size:10px;color:#666;"><td>Total US$</td><td>$ ${fmt(totalUSD)}</td></tr>` : ''}
  </table>
</div>

${cuotaFija > 0 ? `<div class="cuota">CUOTA FIJA MENSUAL: C$ ${fmt(cuotaFija)}</div>` : ''}

<div class="footer-aviso">
  <p><strong>Aviso:</strong> Elaborar Cheque a nombre de ${config?.nombre || 'la empresa'}</p>
  <p>No se aceptan devoluciones de mercadería</p>
  ${config?.telefono ? `<p>Consultas: ${config.telefono}</p>` : ''}
</div>

<div class="firma-box">
  <div class="firma-line">Firma del Cliente</div>
</div>

<div class="no-print" style="margin-top:20px;text-align:center;">
  <button onclick="window.print()" style="padding:10px 30px;background:#003366;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;">🖨️ Imprimir</button>
</div>
<script>window.onload = function() { setTimeout(() => window.print(), 400); };</script>
</body></html>`;
}
```

---

### Reemplazar `generarHTMLTicket()` — formato térmico mejorado

```javascript
function generarHTMLTicket(doc, items, config) {
    const fmt = (n) => (parseFloat(n) || 0).toFixed(2);
    const fecha = new Date(doc.fecha).toLocaleString('es-NI');
    
    let subtotal = 0;
    const itemsHTML = items.map(i => {
        const precio = parseFloat(i.precio) || 0;
        const cant = parseInt(i.cantidad) || 0;
        const total = cant * precio;
        subtotal += total;
        return `<tr>
          <td style="padding:2px 4px;">${cant}</td>
          <td style="padding:2px 4px;max-width:150px;word-break:break-word;">${i.nombre}</td>
          <td style="padding:2px 4px;text-align:right;">C$${fmt(total)}</td>
        </tr>
        ${i.codigo || i.codigo_barra ? `<tr><td></td><td colspan="2" style="font-size:9px;color:#666;padding:0 4px;">${i.codigo || i.codigo_barra}</td></tr>` : ''}`;
    }).join('');
    
    const descuento = parseFloat(doc.descuento) || 0;
    const total = subtotal - descuento;
    
    return `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>Ticket ${doc.numero}</title>
<style>
  @media print { @page { margin: 2mm; width: 80mm; } body { width: 72mm; } }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Courier New', Courier, monospace; font-size: 11px; width: 300px; margin: 0 auto; padding: 8px; }
  .center { text-align: center; }
  .line { border-top: 1px dashed #000; margin: 5px 0; }
  .empresa { font-size: 14px; font-weight: 900; }
  .num-ticket { font-size: 13px; font-weight: 700; }
  table { width: 100%; border-collapse: collapse; }
  .total-row { font-size: 15px; font-weight: 900; }
  .footer { font-size: 10px; color: #555; text-align: center; margin-top: 8px; }
</style>
</head>
<body>
<div class="center">
  <div class="empresa">${config?.nombre || 'EMPRESA'}</div>
  ${config?.telefono ? `<div>${config.telefono}</div>` : ''}
  ${config?.direccion ? `<div style="font-size:10px;">${config.direccion}</div>` : ''}
  ${config?.ruc ? `<div style="font-size:10px;">RUC: ${config.ruc}</div>` : ''}
  ${config?.slogan ? `<div style="font-style:italic;font-size:10px;">${config.slogan}</div>` : ''}
</div>

<div class="line"></div>
<div class="center">
  <div class="num-ticket">TICKET: ${doc.numero}</div>
  <div>${fecha}</div>
</div>
<div class="line"></div>

<div>VENDEDOR: ${(doc.vendedor_nombre || doc.usuario || '-').toUpperCase()}</div>
${doc.cliente_nombre ? `<div>CLIENTE: ${doc.cliente_nombre.toUpperCase()}</div>` : ''}
${doc.cliente_direccion ? `<div style="font-size:10px;">DIR: ${doc.cliente_direccion}</div>` : ''}

<div class="line"></div>
<table>
  <thead><tr>
    <th style="text-align:left;width:25px;">CANT</th>
    <th style="text-align:left;">DESCRIPCION</th>
    <th style="text-align:right;width:70px;">TOTAL C$</th>
  </tr></thead>
  <tbody>${itemsHTML}</tbody>
</table>
<div class="line"></div>

<table>
  <tr><td>Subtotal:</td><td style="text-align:right;">C$ ${fmt(subtotal)}</td></tr>
  ${descuento > 0 ? `<tr><td>Descuento:</td><td style="text-align:right;">-C$ ${fmt(descuento)}</td></tr>` : ''}
  <tr class="total-row"><td>TOTAL:</td><td style="text-align:right;">C$ ${fmt(total)}</td></tr>
</table>

<div class="footer">
  <div>${config?.nombre || ''}</div>
  ${config?.telefono ? `<div>${config.telefono}</div>` : ''}
  <div>*** GRACIAS POR SU COMPRA ***</div>
</div>
<script>window.onload = function() { setTimeout(() => window.print(), 300); };</script>
</body></html>`;
}
```

---

## BUGS ADICIONALES A CORREGIR (MEDIA/BAJA SEVERIDAD)

### Bug 13: Reporte de usuarios — `d.totalGeneral.toFixed(2)` sin validación
```javascript
// En views/index.js, vista reportes, función reporteUsuarios:
// CAMBIAR: valor:'C$ '+d.totalGeneral.toFixed(2)
// POR:
valor: 'C$ ' + (d.totalGeneral || 0).toFixed(2)
```

### Bug 14: Export CSV en facturas — `t.total.toFixed(2)` sin validación
```javascript
// CAMBIAR: data.map(t=>t.total.toFixed(2))
// POR: data.map(t=>(t.total||0).toFixed(2))
```

### Bug 15: Endpoint `/api/reporte-productos` — parámetros `fi`/`ff` vs `fechaIni`/`fechaFin`
El backend en `reportes.js` ya usa `fechaIni` y `fechaFin`. El frontend debe enviarlos así (ver Bug 12 arriba).

### Bug 16: Kardex — campo `costo_promedio` no existe en tabla `productos`
```javascript
// En views/index.js, función del kardex, cambiar:
// 'Costo Promedio: C$ '+(producto?.costo_promedio||0).toFixed(2)
// POR:
'Costo: C$ '+(producto?.costo||0).toFixed(2)
```

---

## INSTRUCCIONES FINALES PARA LA IA

1. **Aplica cada fix en el archivo exacto indicado.** No cambies la arquitectura general — el servidor HTTP nativo, las vistas como strings en `views/index.js`, y la estructura de rutas deben mantenerse.

2. **El Bug 1 (instalación repetida) es el más crítico.** Sin ese fix, la app es inutilizable. Prioriza `getSafeDataPath()` y `getConfigInstalacion()`.

3. **Para `generarHTMLFactura()`**, el HTML debe imprimir directamente al abrir la URL `/api/imprimir/factura/:id` — usar `window.onload = () => window.print()` con un pequeño delay.

4. **No uses `eval()`, `innerHTML` con datos sin escapar de usuario en el servidor**, ni concatenación de strings SQL sin los fixes de parametrización indicados.

5. **Mantén compatibilidad con SQLite better-sqlite3** — usa statements preparados (`.prepare(...).run(...)`, `.prepare(...).get(...)`, `.prepare(...).all(...)`), no callbacks.

6. **Para el cliente simplificado**: elimina toda la lógica de IndexedDB, syncQueue, loadOfflineUI, loadOfflineLogin. Solo conectar → guardar URL → navegar.

7. **Testea mentalmente el flujo completo**: instalar app → se abre instalación → crear admin → guardar → cerrar app → reabrir → debe ir directo al login, NO a instalación.

8. **La IP en la ventana del servidor** debe mostrarse como `http://192.168.X.X:5000` en texto grande y copiable, no `localhost`.

---

*Prompt generado para FactuLite v1.7.0 — Priceless Imports, Nicaragua*
