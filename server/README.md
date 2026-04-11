# FactuLite Server

**Backend API + Base de Datos** - Se instala en 1 PC que actúa como servidor.

## Instalación

### Windows
1. Descargar `FactuLite-Server-Setup.exe`
2. Instalar en la PC que será el servidor
3. Ejecutar `FactuLite Server`
4. Anotar la IP que muestra (ej: `192.168.1.50:5000`)

### Desarrollo
```bash
npm install
npm start
```

## Uso

El servidor muestra en consola:
```
╔══════════════════════════════════════════════════════════╗
║           FACTULITE SERVER v1.0.0                       ║
╠══════════════════════════════════════════════════════════╣
║  Puerto: 5000
║  Local:  http://localhost:5000
║  Red:    http://192.168.1.50:5000
║  DB:     ./priceless.db
╠══════════════════════════════════════════════════════════╣
║  Los clientes pueden conectarse a:                       ║
║  http://192.168.1.50:5000
╚══════════════════════════════════════════════════════════╝
```

## Puertos

Busca automáticamente un puerto libre entre 5000-5010.

## Base de Datos

- SQLite (`priceless.db`)
- Se crea automáticamente en la primera ejecución
- Backup: `POST /api/backup-db`
- Exportar: `GET /api/exportar-db`
- Importar: `POST /api/importar-db`

## API Endpoints

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/servidor` | Info del servidor |
| `GET /api/productos` | Lista productos |
| `POST /api/factura` | Crear factura |
| `GET /api/dashboard` | Dashboard |
| `GET /api/usuarios` | Lista usuarios |
| `POST /api/login` | Autenticación |

## Usuarios por Defecto

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | (vacía) | Administrador |
| caja | caja123 | Cajero |
| bodega | bodega123 | Bodeguero |
| vendedor | vendedor123 | Vendedor |

---

**Desarrollado en Nicaragua** 🇳🇮
