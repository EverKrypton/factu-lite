# FactuLite - AGENTS.md

## Proyecto

**FactuLite** es un sistema de facturación cliente-servidor para Nicaragua, competidor de Mónica 11.

| Aspecto | Valor |
|---------|-------|
| Nombre | FactuLite |
| Versión | 1.7.0 |
| Stack | Electron 28.x, Vanilla JS, SQLite (better-sqlite3), PDFKit |
| Licencia | MIT |
| Repo | https://github.com/EverKrypton/factu-lite |

## Arquitectura

```
┌─────────────────┐     ┌─────────────────┐
│  Cliente 1      │     │  Cliente 2      │
│  (Electron)     │     │  (Electron)     │
│  - WebView      │     │  - WebView      │
│  - IndexedDB    │     │  - IndexedDB    │
│  - Modo Offline │     │  - Modo Offline │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │    HTTP/REST API      │
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌─────────────────────┐
         │    SERVIDOR         │
         │    (Electron)       │
         │    - HTTP Server    │
         │    - SQLite DB      │
         │    - API REST       │
         │    - Vistas HTML    │
         └─────────────────────┘
```

### Componentes

| Componente | Descripción | Archivo |
|------------|-------------|---------|
| **Server** | Servidor HTTP + SQLite + Electron | `server/src/index.js` |
| **Client** | Cliente con modo offline | `client/src/index.js` |
| **DB** | SQLite con better-sqlite3 | `server/src/db.js` |
| **Views** | HTML embebido | `server/src/views/index.js` |
| **Routes** | Endpoints API (13 archivos) | `server/src/routes/*.js` |

## Comandos

```bash
# Desarrollo
cd server && npm start          # Iniciar servidor (Electron)
cd server && npm run serve      # Solo servidor (Node.js)
cd client && npm start          # Iniciar cliente (Electron)

# Build
cd server && npm run build      # Build server .exe
cd client && npm run build      # Build client .exe

# Git
git add -A && git commit -m "mensaje"
git tag v1.x.x && git push origin main --tags
```

## Estructura de Archivos

```
factu-lite/
├── server/
│   ├── src/
│   │   ├── index.js          # Entry point + HTTP server
│   │   ├── db.js             # SQLite + tablas + índices
│   │   ├── config.js         # Configuración
│   │   ├── views/
│   │   │   └── index.js      # HTML de todas las vistas
│   │   ├── routes/
│   │   │   ├── auth.js       # Login, usuarios, permisos
│   │   │   ├── productos.js  # CRUD + catálogo PDF
│   │   │   ├── facturas.js   # Facturas, tickets, anulación
│   │   │   ├── clientes.js   # Clientes y proveedores
│   │   │   ├── contabilidad.js # Asientos, mayor, balance
│   │   │   ├── reportes.js   # Dashboard, estadísticas
│   │   │   ├── compras.js    # Órdenes de compra
│   │   │   ├── cartera.js    # Cuentas cobrar/pagar
│   │   │   ├── bancario.js   # Cuentas corrientes
│   │   │   ├── proformas.js  # Cotizaciones
│   │   │   ├── hardware.js   # Scanner, gaveta
│   │   │   └── kardex.js     # Movimientos inventario
│   │   └── migracion/
│   │       └── migrar.js     # Migración Mónica 11
│   ├── package.json
│   ├── config.server.yml     # Config electron-builder
│   └── instrucciones.html    # Guía de uso
├── client/
│   ├── src/
│   │   └── index.js          # Cliente + modo offline
│   ├── package.json
│   └── config.client.yml
├── .github/
│   └── workflows/
│       └── build.yml         # Build dual server+client
├── README.md
├── DESIGN.md
└── AGENTS.md
```

## Base de Datos (SQLite)

### Tablas Principales (29)

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Usuarios del sistema |
| `permisos_usuario` | Permisos por usuario/módulo |
| `modulos` | Módulos disponibles (21) |
| `productos` | Inventario |
| `clientes` | Clientes |
| `proveedores` | Proveedores |
| `facturas` | Facturas |
| `factura_items` | Detalle de facturas |
| `tickets` | Tickets de venta |
| `ticket_items` | Detalle de tickets |
| `cuentas_cobrar` | Cuentas por cobrar |
| `pagos_cobrar` | Pagos recibidos |
| `cuentas_pagar` | Cuentas por pagar |
| `pagos_pagar` | Pagos realizados |
| `compras` | Órdenes de compra |
| `kardex` | Movimientos de inventario |
| `cuentas_corrientes` | Cuentas bancarias |
| `movimientos_bancarios` | Movimientos bancarios |
| `cuentas_contables` | Plan de cuentas |
| `asientos` | Asientos contables |
| `asiento_detalles` | Detalle de asientos |
| `bodegas` | Bodegas/almacenes |
| `proformas` | Cotizaciones |
| `proforma_items` | Detalle de proformas |
| `cortes_caja` | Cierres de caja |
| `lotes_facturacion` | Facturación por lote |
| `devoluciones` | Devoluciones |
| `devolucion_items` | Detalle de devoluciones |
| `config_empresa` | Configuración de empresa |

### Optimización DB

```javascript
// PRAGMA aplicados
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = -64000');      // 64MB cache
db.pragma('temp_store = MEMORY');
db.pragma('mmap_size = 268435456');    // 256MB mmap

// Índices (14)
idx_facturas_fecha, idx_facturas_usuario, idx_tickets_usuario,
idx_productos_codigo_barra, idx_productos_nombre, idx_kardex_producto_id...

// Endpoint optimizar
POST /api/optimizar-db  → VACUUM + ANALYZE + checkpoint
```

## API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/login` | Login de usuario |
| GET | `/api/usuarios` | Listar usuarios |
| POST | `/api/usuario` | Crear usuario |
| PUT | `/api/usuario` | Editar usuario |
| DELETE | `/api/usuario` | Eliminar usuario |
| GET | `/api/permisos-usuario?usuario_id=X` | Permisos de usuario |
| PUT | `/api/permisos-usuario` | Actualizar permiso |
| POST | `/api/permisos-usuario/reset` | Resetear permisos por rol |

### Productos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Listar productos |
| POST | `/api/producto` | Crear producto |
| PUT | `/api/producto` | Editar producto |
| DELETE | `/api/producto` | Eliminar producto |
| GET | `/api/producto/:codigo` | Buscar por código |
| GET | `/api/buscar-productos?q=texto` | Buscar productos |
| GET | `/api/catalogo-pdf` | Exportar catálogo PDF |
| GET | `/api/etiquetas-pdf?ids=1,2,3` | Imprimir etiquetas |

### Ventas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/factura` | Crear factura |
| POST | `/api/ticket` | Crear ticket |
| PUT | `/api/factura` | Modificar factura |
| PUT | `/api/ticket` | Modificar ticket |
| GET | `/api/facturas` | Historial de ventas |
| GET | `/api/facturas-usuario/:id` | Ventas por usuario |
| POST | `/api/anular/factura/:id` | Anular factura |
| POST | `/api/anular/ticket/:id` | Anular ticket |
| GET | `/api/imprimir/factura/:id` | Vista de impresión |

### Sistema
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/servidor` | Info del servidor (IP, puerto) |
| GET | `/api/modulos` | Listar módulos activos |
| PUT | `/api/modulos` | Activar/desactivar módulos |
| GET | `/api/config-empresa` | Configuración empresa |
| PUT | `/api/config-empresa` | Guardar configuración |
| POST | `/api/backup-db` | Crear backup |
| GET | `/api/exportar-db` | Exportar DB |
| POST | `/api/importar-db` | Importar DB |
| POST | `/api/optimizar-db` | Optimizar DB |

### Migración
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/migrar/subir` | Subir archivo SQL |
| POST | `/api/migrar/analizar` | Analizar estructura |
| POST | `/api/migrar/ejecutar` | Ejecutar migración |

## Módulos (21)

| ID | Nombre | Descripción |
|----|--------|-------------|
| pos | Punto de Venta | Facturación rápida |
| facturacion | Facturación | Facturas y documentos |
| factura_lote | Factura por Lote | Facturación masiva |
| inventario | Inventario | Productos y stock |
| clientes | Clientes | Cartera de clientes |
| proveedores | Proveedores | Directorio |
| cuentas_cobrar | Cuentas por Cobrar | Cartera y cobros |
| cuentas_pagar | Cuentas por Pagar | Pagos a proveedores |
| contabilidad | Contabilidad | Partida doble |
| kardex | Kárdex | Movimientos inventario |
| bancario | Bancario | Cuentas corrientes |
| conciliacion | Conciliación | Conciliación bancaria |
| corte_caja | Corte de Caja | Cierres y arqueos |
| reportes | Reportes | Reportes de ventas |
| proformas | Proformas | Cotizaciones |
| ordenes | Órdenes de Compra | Compras a proveedores |
| devoluciones | Devoluciones | Devoluciones |
| backup | Backup/Restore | Respaldos |
| scanner | Scanner Código Barras | Lectura de códigos |
| gaveta | Gaveta Electrónica | Caja de dinero |

## Sistema de Permisos

### Tabla permisos_usuario

```sql
CREATE TABLE permisos_usuario (
    id INTEGER PRIMARY KEY,
    usuario_id INTEGER,
    modulo_id TEXT,
    puede_ver INTEGER DEFAULT 1,
    puede_crear INTEGER DEFAULT 0,
    puede_editar INTEGER DEFAULT 0,
    puede_eliminar INTEGER DEFAULT 0,
    puede_imprimir INTEGER DEFAULT 0,
    puede_exportar INTEGER DEFAULT 0
);
```

### Permisos por defecto por rol

| Rol | Ver | Crear | Editar | Eliminar | Imprimir | Exportar |
|-----|-----|-------|--------|----------|----------|----------|
| admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| caja | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| vendedor | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| bodega | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| distribuidor | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

### Flujo de permisos

1. Admin va a **Usuarios**
2. Click en **Permisos** del usuario
3. Marca/desmarca checkboxes por módulo
4. Click en **Guardar Cambios**

## Flujo de Instalación

```
┌─────────────────────────────────────────┐
│ Paso 1: Ubicación de la Base de Datos   │
│ - Ruta por defecto: ./priceless.db      │
│ - Opción de cambiar ubicación           │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│ Paso 2: Crear Administrador             │
│ - Usuario (mín 3 caracteres)            │
│ - Nombre completo                        │
│ - Contraseña (mín 4 caracteres)         │
│ - Confirmar contraseña                  │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│ Paso 3: Selección de Módulos            │
│ - Checkbox para cada módulo             │
│ - Todos marcados por defecto            │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│ Paso 4: Instalación Completada          │
│ - Muestra IP del servidor               │
│ - Checkbox "Ejecutar al cerrar"         │
│ - Botón FINALIZAR Y ABRIR SISTEMA       │
│   → Abre instrucciones.html             │
│   → Redirige a /login                   │
└─────────────────────────────────────────┘
```

## Cliente-Servidor

### Servidor (FactuLite-Server-Setup.exe)

1. Instalar en UNA PC de la red
2. Ejecutar el wizard de instalación
3. Crear el usuario admin
4. Anotar la IP que muestra (ej: 192.168.1.50)
5. El servidor queda corriendo en puerto 5000

### Cliente (FactuLite-Client-Setup.exe)

1. Instalar en TODAS las PCs que usarán el sistema
2. Al abrir, ingresa la IP del servidor
3. Click en "CONECTAR AL SERVIDOR"
4. Se abre el navegador con la interfaz del servidor

### Modo Offline (Cliente)

```
1. Cliente no puede conectar al servidor
2. Click en "TRABAJAR OFFLINE"
3. Login con usuario guardado localmente
4. Crear facturas/tickets offline
5. Se guardan en IndexedDB
6. Cuando el servidor vuelve:
   - Click en "Sincronizar con Servidor"
   - Se envían todos los pendientes
```

### Sincronización Cliente

```javascript
// IndexedDB stores
productos     ← Sincronizados del servidor
clientes      ← Sincronizados del servidor
usuarios      ← Sincronizados del servidor
facturas      ← Creadas offline
tickets       ← Creados offline
syncQueue     ← Cola de pendientes
```

## Migración desde Mónica 11

### Script: server/src/migracion/migrar.js

```javascript
// Soporta
- MySQL / MariaDB
- SQL Server
- PostgreSQL
- SQLite
- JSON

// Mapeo automático de tablas
'producto' → 'productos'
'cliente' → 'clientes'
'factura' → 'facturas'

// Mapeo automático de campos
'codigo_barra' → 'codigo_barra'
'precio_venta' → 'precio'
'cantidad' → 'cantidad'

// Uso
POST /api/migrar/subir       → Sube archivo SQL
POST /api/migrar/analizar    → Analiza estructura
POST /api/migrar/ejecutar    → Ejecuta migración
```

## Comparación con Mónica 11

| Feature | FactuLite | Mónica 11 |
|---------|-----------|-----------|
| Acceso web multi-PC | ✅ | ❌ |
| Modo offline | ✅ | ❌ |
| Usuarios ilimitados | ✅ | 25 max |
| SQLite abierto | ✅ | ❌ Propietario |
| API REST | ✅ | ❌ |
| Mobile friendly | ✅ | ❌ |
| Código abierto | ✅ MIT | ❌ |
| Permisos por usuario | ✅ | ✅ |
| 21 módulos | ✅ | 22 |
| Factura Electrónica DGII | ❌ | ❌ |

## Git Workflow

```bash
# Crear release
git add -A
git commit -m "feat: descripción del cambio"
git tag v1.x.x
git push origin main --tags

# El workflow detecta el tag y:
# 1. Compila server (FactuLite-Server-Setup-x64.exe)
# 2. Compila client (FactuLite-Client-Setup-x64.exe)
# 3. Crea release en GitHub con ambos .exe
```

### Semantic Versioning

- **Major** (x.0.0): Cambios incompatibles
- **Minor** (1.x.0): Nuevas funcionalidades
- **Patch** (1.0.x): Bug fixes

## Reglas de Desarrollo

1. **No agregar comentarios** en el código a menos que se solicite
2. **Vanilla JS** - Sin frameworks frontend (React, Vue, etc.)
3. **Modularidad** - Un archivo por funcionalidad en routes/
4. **Feedback visual** - Usar spinners para operaciones async
5. **No hardcodear datos** de producción (credenciales, IPs)
6. **Imágenes en filesystem**, no en base64 ni en DB
7. **Permisos granulares** - Admin controla todo
8. **PDFKit** para generación de PDFs
9. **better-sqlite3** para SQLite síncrono

## Endpoints de Imágenes

```
POST /api/imagenes          → Sube imagen a ./uploads/productos/
GET  /api/imagenes/:file    → Sirve imagen

// Las imágenes se guardan como:
./uploads/productos/1234567890_5.jpg

// En la DB solo se guarda el filename
productos.imagen = "1234567890_5.jpg"
```

## Estado Actual

| Feature | Estado |
|---------|--------|
| Arquitectura cliente-servidor | ✅ |
| 21 módulos | ✅ |
| Permisos por usuario | ✅ |
| Modo offline | ✅ |
| Login offline | ✅ |
| Migración Mónica 11 | ✅ |
| DB optimizada | ✅ |
| PDFs con imágenes | ✅ |
| Wizard instalación | ✅ |
| Instrucciones HTML | ✅ |
| Build dual (server+client) | ✅ |
| Factura Electrónica DGII | ❌ Pendiente |

## Próximos Pasos

1. Implementar vistas de **Conciliación** y **Corte de Caja**
2. Probar en Windows con DB real de Mónica 11
3. Agregar más reportes
4. Implementar Factura Electrónica DGII Nicaragua (opcional)

## Contacto

- **Desarrollador**: @ograinhard (Telegram)
- **Repo**: https://github.com/EverKrypton/factu-lite
- **Releases**: https://github.com/EverKrypton/factu-lite/releases
