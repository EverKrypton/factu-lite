# FactuLite - Sistema de Facturación

**Sistema de facturación para Nicaragua** - Arquitectura Cliente-Servidor

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    FACTULITE SERVER                         │
│  (Se instala en 1 PC)                                       │
│                                                             │
│  - Backend API (Node.js)                                    │
│  - Base de datos (SQLite)                                   │
│  - Puerto 5000                                              │
│  - Todas las vistas HTML                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FACTULITE CLIENT                         │
│  (Se instala en todas las PCs)                              │
│                                                             │
│  - Solo interfaz (Electron)                                 │
│  - Conecta al servidor                                      │
│  - Sin base de datos local                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Instalación

### Paso 1: Servidor
1. Instalar `FactuLite-Server-Setup.exe` en la PC principal
2. Ejecutar y anotar la IP (ej: `192.168.1.50:5000`)

### Paso 2: Clientes
1. Instalar `FactuLite-Client-Setup.exe` en cada PC
2. Ejecutar e ingresar la IP del servidor
3. Clic en "CONECTAR"

---

## Ventajas

| Característica | Beneficio |
|----------------|-----------|
| **DB centralizada** | Todos usan los mismos datos |
| **Instalación clara** | No hay confusión |
| **Backup simple** | Solo en el servidor |
| **Seguro** | DB no accesible desde clientes |
| **Escalable** | Agregar clientes sin tocar DB |

---

## Proyectos

| Carpeta | Descripción |
|---------|-------------|
| `server/` | Backend + DB + API |
| `client/` | Interfaz Electron |

---

## Requisitos

- Windows 10/11
- Red local (router)
- Servidor y clientes en la misma red

---

## Usuarios por Defecto

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | (vacía) | Administrador |
| caja | caja123 | Cajero |
| bodega | bodega123 | Bodeguero |
| vendedor | vendedor123 | Vendedor |

---

**Desarrollado en Nicaragua** 🇳🇮
