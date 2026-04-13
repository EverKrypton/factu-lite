# Fix: Descuento no se muestra en Facturas y Tickets

**Archivo:** `server/src/routes/facturas.js`  
**Funciones afectadas:** `generarHTMLFactura()` y `generarHTMLTicket()`

---

## Problema A — Factura: columna descuento no aparece en la tabla de ítems

La función `generarHTMLFactura()` calcula el descuento por ítem pero no lo muestra en la tabla impresa. Faltan dos columnas: `Precio C$` y `Dscto%`.

### Fix: reemplazar el bloque `itemsHTML` y la cabecera de la tabla

```javascript
// Reemplazar el mapeo de items dentro de generarHTMLFactura():
const itemsHTML = items.map((item, idx) => {
    const precio = parseFloat(item.precio) || 0;
    const cantidad = parseInt(item.cantidad) || 0;
    const descPct = parseFloat(item.descuento_pct) || 0;
    const base = cantidad * precio;
    const desc = base * descPct / 100;
    const sub = base - desc;
    subtotal += base;
    descuentoTotal += desc;
    return `<tr>
        <td style="padding:5px 8px;border:1px solid #ccc;text-align:center;">${idx + 1}</td>
        <td style="padding:5px 8px;border:1px solid #ccc;font-size:11px;">${item.codigo || item.codigo_barra || '-'}</td>
        <td style="padding:5px 8px;border:1px solid #ccc;">${item.nombre}</td>
        <td style="padding:5px 8px;border:1px solid #ccc;text-align:center;">${doc.ref_cliente || '-'}</td>
        <td style="padding:5px 8px;border:1px solid #ccc;text-align:center;">${cantidad}.00</td>
        <td style="padding:5px 8px;border:1px solid #ccc;text-align:center;">${item.unidad || 'UN'}</td>
        <td style="padding:5px 8px;border:1px solid #ccc;text-align:right;">${fmt(precio)}</td>
        <td style="padding:5px 8px;border:1px solid #ccc;text-align:center;${descPct > 0 ? 'color:#c00;font-weight:700;' : ''}">${descPct > 0 ? descPct.toFixed(1) + '%' : '-'}</td>
        <td style="padding:5px 8px;border:1px solid #ccc;text-align:right;font-weight:600;">${fmt(sub)}</td>
    </tr>`;
}).join('');
```

### Fix: reemplazar la cabecera `<thead>` de la tabla de ítems

```html
<thead>
  <tr>
    <th style="width:30px;">Item</th>
    <th style="width:100px;">Cód. Producto</th>
    <th>Descripción Producto</th>
    <th style="width:40px;">Ref.</th>
    <th style="width:50px;">Cant.</th>
    <th style="width:35px;">Un</th>
    <th style="width:75px;text-align:right;">Precio C$</th>
    <th style="width:55px;text-align:center;">Dscto%</th>
    <th style="width:90px;text-align:right;">Subtotal C$</th>
  </tr>
</thead>
```

### Fix: asegurarse que la tabla de totales muestra el descuento correctamente

```html
<!-- Reemplazar el bloque <table class="totales"> en generarHTMLFactura(): -->
<table class="totales">
  <tr><td>Subtotal</td><td>C$ ${fmt(subtotal)}</td></tr>
  <tr><td>Dsct. por ítem</td><td style="${descuentoTotal > 0 ? 'color:#c00;' : ''}">C$ ${fmt(descuentoTotal)}</td></tr>
  <tr><td>Dsct. Global</td><td style="${(parseFloat(doc.descuento)||0) > 0 ? 'color:#c00;' : ''}">C$ ${fmt(parseFloat(doc.descuento) || 0)}</td></tr>
  <tr><td>Misceláneos</td><td>C$ ${fmt(doc.miscelaneos)}</td></tr>
  <tr class="grand-total"><td>TOTAL</td><td>C$ ${fmt(totalGeneral)}</td></tr>
  ${tipoCambio > 1 ? `<tr style="font-size:10px;color:#666;"><td>Total US$</td><td>$ ${fmt(totalUSD)}</td></tr>` : ''}
</table>
```

---

## Problema B — Ticket: descuento global del POS no se muestra al imprimir

El POS envía `descuento: descuentoGlobal` al endpoint `/api/ticket` y se guarda en la columna `descuento` de la tabla `tickets`. La función `generarHTMLTicket()` lo lee de `doc.descuento` — el campo existe, pero el HTML generado nunca lo mostraba visualmente de forma clara cuando era mayor que cero.

### Fix: reemplazar el bloque de totales en `generarHTMLTicket()`

```javascript
// Dentro de generarHTMLTicket(), reemplazar el bloque de totales:
const descuento = parseFloat(doc.descuento) || 0;
const total = parseFloat(doc.total) || (subtotal - descuento);

// Reemplazar la tabla de totales en el HTML retornado:
const totalesHTML = `
<table>
  <tr>
    <td>Subtotal:</td>
    <td style="text-align:right;">C$ ${fmt(subtotal)}</td>
  </tr>
  ${descuento > 0 ? `
  <tr style="color:#c00;">
    <td>Descuento:</td>
    <td style="text-align:right;">- C$ ${fmt(descuento)}</td>
  </tr>` : ''}
  <tr class="total-row">
    <td><strong>TOTAL:</strong></td>
    <td style="text-align:right;"><strong>C$ ${fmt(total)}</strong></td>
  </tr>
</table>`;
```

Y usar `${totalesHTML}` en el HTML retornado en lugar del bloque hardcodeado anterior.

---

## Problema C — POS: descuento por ítem no se guarda en `ticket_items`

Los ítems del carrito en el POS pueden tener `descuento_pct` por ítem (campo `c.descuento_pct`), pero en el handler `POST /api/ticket` de `facturas.js`, el INSERT de `ticket_items` no guarda ese descuento — ni existe la columna en la tabla.

### Fix en `server/src/db.js` — agregar columna a `ticket_items` en la migración

```javascript
// Dentro del bloque de migraciones en crearTablas(), agregar:
const ticketItemsCols = db.prepare("PRAGMA table_info(ticket_items)").all();
if (!ticketItemsCols.find(c => c.name === 'descuento_pct')) {
    db.prepare('ALTER TABLE ticket_items ADD COLUMN descuento_pct REAL DEFAULT 0').run();
}
```

### Fix en `server/src/routes/facturas.js` — guardar `descuento_pct` en el INSERT de ticket_items

```javascript
// Dentro del handler POST /api/ticket, reemplazar el stmtItem y su uso:
const stmtItem = sdb.prepare(`INSERT INTO ticket_items 
    (ticket_id, producto_id, codigo, nombre, cantidad, precio, subtotal, total, unidad, codigo_producto, descuento_pct)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`);

for (const item of data.items) {
    const precio = parseFloat(item.precio) || 0;
    const cantidad = parseInt(item.cantidad) || 0;
    const descPct = parseFloat(item.descuento_pct) || 0;
    const precioConDesc = precio * (1 - descPct / 100);
    const total = cantidad * precioConDesc;
    stmtItem.run(
        ticketId,
        item.id,
        item.codigo_barra || item.codigo || '',
        item.nombre,
        cantidad,
        precio,
        total,
        total,
        item.unidad || 'UN',
        item.codigo_producto || item.codigo_barra || '',
        descPct
    );
    if (item.id) stmtStock.run(cantidad, item.id);
}
```

### Fix en `generarHTMLTicket()` — mostrar precio original tachado cuando hay descuento por ítem

```javascript
// Reemplazar el mapeo de items dentro de generarHTMLTicket():
let subtotal = 0;
const itemsHTML = items.map(i => {
    const precio = parseFloat(i.precio) || 0;
    const cant = parseInt(i.cantidad) || 0;
    const descPct = parseFloat(i.descuento_pct) || 0;
    const precioFinal = precio * (1 - descPct / 100);
    const total = cant * precioFinal;
    subtotal += total;

    const precioLinea = descPct > 0
        ? `<span style="text-decoration:line-through;color:#999;font-size:9px;">C$${fmt(precio)}</span> C$${fmt(precioFinal)}`
        : `C$${fmt(precio)}`;

    return `<tr>
        <td style="padding:2px 4px;vertical-align:top;">${cant}</td>
        <td style="padding:2px 4px;max-width:150px;word-break:break-word;vertical-align:top;">
            ${i.nombre}
            ${descPct > 0 ? `<span style="color:#c00;font-size:9px;"> (-${descPct.toFixed(0)}%)</span>` : ''}
        </td>
        <td style="padding:2px 4px;text-align:right;vertical-align:top;">
            ${precioLinea}<br>
            <strong>C$${fmt(total)}</strong>
        </td>
    </tr>
    ${i.codigo || i.codigo_barra ? `<tr><td></td><td colspan="2" style="font-size:9px;color:#666;padding:0 4px;">${i.codigo || i.codigo_barra}</td></tr>` : ''}`;
}).join('');
```

---

## Resumen de archivos modificados

| Archivo | Cambio |
|---|---|
| `server/src/routes/facturas.js` | `generarHTMLFactura()`: cabecera + columnas Precio y Dscto% en tabla ítems |
| `server/src/routes/facturas.js` | `generarHTMLFactura()`: tabla de totales muestra descuento por ítem y global separados |
| `server/src/routes/facturas.js` | `generarHTMLTicket()`: totales muestran descuento global, ítems muestran precio tachado |
| `server/src/routes/facturas.js` | Handler `POST /api/ticket`: guarda `descuento_pct` en `ticket_items` |
| `server/src/db.js` | Migración: agrega columna `descuento_pct` a `ticket_items` si no existe |
