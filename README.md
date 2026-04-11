# FactuLite - Sistema de Facturación Cliente-Servidor

**Sistema de facturación para Nicaragua** - Arquitectura Cliente-Servidor

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    FACTULITE SERVER                         │
│  (Se instala en 1 PC - el "servidor")                       │
│                                                             │
│  ✓ Backend API (Node.js + HTTP)                             │
│  ✓ Base de datos (SQLite)                                   │
│  ✓ Todas las vistas HTML                                    │
│  ✓ Puerto 5000 (automático 5000-5010)                       │
│  ✓ Ventana con info de conexión                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP (red local)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FACTULITE CLIENT                         │
│  (Se instala en TODAS las PCs - los "clientes")             │
│                                                             │
│  ✓ Solo interfaz (Electron)                                 │
│  ✓ Se conecta al servidor                                   │
│  ✓ Sin base de datos local                                  │
│  ✓ Ventana para configurar IP                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Descarga

Descarga los instaladores desde [Releases](https://github.com/EverKrypton/factu-lite/releases):

| Archivo | Tamaño aprox | Se instala en |
|---------|--------------|---------------|
| `FactuLite-Server-Setup-x64.exe` | ~80MB | 1 PC (servidor) |
| `FactuLite-Client-Setup-x64.exe` | ~60MB | Todas las PCs (clientes) |

---

## Instalación Paso a Paso

### Paso 1: Instalar el SERVIDOR

1. Descargar `FactuLite-Server-Setup-x64.exe`
2. Ejecutar el instalador
3. Instalar en la PC que será el servidor (preferiblemente la que siempre está encendida)
4. Ejecutar `FactuLite Server` desde el acceso directo
5. Se abrirá una ventana con la información de conexión:

```
┌─────────────────────────────────────────┐
│            FactuLite Server             │
│              v1.0.0                     │
│                                         │
│  ● Servidor Activo                      │
│                                         │
│  http://192.168.1.50:5000              │
│                                         │
│  IP del Servidor: 192.168.1.50         │
│  Puerto: 5000                          │
│  Base de Datos: ./priceless.db         │
│                                         │
│  [Abrir en Navegador] [Copiar URL]     │
│                                         │
│  Los clientes pueden conectarse a       │
│  esta URL                               │
└─────────────────────────────────────────┘
```

6. **Anotar la IP y puerto** (ej: `192.168.1.50:5000`)

### Paso 2: Instalar los CLIENTES

1. Descargar `FactuLite-Client-Setup-x64.exe`
2. Instalar en CADA PC que se conectará al servidor
3. Ejecutar `FactuLite Client`
4. Se abrirá una ventana para configurar:

```
┌─────────────────────────────────────────┐
│            FactuLite Client             │
│                                         │
│  Conecta con el servidor FactuLite      │
│                                         │
│  [IP del servidor (ej: 192.168.1.50)]  │
│  [Puerto (default: 5000)]              │
│                                         │
│  [        CONECTAR        ]             │
│                                         │
│  Asegurate de que el servidor           │
│  FactuLite este corriendo               │
└─────────────────────────────────────────┘
```

5. Ingresar la IP del servidor (ej: `192.168.1.50`)
6. Clic en "CONECTAR"
7. Se abrirá el sistema de facturación

---

## Cómo Funciona

### Flujo de Datos

```
CLIENTE                    SERVIDOR
  │                           │
  │  1. Ingresa IP            │
  │  2. Clic CONECTAR         │
  │──────────────────────────▶│
  │                           │
  │  3. Carga interfaz        │
  │◀──────────────────────────│
  │                           │
  │  4. Usuario hace factura  │
  │──────────────────────────▶│
  │                           │
  │  5. Se guarda en SQLite   │
  │◀──────────────────────────│
  │                           │
  │  Todos los datos se       │
  │  guardan en el SERVIDOR   │
  │                           │
```

### ¿Dónde están los datos?

| Dato | Ubicación |
|------|-----------|
| Productos | Servidor (SQLite) |
| Clientes | Servidor (SQLite) |
| Facturas | Servidor (SQLite) |
| Usuarios | Servidor (SQLite) |
| Configuración de conexión | Cliente (local) |

---

## Backup

### Desde el Servidor
- Opción 1: `POST /api/backup-db` (API)
- Opción 2: `GET /api/exportar-db` (descarga archivo)
- Opción 3: Copiar `priceless.db` manualmente

### Desde el Cliente
- No es necesario - los datos están en el servidor

---

## Múltiples Clientes

```
                    SERVIDOR
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
    CLIENTE 1     CLIENTE 2     CLIENTE 3
    (Caja 1)      (Caja 2)      (Bodega)
         │             │             │
         └─────────────┴─────────────┘
                       │
              TODOS usan la MISMA DB
```

**Ventajas:**
- Ventas en Caja 1 → Visible en Caja 2
- Productos agregados en Bodega → Disponibles en Caja
- Un solo backup para todos

---

## Usuarios por Defecto

| Usuario | Contraseña | Rol | Permisos |
|---------|------------|-----|----------|
| admin | (vacía, configurar) | Administrador | Todo |
| caja | caja123 | Cajero | POS, imprimir |
| caja2 | caja123 | Cajero | POS, imprimir |
| caja3 | caja123 | Cajero | POS, imprimir |
| bodega | bodega123 | Bodeguero | Inventario |
| vendedor | vendedor123 | Vendedor | POS básico |

**Primera vez:**
1. Ingresar con `admin` (sin contraseña)
2. El sistema pedirá crear una contraseña

---

## Desarrollo

### Servidor
```bash
cd server
npm install
npm start
```

### Cliente
```bash
cd client
npm install
npm start
```

### Build Manual
```bash
# Servidor
cd server
npm run build

# Cliente
cd client
npm run build
```

---

## Solución de Problemas

### "No se puede conectar al servidor"
- Verificar que el servidor esté corriendo
- Verificar que estén en la misma red
- Verificar IP correcta
- Verificar firewall (permitir puerto 5000)

### "Puerto ocupado"
- El servidor busca automáticamente otro puerto (5000-5010)
- Cerrar otras aplicaciones que usen esos puertos

### "No aparecen los datos"
- Todos los datos están en el servidor
- Verificar que el cliente esté conectado al servidor correcto

---

## Requisitos

| Componente | Requisito |
|------------|-----------|
| Sistema Operativo | Windows 10/11 |
| Red | Router (misma red local) |
| Servidor | 2GB RAM mínimo |
| Cliente | 1GB RAM mínimo |
| Conexión | Ethernet o WiFi estable |

---

## Estructura del Proyecto

```
factu-lite/
├── README.md                 # Este archivo
├── server/                   # SERVIDOR
│   ├── src/
│   │   ├── index.js          # Entry point + Electron
│   │   ├── db.js             # SQLite database
│   │   ├── config.js         # Configuración
│   │   ├── routes/           # API endpoints
│   │   └── views/            # Vistas HTML
│   ├── package.json
│   └── config.server.yml
│
└── client/                   # CLIENTE
    ├── src/
    │   └── index.js          # Solo Electron + UI conexión
    ├── package.json
    └── config.client.yml
```

---

## API Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/login` | POST | Autenticación |
| `/api/servidor` | GET | Info del servidor |
| `/api/productos` | GET | Lista productos |
| `/api/producto` | POST | Crear producto |
| `/api/factura` | POST | Crear factura |
| `/api/ticket` | POST | Crear ticket |
| `/api/dashboard` | GET | Estadísticas |
| `/api/backup-db` | POST | Crear backup |
| `/api/exportar-db` | GET | Descargar DB |
| `/api/importar-db` | POST | Restaurar DB |
| `/api/config-empresa` | GET/PUT | Configuración |

---

## Ventajas vs Monica 11

| Característica | FactuLite | Monica 11 |
|----------------|-----------|-----------|
| Arquitectura | Cliente-Servidor | Desktop |
| DB centralizada | ✅ | ❌ |
| Multi-PC ilimitado | ✅ | 25 max |
| Se congela | ❌ | ✅ |
| Web access | ✅ | ❌ |
| Usuarios ilimitados | ✅ | ❌ |
| Código abierto | ✅ MIT | ❌ |
| Backup simple | ✅ 1 clic | ❌ Manual |

---

**Desarrollado en Nicaragua** 🇳🇮
