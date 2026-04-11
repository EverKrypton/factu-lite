# FactuLite - Sistema de Facturación Cliente-Servidor

[![Build](https://github.com/EverKrypton/factu-lite/actions/workflows/build.yml/badge.svg)](https://github.com/EverKrypton/factu-lite/actions/workflows/build.yml)
[![Version](https://img.shields.io/badge/version-1.7.0-blue.svg)](https://github.com/EverKrypton/factu-lite/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**Sistema de facturación para Nicaragua** - Alternativa a Mónica 11 con arquitectura cliente-servidor y modo offline.

---

## Características Principales

| Característica | Descripción |
|----------------|-------------|
| **Cliente-Servidor** | Servidor centralizado, múltiples clientes conectados |
| **Modo Offline** | Los clientes funcionan sin conexión al servidor |
| **21 Módulos** | POS, Facturación, Inventario, Contabilidad, y más |
| **Permisos Granulares** | El admin asigna permisos individuales por usuario y módulo |
| **Migración Mónica 11** | Importa datos desde Mónica 11 automáticamente |
| **Multiplataforma** | Funciona en Windows, Linux y Mac |
| **Código Abierto** | Licencia MIT |

---

## Descarga e Instalación

### Descargar

Descarga los instaladores desde [Releases](https://github.com/EverKrypton/factu-lite/releases):

| Archivo | Tamaño | Se instala en |
|---------|--------|---------------|
| `FactuLite-Server-Setup-x64.exe` | ~80MB | 1 PC (servidor) |
| `FactuLite-Client-Setup-x64.exe` | ~60MB | Todas las PCs (clientes) |

### Instalar el Servidor

```
┌─────────────────────────────────────────────────────────────┐
│  PASO 1: Ubicación de la Base de Datos                      │
│  → Ruta por defecto: ./priceless.db                         │
│  → Opción de cambiar ubicación                              │
├─────────────────────────────────────────────────────────────┤
│  PASO 2: Crear Administrador                                │
│  → Usuario (mínimo 3 caracteres)                            │
│  → Nombre completo                                          │
│  → Contraseña (mínimo 4 caracteres)                         │
│  → Confirmar contraseña                                     │
├─────────────────────────────────────────────────────────────┤
│  PASO 3: Seleccionar Módulos                                │
│  → Checkbox para cada módulo                                │
│  → Todos marcados por defecto                               │
├─────────────────────────────────────────────────────────────┤
│  PASO 4: Instalación Completada                             │
│  → Muestra IP del servidor (ej: 192.168.1.50)              │
│  → Checkbox "Ejecutar FactuLite al cerrar"                  │
│  → Botón "FINALIZAR Y ABRIR SISTEMA"                        │
└─────────────────────────────────────────────────────────────┘
```

**Importante**: Anota la IP que muestra al final (ej: `192.168.1.50`). La necesitarás para conectar los clientes.

### Instalar los Clientes

1. Instalar `FactuLite-Client-Setup-x64.exe` en cada PC que usará el sistema
2. Al abrir el cliente:
   - Ingresa la IP del servidor (ej: `192.168.1.50`)
   - Puerto: `5000` (por defecto)
   - Click en **"CONECTAR AL SERVIDOR"**
3. Se abrirá el navegador con la interfaz del sistema

---

## Arquitectura

```
     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
     │  CLIENTE 1   │     │  CLIENTE 2   │     │  CLIENTE N   │
     │  (Electron)  │     │  (Electron)  │     │  (Electron)  │
     │              │     │              │     │              │
     │  ✓ WebView   │     │  ✓ WebView   │     │  ✓ WebView   │
     │  ✓ IndexedDB │     │  ✓ IndexedDB │     │  ✓ IndexedDB │
     │  ✓ Offline   │     │  ✓ Offline   │     │  ✓ Offline   │
     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
            │                    │                    │
            │      HTTP/REST API (Puerto 5000)       │
            │                    │                    │
            └────────────────────┼────────────────────┘
                                 │
                                 ▼
              ┌─────────────────────────────────────┐
              │           SERVIDOR                  │
              │           (Electron)                │
              │                                     │
              │  ✓ HTTP Server (Node.js)            │
              │  ✓ SQLite DB (better-sqlite3)       │
              │  ✓ API REST (13 módulos)            │
              │  ✓ Vistas HTML (Vanilla JS)         │
              │  ✓ 29 Tablas                        │
              │  ✓ Puerto automático 5000-5010      │
              └─────────────────────────────────────┘
```

### ¿Dónde están los datos?

| Datos | Ubicación |
|-------|-----------|
| Productos | Servidor (SQLite) |
| Clientes | Servidor (SQLite) |
| Facturas | Servidor (SQLite) |
| Usuarios | Servidor (SQLite) |
| Configuración | Servidor (SQLite) |
| Pendientes offline | Cliente (IndexedDB) |

---

## Modo Offline

El cliente puede funcionar sin conexión al servidor:

```
┌─────────────────────────────────────────────────────────────┐
│  SIN CONEXIÓN AL SERVIDOR                                   │
├─────────────────────────────────────────────────────────────┤
│  1. Click en "TRABAJAR OFFLINE"                             │
│  2. Login con usuario sincronizado                          │
│  3. Crear facturas y tickets                                │
│  4. Se guardan en IndexedDB local                           │
├─────────────────────────────────────────────────────────────┤
│  CUANDO EL SERVIDOR VUELVE                                  │
├─────────────────────────────────────────────────────────────┤
│  1. Click en "Sincronizar con Servidor"                     │
│  2. Se envían todos los pendientes                          │
│  3. Cada usuario ve su historial                            │
│  4. El admin ve todo                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Módulos (21)

| # | Módulo | ID | Descripción |
|---|--------|-----|-------------|
| 1 | Punto de Venta | `pos` | Facturación rápida y tickets |
| 2 | Facturación | `facturacion` | Facturas y documentos |
| 3 | Factura por Lote | `factura_lote` | Facturación masiva mensual |
| 4 | Inventario | `inventario` | Control de productos y stock |
| 5 | Clientes | `clientes` | Cartera de clientes |
| 6 | Proveedores | `proveedores` | Directorio de proveedores |
| 7 | Cuentas por Cobrar | `cuentas_cobrar` | Cartera y cobros |
| 8 | Cuentas por Pagar | `cuentas_pagar` | Pagos a proveedores |
| 9 | Contabilidad | `contabilidad` | Partida doble, libro diario, mayor |
| 10 | Kárdex | `kardex` | Movimientos de inventario |
| 11 | Bancario | `bancario` | Cuentas corrientes |
| 12 | Conciliación | `conciliacion` | Conciliación bancaria |
| 13 | Corte de Caja | `corte_caja` | Cierres y arqueos |
| 14 | Reportes | `reportes` | Reportes de ventas |
| 15 | Proformas | `proformas` | Cotizaciones |
| 16 | Órdenes de Compra | `ordenes` | Compras a proveedores |
| 17 | Devoluciones | `devoluciones` | Devoluciones de ventas |
| 18 | Backup/Restore | `backup` | Respaldos de base de datos |
| 19 | Scanner Código Barras | `scanner` | Lectura de códigos |
| 20 | Gaveta Electrónica | `gaveta` | Caja de dinero |

---

## Sistema de Permisos

### Permisos por Módulo

El administrador asigna permisos individuales a cada usuario:

| Permiso | Descripción |
|---------|-------------|
| **Ver** | Puede acceder al módulo |
| **Crear** | Puede crear nuevos registros |
| **Editar** | Puede modificar registros existentes |
| **Eliminar** | Puede eliminar registros |
| **Imprimir** | Puede imprimir documentos |
| **Exportar** | Puede exportar datos |

### Cómo Asignar Permisos

```
1. Admin → Usuarios
2. Click en "Permisos" del usuario
3. Modal con todos los módulos
4. Marcar/desmarcar checkboxes
5. Click en "Guardar Cambios"
```

### Ejemplo Práctico

> "Los chavalos antes podían ver una factura después de hecha, pero el admin les quitó esa opción. Solo el admin, el cajero y la dueña pueden hacerlo ahora."

```
Usuario: chavalo1
Módulo: Facturación
  ✓ Ver      → ✅ Puede ver el módulo
  ✓ Crear    → ✅ Puede crear facturas
  ✗ Editar   → ❌ No puede editar
  ✗ Eliminar → ❌ No puede eliminar
  ✗ Imprimir → ❌ No puede imprimir
```

---

## Roles de Usuario

| Rol | Ver | Crear | Editar | Eliminar | Imprimir | Exportar |
|-----|-----|-------|--------|----------|----------|----------|
| **admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **caja** | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **vendedor** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **bodega** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **distribuidor** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

**Nota**: Los permisos por defecto se pueden personalizar para cada usuario.

---

## Migración desde Mónica 11

FactuLite incluye un script de migración automática que detecta y convierte la estructura de la base de datos de Mónica 11.

### Formatos Soportados

- MySQL / MariaDB
- SQL Server
- PostgreSQL
- SQLite
- JSON

### Uso

```bash
# 1. Subir archivo SQL
POST /api/migrar/subir

# 2. Analizar estructura
POST /api/migrar/analizar
{ "archivo": "/ruta/al/archivo.sql" }

# 3. Ejecutar migración
POST /api/migrar/ejecutar
{ "archivo": "/ruta/al/archivo.sql" }
```

### Mapeo Automático

El script detecta automáticamente las tablas y campos:

| Mónica 11 | FactuLite |
|-----------|-----------|
| `producto` | `productos` |
| `cliente` | `clientes` |
| `factura` | `facturas` |
| `precio_venta` | `precio` |
| `cantidad` | `cantidad` |

---

## API REST

### Autenticación y Usuarios

```bash
POST /api/login                    # Login
GET  /api/usuarios                 # Lista usuarios
POST /api/usuario                  # Crear usuario
PUT  /api/usuario                  # Editar usuario
DELETE /api/usuario                # Eliminar usuario
GET  /api/permisos-usuario?id=X    # Permisos de usuario
PUT  /api/permisos-usuario         # Actualizar permiso
POST /api/permisos-usuario/reset   # Resetear por rol
```

### Productos e Inventario

```bash
GET  /api/productos                # Lista productos
POST /api/producto                 # Crear producto
PUT  /api/producto                 # Editar producto
DELETE /api/producto               # Eliminar producto
GET  /api/producto/:codigo         # Buscar por código
GET  /api/buscar-productos?q=X     # Buscar productos
GET  /api/catalogo-pdf             # Catálogo PDF con imágenes
GET  /api/etiquetas-pdf?ids=1,2,3  # Imprimir etiquetas
```

### Ventas

```bash
POST /api/factura                  # Crear factura
POST /api/ticket                   # Crear ticket
PUT  /api/factura                  # Modificar factura
PUT  /api/ticket                   # Modificar ticket
GET  /api/facturas                 # Historial de ventas
GET  /api/facturas-usuario/:id     # Ventas por usuario
POST /api/anular/factura/:id       # Anular factura
POST /api/anular/ticket/:id        # Anular ticket
GET  /api/imprimir/factura/:id     # Vista de impresión
POST /api/factura-lote             # Facturación por lote
```

### Sistema

```bash
GET  /api/servidor                 # Info del servidor (IP, puerto)
GET  /api/modulos                  # Lista módulos activos
PUT  /api/modulos                  # Activar/desactivar módulos
GET  /api/config-empresa           # Configuración empresa
PUT  /api/config-empresa           # Guardar configuración
POST /api/backup-db                # Crear backup
GET  /api/exportar-db              # Exportar DB completa
POST /api/importar-db              # Importar backup
POST /api/optimizar-db             # Optimizar DB (VACUUM, ANALYZE)
```

---

## Base de Datos

### Especificaciones

| Aspecto | Valor |
|---------|-------|
| Motor | SQLite (better-sqlite3) |
| Tablas | 29 |
| Índices | 14 |
| Tamaño óptimo | <50MB para 100 usuarios + 5000 reportes/día |

### Optimización

```javascript
// PRAGMA aplicados
journal_mode = WAL          // Write-Ahead Logging
cache_size = -64000         // 64MB cache
mmap_size = 268435456       // 256MB mmap
temp_store = MEMORY         // Temp tables en memoria
synchronous = NORMAL        // Balance rendimiento/seguridad
```

### Tablas Principales

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
| `cuentas_pagar` | Cuentas por pagar |
| `kardex` | Movimientos de inventario |
| `cuentas_corrientes` | Cuentas bancarias |
| `asientos` | Asientos contables |
| `proformas` | Cotizaciones |
| `devoluciones` | Devoluciones |
| `config_empresa` | Configuración |

---

## Comparación con Mónica 11

| Característica | FactuLite | Mónica 11 |
|----------------|-----------|-----------|
| **Arquitectura** | Cliente-Servidor | Desktop |
| **Modo Offline** | ✅ | ❌ |
| **Multi-PC** | ✅ Ilimitado | 25 máximo |
| **Web access** | ✅ | ❌ |
| **Mobile friendly** | ✅ | ❌ |
| **Usuarios** | ✅ Ilimitados | Limitado |
| **Permisos por usuario** | ✅ | ✅ |
| **DB centralizada** | ✅ | ❌ |
| **DB abierta** | ✅ SQLite | ❌ Propietario |
| **API REST** | ✅ | ❌ |
| **Código abierto** | ✅ MIT | ❌ |
| **Migración** | ✅ Desde Mónica | - |
| **Precio** | Gratuito | US$ 49+ |
| **Módulos** | 21 | 22 |
| **Factura Electrónica DGII** | ❌ | ❌ |

---

## Desarrollo

### Requisitos

- Node.js 18+
- npm 9+

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/EverKrypton/factu-lite.git
cd factu-lite

# Servidor
cd server
npm install
npm start

# Cliente (en otra terminal)
cd client
npm install
npm start
```

### Scripts

```bash
npm start          # Iniciar aplicación (Electron)
npm run serve      # Solo servidor (Node.js, sin Electron)
npm run build      # Crear instalador .exe
```

### Estructura del Proyecto

```
factu-lite/
├── server/
│   ├── src/
│   │   ├── index.js              # Entry point + HTTP server
│   │   ├── db.js                 # SQLite + tablas + índices
│   │   ├── config.js             # Configuración
│   │   ├── views/
│   │   │   └── index.js          # HTML embebido (todas las vistas)
│   │   ├── routes/
│   │   │   ├── auth.js           # Login, usuarios, permisos
│   │   │   ├── productos.js      # CRUD + catálogo PDF
│   │   │   ├── facturas.js       # Facturas, tickets, anulación
│   │   │   ├── clientes.js       # Clientes y proveedores
│   │   │   ├── contabilidad.js   # Asientos, mayor, balance
│   │   │   ├── reportes.js       # Dashboard, estadísticas
│   │   │   ├── compras.js        # Órdenes de compra
│   │   │   ├── cartera.js        # Cuentas cobrar/pagar
│   │   │   ├── bancario.js       # Cuentas corrientes
│   │   │   ├── proformas.js      # Cotizaciones
│   │   │   ├── hardware.js       # Scanner, gaveta
│   │   │   └── kardex.js         # Movimientos inventario
│   │   └── migracion/
│   │       └── migrar.js         # Migración Mónica 11
│   ├── package.json
│   ├── config.server.yml
│   └── instrucciones.html
│
├── client/
│   ├── src/
│   │   └── index.js              # Cliente + modo offline
│   ├── package.json
│   └── config.client.yml
│
├── .github/
│   └── workflows/
│       └── build.yml             # Build dual server+client
│
├── README.md
├── DESIGN.md
└── AGENTS.md
```

---

## Crear Releases

```bash
# 1. Hacer cambios
git add -A
git commit -m "feat: descripción del cambio"

# 2. Crear tag
git tag v1.x.x

# 3. Push
git push origin main --tags

# 4. El workflow automáticamente:
#    - Compila server → FactuLite-Server-Setup-x64.exe
#    - Compila client → FactuLite-Client-Setup-x64.exe
#    - Crea release en GitHub con ambos .exe
```

---

## Solución de Problemas

### "No se puede conectar al servidor"

1. Verificar que el servidor esté corriendo
2. Verificar que estén en la misma red WiFi
3. Verificar que la IP sea correcta
4. Verificar firewall (permitir puerto 5000)

### "El cliente no sincroniza"

1. Verificar conexión al servidor
2. Click en "Sincronizar con Servidor"
3. Revisar que haya pendientes en la cola

### "Base de datos corrupta"

1. Restaurar desde backup: `POST /api/importar-db`
2. O copiar archivo `.db` manualmente

---

## Requisitos del Sistema

| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| **Servidor** | | |
| Sistema Operativo | Windows 10 | Windows 11 |
| RAM | 2 GB | 4 GB |
| Disco | 500 MB | 2 GB |
| **Cliente** | | |
| Sistema Operativo | Windows 10 | Windows 11 |
| RAM | 1 GB | 2 GB |
| **Red** | | |
| Router | Cualquier router WiFi | Gigabit |
| Conexión | WiFi o Ethernet | Ethernet |

---

## Roadmap

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
| Build dual (server+client) | ✅ |
| Vista Conciliación | ⏳ Pendiente |
| Vista Corte de Caja | ⏳ Pendiente |
| Factura Electrónica DGII | ⏳ Pendiente |

---

## Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

---

## Soporte

- **Telegram**: @ograinhard
- **Repositorio**: https://github.com/EverKrypton/factu-lite
- **Releases**: https://github.com/EverKrypton/factu-lite/releases
- **Issues**: https://github.com/EverKrypton/factu-lite/issues

---

**Desarrollado en Nicaragua** 🇳🇮
