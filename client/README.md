# FactuLite Client

**Interfaz de Usuario** - Se instala en todas las PCs que se conectan al servidor.

## Instalación

### Windows
1. Descargar `FactuLite-Client-Setup.exe`
2. Instalar en cada PC cliente
3. Ejecutar `FactuLite Client`
4. Ingresar la IP del servidor (ej: `192.168.1.50`)
5. Clic en "CONECTAR"

### Desarrollo
```bash
npm install
npm start
```

## Configuración

Al iniciar por primera vez, el cliente muestra:

```
┌─────────────────────────────────────┐
│            FactuLite Client         │
│                                     │
│  Conecta con el servidor FactuLite  │
│                                     │
│  [IP del servidor (ej: 192.168.1.50)]│
│  [Puerto (default: 5000)]           │
│                                     │
│  [      CONECTAR      ]             │
│                                     │
└─────────────────────────────────────┘
```

## Requisitos

- El servidor FactuLite debe estar corriendo
- Ambos deben estar en la misma red

## Cambiar Servidor

En el menú: `FactuLite > Configurar Servidor`

---

**Desarrollado en Nicaragua** 🇳🇮
