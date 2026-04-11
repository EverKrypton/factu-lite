# FactuLite - Sistema de Facturación Cliente-Servidor

**Sistema de facturación para Nicaragua** - Arquitectura Cliente-Servidor

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    FACTULITE CLIENT                         │
│  (Se instala en TODAS las PCs)                              │
│                                                             │
│  ✓ WebView con interfaz del servidor                        │
│  ✓ Modo Offline (IndexedDB)                                 │
│  ✓ Sincronización automática                                │
│  ✓ Login local cuando no hay servidor                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP (red local)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FACTULITE SERVER                         │
│  (Se instala en 1 PC - el "servidor")                       │
│                                                             │
│  ✓ Backend API (Node.js + HTTP)                             │
│  ✓ Base de datos (SQLite optimizado)                        │
│  ✓ Todas las vistas HTML                                    │
│  ✓ 21 módulos                                               │
│  ✓ Puerto 5000 (automático 5000-5010)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Descarga

Descarga los instaladores desde [Releases](https://github.com/EverKrypton/factu-lite/releases):

| Archivo | Se instala en |
|---------|---------------|
| `FactuLite-Server-Setup-x64.exe` | 1 PC (servidor) |
| `FactuLite-Client-Setup-x64.exe` | Todas las PCs (clientes) |

---

## Instalación

### Paso 1: Instalar el SERVIDOR

1. Descargar `FactuLite-Server-Setup-x64.exe`
2. Ejecutar el instalador
3. Al abrir, sigue el wizard:
   - **Paso 1**: Ubicación de la base de datos
   - **Paso 2**: Crear usuario administrador (usuario, nombre, contraseña)
   - **Paso 3**: Seleccionar módulos a activar
   - **Paso 4**: Ver IP del servidor

4. **Anotar la IP** (ej: `192.168.1.50:5000`)

### Paso 2: Instalar los CLIENTES

1. Descargar `FactuLite-Client-Setup-x64.exe`
2. Instalar en CADA PC que usará el sistema
3. Al abrir:
   - Ingresa la IP del servidor
   - Click en "CONECTAR AL SERVIDOR"
   - O click en "TRABAJAR OFFLINE" si no hay servidor

---

## Modo Offline

El cliente puede trabajar sin conexión al servidor:

1. **Sin servidor**: Click en "TRABAJAR OFFLINE"
2. **Login**: Usa usuarios sincronizados del servidor
3. **Ventas**: Se guardan en IndexedDB local
4. **Sincronización**: Cuando el servidor vuelve, click en "Sincronizar"

---

## Módulos (21)

| Módulo | Descripción |
|--------|-------------|
| POS | Punto de venta rápido |
| Facturación | Facturas y documentos |
| Factura por Lote | Facturación masiva mensual |
| Inventario | Productos y stock |
| Clientes | Cartera de clientes |
| Proveedores | Directorio de proveedores |
| Cuentas por Cobrar | Cartera y cobros |
| Cuentas por Pagar | Pagos a proveedores |
| Contabilidad | Partida doble, libro diario, mayor |
| Kárdex | Movimientos de inventario |
| Bancario | Cuentas corrientes |
| Conciliación | Conciliación bancaria |
| Corte de Caja | Cierres y arqueos |
| Reportes | Reportes de ventas |
| Proformas | Cotizaciones |
| Órdenes de Compra | Compras a proveedores |
| Devoluciones | Devoluciones de ventas |
| Backup/Restore | Respaldos de base de datos |
| Scanner Código Barras | Lectura de códigos |
| Gaveta Electrónica | Caja de dinero |

---

## Permisos por Usuario

El administrador asigna permisos individuales a cada usuario:

| Permiso | Descripción |
|---------|-------------|
| Ver | Puede acceder al módulo |
| Crear | Puede crear nuevos registros |
| Editar | Puede modificar registros |
| Eliminar | Puede eliminar registros |
| Imprimir | Puede imprimir documentos |
| Exportar | Puede exportar datos |

**Flujo**: Admin → Usuarios → Click en "Permisos" → Marcar checkboxes → Guardar

---

## Comparación con Mónica 11

| Característica | FactuLite | Mónica 11 |
|----------------|-----------|-----------|
| Arquitectura | Cliente-Servidor | Desktop |
| Modo Offline | ✅ | ❌ |
| Multi-PC ilimitado | ✅ | 25 max |
| Web access | ✅ | ❌ |
| Usuarios ilimitados | ✅ | Limitado |
| Permisos por usuario | ✅ | ✅ |
| DB centralizada | ✅ | ❌ |
| Código abierto | ✅ MIT | ❌ |
| Migración desde Mónica | ✅ | - |

---

## Migración desde Mónica 11

FactuLite incluye un script de migración automática:

```
POST /api/migrar/subir     → Sube archivo SQL
POST /api/migrar/analizar  → Analiza estructura
POST /api/migrar/ejecutar  → Ejecuta migración
```

Soporta: MySQL, SQL Server, PostgreSQL, SQLite, JSON

---

## Desarrollo

```bash
# Servidor
cd server && npm install && npm start

# Cliente
cd client && npm install && npm start

# Build
cd server && npm run build
cd client && npm run build
```

---

## Estructura del Proyecto

```
factu-lite/
├── server/
│   ├── src/
│   │   ├── index.js          # Entry point
│   │   ├── db.js             # SQLite (29 tablas)
│   │   ├── config.js         # Configuración
│   │   ├── views/index.js    # HTML embebido
│   │   ├── routes/           # 13 archivos API
│   │   └── migracion/        # Migración Mónica
│   ├── package.json
│   └── instrucciones.html
├── client/
│   ├── src/index.js          # Cliente + offline
│   └── package.json
├── .github/workflows/        # Build dual
├── README.md
├── DESIGN.md
└── AGENTS.md
```

---

## API Endpoints Principales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/login` | POST | Login |
| `/api/usuarios` | GET | Lista usuarios |
| `/api/permisos-usuario` | GET/PUT | Permisos |
| `/api/productos` | GET | Productos |
| `/api/factura` | POST/PUT | Facturas |
| `/api/ticket` | POST/PUT | Tickets |
| `/api/backup-db` | POST | Backup |
| `/api/optimizar-db` | POST | Optimizar |

Ver documentación completa en [AGENTS.md](AGENTS.md)

---

## Requisitos

| Componente | Requisito |
|------------|-----------|
| Sistema Operativo | Windows 10/11 |
| Red | Router (misma red local) |
| Servidor | 2GB RAM mínimo |
| Cliente | 1GB RAM mínimo |

---

**Desarrollado en Nicaragua** 🇳🇮

**Soporte**: @ograinhard (Telegram)
