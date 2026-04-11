# FactuLite Server

**Backend API + Base de Datos** - Se instala en 1 PC que actúa como servidor.

---

## ¿Qué hace?

El servidor es el "cerebro" del sistema:
- Almacena TODOS los datos (productos, facturas, clientes, usuarios)
- Sirve la interfaz web a los clientes
- Maneja la lógica de negocio
- Procesa las peticiones HTTP

---

## Instalación

### Windows (Producción)
1. Descargar `FactuLite-Server-Setup-x64.exe` de [Releases](https://github.com/EverKrypton/factu-lite/releases)
2. Ejecutar el instalador
3. Instalar en la PC que será el servidor
4. Ejecutar `FactuLite Server`

### Desarrollo
```bash
npm install
npm start
```

---

## Interfaz

Al ejecutar, muestra una ventana con:

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

**Botones:**
- **Abrir en Navegador**: Abre el sistema en el navegador por defecto
- **Copiar URL**: Copia la URL al portapapeles para compartir

---

## Puertos

- Puerto por defecto: `5000`
- Si está ocupado, busca automáticamente en `5001`, `5002`, ... hasta `5010`
- Configurable con variable de entorno: `PORT=3000 npm start`

---

## Base de Datos

| Aspecto | Detalle |
|---------|---------|
| Tipo | SQLite |
| Archivo | `priceless.db` |
| Ubicación | Misma carpeta que el ejecutable |
| Se crea | Automáticamente en primera ejecución |

### Backup
- **API**: `POST http://localhost:5000/api/backup-db`
- **Exportar**: `GET http://localhost:5000/api/exportar-db` (descarga archivo)
- **Manual**: Copiar `priceless.db` a otra ubicación

### Restaurar
- **API**: `POST http://localhost:5000/api/importar-db` (enviar archivo)
- **Manual**: Reemplazar `priceless.db`

---

## API Endpoints

### Autenticación
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/login` | POST | Autenticar usuario |
| `/api/usuarios` | GET | Listar usuarios |
| `/api/usuario` | POST | Crear usuario |
| `/api/usuario` | PUT | Actualizar usuario |

### Productos
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/productos` | GET | Listar todos |
| `/api/producto` | POST | Crear |
| `/api/producto` | PUT | Actualizar |
| `/api/producto` | DELETE | Eliminar |
| `/api/buscar-productos?q=texto` | GET | Buscar |
| `/api/catalogo-pdf` | GET | Exportar catálogo PDF |

### Ventas
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/factura` | POST | Crear factura |
| `/api/ticket` | POST | Crear ticket |
| `/api/facturas` | GET | Historial |
| `/api/anular/:id/:tipo` | POST | Anular documento |

### Sistema
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/servidor` | GET | Info del servidor |
| `/api/dashboard` | GET | Estadísticas |
| `/api/backup-db` | POST | Crear backup |
| `/api/exportar-db` | GET | Descargar DB |
| `/api/importar-db` | POST | Restaurar DB |
| `/api/config-empresa` | GET/PUT | Configuración |

---

## Usuarios por Defecto

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | (vacía) | Administrador |
| caja | caja123 | Cajero |
| caja2 | caja123 | Cajero |
| caja3 | caja123 | Cajero |
| bodega | bodega123 | Bodeguero |
| vendedor | vendedor123 | Vendedor |

**Nota:** `admin` tiene `primer_ingreso = 1`, así que pedirá crear contraseña.

---

## Firewall

Para permitir conexiones desde otras PCs:

1. Abrir **Firewall de Windows**
2. **Permitir una aplicación**
3. Agregar `FactuLite Server`
4. O permitir el puerto **5000** (TCP)

---

## Estructura de Archivos

```
server/
├── src/
│   ├── index.js          # Entry point + Electron main
│   ├── db.js             # SQLite database
│   ├── config.js         # Configuración
│   ├── routes/           # API endpoints
│   │   ├── auth.js       # Login, usuarios
│   │   ├── productos.js  # CRUD productos
│   │   ├── facturas.js   # Facturas, tickets
│   │   ├── clientes.js   # Clientes, proveedores
│   │   ├── contabilidad.js
│   │   ├── reportes.js
│   │   ├── compras.js
│   │   ├── cartera.js
│   │   ├── bancario.js
│   │   ├── proformas.js
│   │   ├── hardware.js
│   │   └── kardex.js
│   └── views/
│       └── index.js      # Todas las vistas HTML
├── package.json
├── config.server.yml
└── instrucciones.html
```

---

## Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Build para distribución
npm run build
```

---

**Desarrollado en Nicaragua** 🇳🇮
