# FactuLite Client

**Interfaz de Usuario** - Se instala en TODAS las PCs que se conectan al servidor.

---

## ¿Qué hace?

El cliente es solo la "ventana" al sistema:
- Muestra la interfaz de usuario
- Se conecta al servidor via HTTP
- **NO almacena datos** - todo está en el servidor

---

## Instalación

### Windows (Producción)
1. Descargar `FactuLite-Client-Setup-x64.exe` de [Releases](https://github.com/EverKrypton/factu-lite/releases)
2. Ejecutar el instalador
3. Instalar en cada PC cliente
4. Ejecutar `FactuLite Client`

### Desarrollo
```bash
npm install
npm start
```

---

## Primera Ejecución

Al abrir por primera vez, muestra:

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

### Pasos:
1. Ingresar la **IP del servidor** (ej: `192.168.1.50`)
2. El puerto ya está en `5000` por defecto
3. Clic en **CONECTAR**
4. Se abre el sistema de facturación

---

## Cambiar de Servidor

Si necesitas conectarte a otro servidor:

1. Menú superior: **FactuLite > Configurar Servidor**
2. Ingresa la nueva IP
3. Clic en CONECTAR

---

## Requisitos

| Requisito | Detalle |
|-----------|---------|
| Servidor corriendo | El servidor debe estar activo |
| Misma red | Ambos en el mismo router/red |
| Conexión estable | Ethernet o WiFi |

---

## Solución de Problemas

### "No se puede conectar al servidor"

**Verificar:**
1. ¿El servidor está corriendo?
2. ¿La IP es correcta?
3. ¿Están en la misma red?
4. ¿El firewall permite el puerto 5000?

**Probar:**
1. Ping al servidor: `ping 192.168.1.50`
2. Abrir en navegador: `http://192.168.1.50:5000`

### "Se conecta pero no cargan los datos"

- Verificar que la DB del servidor esté bien
- Revisar consola del servidor por errores

---

## Datos Almacenados

El cliente **NO** guarda datos del negocio. Solo guarda:

| Dato | Ubicación |
|------|-----------|
| IP del servidor | Configuración local del usuario |
| Preferencias de ventana | Sistema operativo |

Todo lo demás (productos, facturas, clientes) está en el **servidor**.

---

## Estructura

```
client/
├── src/
│   └── index.js          # Solo Electron + UI de conexión
├── package.json
├── config.client.yml
└── instrucciones.html
```

El cliente es muy simple: solo muestra una ventana para configurar la IP y luego carga la URL del servidor.

---

## Múltiples Clientes

Puedes instalar el cliente en todas las PCs que necesites:

```
         SERVIDOR (192.168.1.50)
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
 CLIENTE 1   CLIENTE 2   CLIENTE 3
 (Caja 1)    (Caja 2)    (Admin)
```

Cada cliente solo necesita:
1. Tener el cliente instalado
2. Conocer la IP del servidor
3. Estar en la misma red

---

## Menú

El cliente tiene un menú simple:

**FactuLite**
- Configurar Servidor
- ---
- Salir

**Ver**
- Recargar
- Pantalla completa
- ---
- Herramientas de desarrollador

---

## Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar
npm start

# Build para distribución
npm run build
```

---

**Desarrollado en Nicaragua** 🇳🇮
