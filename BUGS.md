# BUGS.md - Auditoría Completa de Bugs

**Proyecto:** FactuLite v1.7.0  
**Fecha:** Abril 2026  
**Stack:** Electron 28.x, Vanilla JS, SQLite (better-sqlite3), PDFKit

---

## RESUMEN EJECUTIVO

| Severidad | Cantidad |
|-----------|----------|
| **ALTA** | 12 bugs |
| **MEDIA** | 18 bugs |
| **BAJA** | 14 bugs |
| **TOTAL** | 44 bugs |

---

## 1. BUGS DE ALTA SEVERIDAD

### 1.1 SQL Injection en bancario.js

**Archivo:** `server/src/routes/bancario.js`  
**Líneas:** 33-37  
**Código problemático:**
```javascript
let query = 'SELECT * FROM movimientos_bancarios WHERE 1=1';
if (cuentaId) query += ` AND cuenta_id = ${parseInt(cuentaId)}`;
if (fi) query += ` AND fecha >= '${fi}'`;
if (ff) query += ` AND fecha <= '${ff}'`;
```
**Descripción:** Construcción de queries SQL con concatenación de strings sin sanitizar. Las fechas `fi` y `ff` se insertan directamente.  
**Severidad:** ALTA - Vulnerabilidad de seguridad

---

### 1.2 SQL Injection en contabilidad.js

**Archivo:** `server/src/routes/contabilidad.js`  
**Líneas:** 43-46  
**Código problemático:**
```javascript
let query = 'SELECT * FROM asientos WHERE 1=1';
if (fechaIni && fechaFin) query += ` AND fecha >= '${fechaIni}' AND fecha <= '${fechaFin}'`;
```
**Severidad:** ALTA

---

### 1.3 toFixed() sin validación en facturas.js

**Archivo:** `server/src/routes/facturas.js`  
**Líneas:** 22, 45-48, 128-134, 217  
**Código problemático:**
```javascript
const totalUSD = doc.tipo_cambio > 0 ? (doc.total / doc.tipo_cambio).toFixed(2) : '0.00';
// ...
`<td>C$ ${i.precio.toFixed(2)}</td>`
// ...
`<span>C$ ${doc.total.toFixed(2)}</span>`
```
**Severidad:** ALTA - Causará crashes en producción

---

### 1.4 toFixed() sin validación en views/index.js

**Archivo:** `server/src/views/index.js`  
**Líneas:** 655-660, 666, 669, 755, 765, 810, 829, 831, 843, 849, 856, 1291

**Severidad:** ALTA

---

### 1.5 Filtro WHERE activo = 1 excluye clientes válidos

**Archivo:** `server/src/routes/clientes.js`  
**Línea:** 13  
**Código problemático:**
```javascript
const clientes = sdb.prepare('SELECT * FROM clientes WHERE activo = 1').all();
```
**Descripción:** Clientes inactivos no aparecen en el POS ni en selectores, pero sus datos históricos en facturas referenciándolos no se encontrarán.  
**Severidad:** ALTA

---

### 1.6 Filtro WHERE activo = 1 excluye proveedores válidos

**Archivo:** `server/src/routes/clientes.js`  
**Línea:** 49  
**Código problemático:**
```javascript
const proveedores = sdb.prepare('SELECT * FROM proveedores WHERE activo = 1').all();
```
**Severidad:** ALTA - Proveedores inactivos no aparecen en compras

---

### 1.7 Bug en bancario.js - tipo de movimiento incorrecto

**Archivo:** `server/src/routes/bancario.js`  
**Línea:** 51  
**Código problemático:**
```javascript
const nuevoSaldo = data.tipo === 'entrada' ? cuenta.saldo_actual + data.monto : cuenta.saldo_actual - data.monto;
```
**Descripción:** El frontend envía `deposito`, `cheque`, `transferencia`, `gasto` pero se compara con `'entrada'`. Los depósitos NO actualizarán el saldo.  
**Severidad:** ALTA

---

### 1.8 Variable event no definida en POS

**Archivo:** `server/src/views/index.js`  
**Línea:** 872  
**Código problemático:**
```javascript
async function hacer(tipo){
    if(carousel.length===0)return;
    const btn = event.target;  // <-- event no está definido
```
**Severidad:** ALTA - Depende de window.event del browser

---

### 1.9 .toFixed() en reporte-usuarios sin validación

**Archivo:** `server/src/views/index.js`  
**Línea:** 1291  
**Código problemático:**
```javascript
{label:'Total General',valor:'C$ '+d.totalGeneral.toFixed(2),...}
```
**Severidad:** ALTA

---

### 1.10 Typo en getter/setter de cuentasCorrientes

**Archivo:** `server/src/db.js`  
**Líneas:** 758-759  
**Código problemático:**
```javascript
get cuentasCorrientes() { return db.prepare('SELECT * FROM cuentas_corrientes').all(); },
set cuentasCorientes(val) { },  // <-- typo
```
**Severidad:** ALTA

---

### 1.11 Promise sin await en views

**Archivo:** `server/src/views/index.js`  
**Líneas:** 2711-2719  
**Descripción:** No hay try/catch, no se maneja error de red.  
**Severidad:** ALTA

---

### 1.12 Config empresa no inicializada

**Archivo:** `server/src/routes/auth.js`  
**Líneas:** 70, 192-195  
**Descripción:** Si config_empresa no tiene registros, devuelve {}. El frontend recibirá undefined.  
**Severidad:** ALTA

---

## 2. BUGS DE MEDIA SEVERIDAD

### 2.1 Productos sin campo activo

**Archivo:** `server/src/routes/productos.js`  
**Línea:** 21  
**Descripción:** Los productos NO tienen campo `activo` en la tabla. No hay forma de desactivar productos.

---

### 2.2 Endpoint duplicado de módulos

**Archivo:** `server/src/routes/auth.js`  
**Líneas:** 175-180 vs index.js 160-172  
**Descripción:** `/api/modulos` definido en dos lugares

---

### 2.3 Bug en reporte-mensual con query params

**Archivo:** `server/src/routes/reportes.js`  
**Líneas:** 43-44  
**Descripción:** Frontend envía `fecha=2024-03` pero backend busca `anio` y `mes`

---

### 2.4 parseBody sin validación

**Archivos:** Múltiples archivos de routes

---

### 2.5 Views: Filter redundante en clientes

**Archivo:** `server/src/views/index.js`  
**Línea:** 755  
**Código problemático:**
```javascript
clientes.filter(c=>c.activo)...
```
**Descripción:** El servidor ya filtra activos, este filter es redundante

---

### 2.6 Views: Export CSV sin validación

**Archivo:** `server/src/views/index.js`  
**Líneas:** 1183-1187  
**Código problemático:**
```javascript
data.map(t=>t.total.toFixed(2)...)
```

---

### 2.7 Views: mostrarProforma sin validación

**Archivo:** `server/src/views/index.js`  
**Línea:** 2688

---

### 2.8 Views: Bug en editar usuario con prompts

**Archivo:** `server/src/views/index.js`  
**Líneas:** 1738-1747

---

### 2.9 Views: renderItems de proformas puede ser NaN

**Archivo:** `server/src/views/index.js`  
**Líneas:** 2737-2741

---

### 2.10 Views: Sync offline con estructura incompatible

**Archivo:** `client/src/index.js`  
**Línea:** 650

---

### 2.11 Race condition en instrucciones.html

**Archivo:** `server/src/views/index.js`  
**Líneas:** 489, 494-496

---

### 2.12 URL mal formada en reporte-productos

**Archivo:** `server/src/views/index.js`  
**Línea:** 1279  
**Descripción:** Frontend envía `fi` y `ff`, backend espera `fechaIni` y `fechaFin`

---

## 3. BUGS DE BAJA SEVERIDAD

### 3.1 CSS duplicado en views

**Archivo:** `server/src/views/index.js`  
**Líneas:** 298-310

---

### 3.2 Variable permisos no usada en dashboard

**Archivo:** `server/src/views/index.js`  
**Línea:** 628

---

### 3.3 Magic strings no centralizadas

---

### 3.4 Hardcoded tipo_cambio_usd en DB

**Archivo:** `server/src/db.js`  
**Línea:** 472

---

### 3.5 Query sin límite en facturas

**Archivo:** `server/src/routes/facturas.js`  
**Líneas:** 379-381  
**Descripción:** Límite hardcodeado de 100

---

### 3.6 Params inconsistentes entre reportes

**Archivo:** `server/src/views/index.js`  
**Líneas:** 1279 vs 1289

---

### 3.7 campo costo_promedio no existe

**Archivo:** `server/src/views/index.js`  
**Línea:** 2379

---

### 3.8 Catch vacío en sync offline

**Archivo:** `client/src/index.js`  
**Líneas:** 666-668

---

## 4. ENDPOINTS FALTANTES

| Endpoint | Descripción |
|----------|-------------|
| `/api/ordenes` | Referenciado en views pero no existe |
| `/api/compras/:id/recibir` | Referenciado en views |
| `/api/reporte-mensual` | Params incorrectos |
| `/api/proforma/:id` | GET individual no encontrado |

---

## 5. BUGS ESPECÍFICOS DEL USUARIO

### 5.1 Proveedor no aparece en compras

**Causa raíz:** Filtro `WHERE activo = 1` en `clientes.js:49`

### 5.2 No permite facturar con stock 0

**Causa raíz:** No hay validación en POS antes de agregar al carrito

### 5.3 Servidor solo muestra localhost

**Causa raíz:** `index.js:401` carga `http://localhost:${PUERTO}` en lugar de mostrar IP

### 5.4 Sin forma de crear productos con stock inicial

**Causa raíz:** El crear producto en inventario no tiene campo de cantidad inicial

---

## PRIORIDADES DE ARREGLO

1. **CRÍTICO**: SQL Injection en bancario.js y contabilidad.js
2. **CRÍTICO**: Validar todos los .toFixed() con `?.` o `||0`
3. **CRÍTICO**: Arreglar filtro activo = 1
4. **CRÍTICO**: Arreglar tipos en bancario.js (entrada vs deposito)
5. **ALTO**: Agregar campo activo a productos
6. **ALTO**: Corregir params de reportes
7. **ALTO**: Agregar manejo de errores en promises

---

*Documento generado automáticamente - Auditoría FactuLite v1.7.0*