const PDFDocument = require('pdfkit');

async function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { resolve({}); } });
    });
}

function generarNumeroCorrelativo(config, tipo) {
    const prefijo = tipo === 'factura' ? (config.prefijo_factura || 'F') : (config.prefijo_ticket || 'T');
    const digitos = config.digitos_correlativo || 10;
    const siguiente = tipo === 'factura' ? (config.numero_siguiente_factura || 1) : (config.numero_siguiente_ticket || 1);
    const numero = siguiente.toString().padStart(digitos, '0');
    return prefijo + numero;
}

function generarHTMLFactura(doc, items, config) {
    const fecha = new Date(doc.fecha).toLocaleString('es-NI');
    const fechaVence = doc.fecha_vencimiento ? new Date(doc.fecha_vencimiento).toLocaleDateString('es-NI') : 'N/A';
    const totalUSD = doc.tipo_cambio > 0 ? (doc.total / doc.tipo_cambio).toFixed(2) : '0.00';
    
    let subtotalGeneral = 0;
    let descuentoGeneral = 0;
    let impuestoGeneral = 0;
    
    const itemsHTML = items.map((i, idx) => {
        const base = i.cantidad * i.precio;
        const desc = base * ((i.descuento_pct || 0) / 100);
        const sub = base - desc;
        const imp = sub * ((i.impuesto_pct || 0) / 100);
        const total = sub + imp;
        
        subtotalGeneral += base;
        descuentoGeneral += desc;
        impuestoGeneral += imp;
        
        return `<tr>
            <td style="padding:8px;border:1px solid #ddd;text-align:center;">${idx + 1}</td>
            <td style="padding:8px;border:1px solid #ddd;">${i.codigo || '-'}</td>
            <td style="padding:8px;border:1px solid #ddd;">${i.nombre}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center;">${i.cantidad}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center;">${i.unidad || 'UN'}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right;">C$ ${i.precio.toFixed(2)}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center;">${(i.descuento_pct || 0).toFixed(1)}%</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center;">${(i.impuesto_pct || 0).toFixed(1)}%</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right;font-weight:600;">C$ ${total.toFixed(2)}</td>
        </tr>`;
    }).join('');
    
    return `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>Factura ${doc.numero}</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Segoe UI',sans-serif; padding:20px; max-width:210mm; margin:0 auto; background:#fff; }
.header { border-bottom:3px solid #183e6d; padding-bottom:15px; margin-bottom:20px; }
.header h1 { color:#183e6d; font-size:24px; margin-bottom:5px; }
.header p { font-size:12px; color:#666; margin:2px 0; }
.header .slogan { font-style:italic; color:#999; margin-top:5px; }
.doc-box { background:#183e6d; color:white; padding:15px; border-radius:8px; margin-bottom:20px; display:flex; justify-content:space-between; }
.doc-number { font-size:22px; font-weight:700; color:#f7ac0f; }
.info-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px; }
.info-item label { font-size:10px; color:#999; text-transform:uppercase; }
.info-item span { font-size:13px; color:#333; font-weight:500; }
table { width:100%; border-collapse:collapse; margin-bottom:20px; font-size:11px; }
th { background:#183e6d; color:white; padding:8px; text-align:left; }
td { border:1px solid #ddd; }
.totals { background:#f8f9fa; padding:15px; border-radius:8px; margin-left:auto; width:300px; }
.total-row { display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid #eee; }
.total-row.grand { font-size:18px; font-weight:700; color:#183e6d; border-top:2px solid #183e6d; margin-top:10px; padding-top:10px; }
.footer { margin-top:30px; text-align:center; font-size:11px; color:#666; }
.footer .balance { font-weight:600; color:#183e6d; margin-top:10px; }
@media print { body { padding:10px; } }
</style>
</head>
<body>
<div class="header">
    <div>
        <h1>${config.nombre || 'Mi Empresa'}</h1>
        <p>RUC: ${config.ruc || 'N/A'}</p>
        <p>${config.direccion || ''}</p>
        <p>Tel: ${config.telefono || 'N/A'}</p>
        <p class="slogan">${doc.slogan || config.slogan || ''}</p>
    </div>
</div>

<div class="doc-box">
    <div>
        <div style="font-size:12px;opacity:0.8;">FACTURA</div>
        <div class="doc-number">${doc.numero}</div>
    </div>
    <div style="text-align:right;">
        <div style="font-size:11px;">Emisión: ${fecha}</div>
        <div style="font-size:11px;">Vence: ${fechaVence}</div>
    </div>
</div>

<div class="info-grid">
    <div class="info-item"><label>Vendedor</label><span>${doc.vendedor_nombre || doc.usuario || '-'}</span></div>
    <div class="info-item"><label>Términos</label><span>${doc.terminos || 'Contado'}</span></div>
    <div class="info-item"><label>Cliente</label><span>${doc.cliente_nombre || 'Público General'}</span></div>
    <div class="info-item"><label>RUC/Cédula</label><span>${doc.cliente_ruc || '-'}</span></div>
    <div class="info-item"><label>Ref. Cliente</label><span>${doc.ref_cliente || '-'}</span></div>
    <div class="info-item"><label>Comprobante</label><span>${doc.comprobante || '-'}</span></div>
</div>

<table>
    <thead>
        <tr>
            <th style="width:30px;">Línea</th>
            <th style="width:80px;">Código</th>
            <th>Descripción</th>
            <th style="width:50px;">Cant.</th>
            <th style="width:40px;">Unid.</th>
            <th style="width:80px;">Precio C$</th>
            <th style="width:50px;">Dscto%</th>
            <th style="width:50px;">Impto%</th>
            <th style="width:90px;">Subtotal C$</th>
        </tr>
    </thead>
    <tbody>${itemsHTML}</tbody>
</table>

<div class="totals">
    <div class="total-row"><span>Subtotal:</span><span>C$ ${subtotalGeneral.toFixed(2)}</span></div>
    <div class="total-row"><span>Descuento:</span><span>C$ ${descuentoGeneral.toFixed(2)}</span></div>
    <div class="total-row"><span>Misceláneos:</span><span>C$ ${(doc.miscelaneos || 0).toFixed(2)}</span></div>
    <div class="total-row"><span>Impuesto:</span><span>C$ ${impuestoGeneral.toFixed(2)}</span></div>
    <div class="total-row grand"><span>TOTAL C$:</span><span>C$ ${doc.total.toFixed(2)}</span></div>
    <div class="total-row" style="font-size:12px;color:#666;"><span>Total US$:</span><span>$${totalUSD}</span></div>
    <div style="font-size:10px;color:#999;margin-top:5px;">Tipo de cambio: 1 US$ = C$ ${doc.tipo_cambio || 1}</div>
</div>

<div class="footer">
    <p class="balance">Balance: C$ ${doc.terminos === 'Crédito' ? doc.total.toFixed(2) : '0.00'}</p>
    <p style="margin-top:15px;">${config.nombre || 'Mi Empresa'} - ${config.direccion || ''}</p>
    <p>${config.telefono || ''}</p>
</div>
</body></html>`;
}

function generarHTMLTicket(doc, items, config) {
    const fecha = new Date(doc.fecha).toLocaleString('es-NI');
    const width = '280px';
    
    let subtotal = 0;
    const itemsHTML = items.map(i => {
        subtotal += i.cantidad * i.precio;
        let html = `<div style="display:flex;justify-content:space-between;margin:4px 0;">
            <span>${i.cantidad} ${i.unidad || 'UN'}</span>
            <span style="flex:1;margin-left:8px;">${i.nombre}</span>
            <span>C$ ${(i.cantidad * i.precio).toFixed(2)}</span>
        </div>`;
        if (i.codigo_producto || i.codigo) {
            html += `<div style="font-size:10px;color:#666;margin-left:30px;">Cod: ${i.codigo_producto || i.codigo}</div>`;
        }
        return html;
    }).join('');
    
    return `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>Ticket ${doc.numero}</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Courier New',monospace; font-size:12px; background:#fff; }
.ticket { width:${width}; margin:0 auto; padding:10px; }
.center { text-align:center; }
.slogan { font-style:italic; font-size:10px; color:#666; margin-bottom:8px; }
.header { border-bottom:1px dashed #000; padding-bottom:8px; margin-bottom:8px; }
.num { font-size:14px; font-weight:700; }
.sep { border-top:1px dashed #000; margin:8px 0; }
.total { font-size:16px; font-weight:700; }
.footer { font-size:10px; color:#666; margin-top:10px; }
</style>
</head>
<body>
<div class="ticket">
    <div class="center header">
        <div class="slogan">${doc.slogan || config.slogan || ''}</div>
        <div class="num">TICKET: ${doc.numero}</div>
        <div>${fecha}</div>
    </div>
    
    <div style="margin-bottom:8px;">
        <div>Términos: ${doc.terminos || 'Contado'}</div>
        <div>VENDEDOR: ${(doc.vendedor_nombre || doc.usuario || '-').toUpperCase()}</div>
        ${doc.cliente_nombre ? `<div>Cliente: ${doc.cliente_nombre}</div>` : ''}
        ${doc.cliente_direccion ? `<div>Dir: ${doc.cliente_direccion}</div>` : ''}
    </div>
    
    <div class="sep"></div>
    
    <div style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:4px;">
        <span>CANT</span>
        <span>DESCRIPCION</span>
        <span>TOTAL C$</span>
    </div>
    
    ${itemsHTML}
    
    <div class="sep"></div>
    
    <div style="display:flex;justify-content:space-between;">
        <span>Subtotal:</span>
        <span>C$ ${subtotal.toFixed(2)}</span>
    </div>
    <div style="display:flex;justify-content:space-between;">
        <span>Descuento:</span>
        <span>C$ ${(doc.descuento || 0).toFixed(2)}</span>
    </div>
    <div class="total" style="display:flex;justify-content:space-between;margin-top:8px;">
        <span>TOTAL C$:</span>
        <span>C$ ${doc.total.toFixed(2)}</span>
    </div>
    
    <div class="footer center">
        <div>${config.nombre || 'Mi Empresa'}</div>
        <div>${config.direccion || ''}</div>
        <div>${config.telefono || ''}</div>
    </div>
</div>
<script>window.onload = function() { window.print(); }</script>
</body></html>`;
}

module.exports = async function(req, res, url, metodo, context) {
    const { dbSQLite, CONFIG, db } = context || {};
    const sdb = dbSQLite.getDB();
    
    if (metodo === 'POST' && url === '/api/factura') {
        const data = await parseBody(req);
        const config = dbSQLite.getConfigEmpresa ? dbSQLite.getConfigEmpresa() : sdb.prepare('SELECT * FROM config_empresa WHERE id = 1').get();
        
        let numero;
        if (data.numero_manual) {
            numero = data.numero_manual;
        } else {
            numero = generarNumeroCorrelativo(config, 'factura');
            sdb.prepare('UPDATE config_empresa SET numero_siguiente_factura = numero_siguiente_factura + 1 WHERE id = 1').run();
        }
        
        const esCredito = data.terminos === 'Credito' || data.terminos === 'Crédito';
        const fechaVencimiento = data.fecha_vencimiento || (esCredito ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null);
        const tipoCambio = data.tipo_cambio || config?.tipo_cambio_usd || 1;
        
        let subtotal = 0, descuentoTotal = 0, impuestoTotal = 0;
        for (const item of data.items) {
            const base = item.cantidad * item.precio;
            const desc = base * ((item.descuento_pct || 0) / 100);
            const sub = base - desc;
            const imp = sub * ((item.impuesto_pct || 0) / 100);
            subtotal += base;
            descuentoTotal += desc;
            impuestoTotal += imp;
        }
        
        const stmtF = sdb.prepare(`INSERT INTO facturas 
            (numero, cliente_id, cliente_nombre, cliente_ruc, cliente_direccion, subtotal, descuento, impuesto, 
             total, metodo, estado, usuario, terminos, tipo_cliente, fecha, fecha_vencimiento, ref_cliente, 
             comprobante, miscelaneos, incluye_impuesto, tipo_cambio, slogan, vendedor_nombre)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,?,?,?,?,?,?,?,?)`);
        const resultF = stmtF.run(
            numero, 
            data.cliente_id || null, 
            data.cliente_nombre || 'Público General',
            data.cliente_ruc || '', 
            data.cliente_direccion || '',
            subtotal, 
            descuentoTotal, 
            impuestoTotal,
            data.total, 
            data.metodo || 'efectivo', 
            'activa', 
            data.usuario, 
            data.terminos || 'Contado', 
            data.tipo_cliente || 'publico',
            fechaVencimiento,
            data.ref_cliente || '',
            data.comprobante || '',
            data.miscelaneos || 0,
            data.incluye_impuesto ? 1 : 0,
            tipoCambio,
            data.slogan || config?.slogan || '',
            data.vendedor_nombre || data.usuario || ''
        );
        const facturaId = resultF.lastInsertRowid;
        
        const stmtItem = sdb.prepare(`INSERT INTO factura_items 
            (factura_id, producto_id, codigo, nombre, cantidad, precio, subtotal, total, unidad, descuento_pct, impuesto_pct, precio_usd)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`);
        const stmtStock = sdb.prepare(`UPDATE productos SET cantidad = cantidad - ? WHERE id = ?`);
        
        for (const item of data.items) {
            const base = item.cantidad * item.precio;
            const desc = base * ((item.descuento_pct || 0) / 100);
            const sub = base - desc;
            const imp = sub * ((item.impuesto_pct || 0) / 100);
            const total = sub + imp;
            const precioUsd = tipoCambio > 0 ? item.precio / tipoCambio : 0;
            
            stmtItem.run(
                facturaId, item.id, item.codigo_barra || item.codigo || '', item.nombre, 
                item.cantidad, item.precio, sub, total,
                item.unidad || 'UN', item.descuento_pct || 0, item.impuesto_pct || 0, precioUsd
            );
            if (item.id) stmtStock.run(item.cantidad, item.id);
        }
        
        if (esCredito && data.cliente_id) {
            sdb.prepare(`INSERT INTO cuentas_cobrar 
                (cliente_id, cliente_nombre, documento, monto_original, monto_actual, fecha_vencimiento)
                VALUES (?,?,?,?,?,?)`).run(
                data.cliente_id, 
                data.cliente_nombre, 
                numero, 
                data.total, 
                data.total, 
                fechaVencimiento
            );
        }
        
        res.writeHead(200); res.end(JSON.stringify({ numero, id: facturaId }));
        return true;
    }
    
    if (metodo === 'POST' && url === '/api/ticket') {
        const data = await parseBody(req);
        const config = dbSQLite.getConfigEmpresa ? dbSQLite.getConfigEmpresa() : sdb.prepare('SELECT * FROM config_empresa WHERE id = 1').get();
        
        let numero;
        if (data.numero_manual) {
            numero = data.numero_manual;
        } else {
            numero = generarNumeroCorrelativo(config, 'ticket');
            sdb.prepare('UPDATE config_empresa SET numero_siguiente_ticket = numero_siguiente_ticket + 1 WHERE id = 1').run();
        }
        
        const stmtT = sdb.prepare(`INSERT INTO tickets 
            (numero, subtotal, descuento, total, metodo, usuario, fecha, vendedor_nombre, cliente_nombre, cliente_direccion, slogan)
            VALUES (?,?,?,?,?,?,CURRENT_TIMESTAMP,?,?,?,?)`);
        const resultT = stmtT.run(
            numero,
            data.subtotal || data.total,
            data.descuento || 0,
            data.total,
            data.metodo || 'efectivo',
            data.usuario,
            data.vendedor_nombre || data.usuario || '',
            data.cliente_nombre || '',
            data.cliente_direccion || '',
            data.slogan || config?.slogan || ''
        );
        const ticketId = resultT.lastInsertRowid;
        
        const stmtItem = sdb.prepare(`INSERT INTO ticket_items 
            (ticket_id, producto_id, codigo, nombre, cantidad, precio, subtotal, total, unidad, codigo_producto)
            VALUES (?,?,?,?,?,?,?,?,?,?)`);
        const stmtStock = sdb.prepare(`UPDATE productos SET cantidad = cantidad - ? WHERE id = ?`);
        
        for (const item of data.items) {
            const total = item.cantidad * item.precio;
            stmtItem.run(
                ticketId, item.id, item.codigo_barra || item.codigo || '', item.nombre, 
                item.cantidad, item.precio, total, total,
                item.unidad || 'UN', item.codigo_producto || item.codigo_barra || ''
            );
            if (item.id) stmtStock.run(item.cantidad, item.id);
        }
        
        res.writeHead(200); res.end(JSON.stringify({ numero, id: ticketId }));
        return true;
    }
    
    if (metodo === 'GET' && url === '/api/facturas') {
        const facturas = sdb.prepare(`SELECT *, 'factura' as tipo FROM facturas ORDER BY fecha DESC LIMIT 100`).all();
        const tickets = sdb.prepare(`SELECT *, 'ticket' as tipo FROM tickets ORDER BY fecha DESC LIMIT 100`).all();
        const todas = [...facturas, ...tickets];
        todas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        res.writeHead(200); res.end(JSON.stringify(todas));
        return true;
    }
    
    const imprimirMatch = url.match(/^\/api\/imprimir\/(factura|ticket)\/(\d+)$/);
    if (metodo === 'GET' && imprimirMatch) {
        const tipo = imprimirMatch[1];
        const id = parseInt(imprimirMatch[2]);
        const config = dbSQLite.getConfigEmpresa ? dbSQLite.getConfigEmpresa() : sdb.prepare('SELECT * FROM config_empresa WHERE id = 1').get();
        let doc, items;
        if (tipo === 'factura') {
            doc = sdb.prepare('SELECT * FROM facturas WHERE id = ?').get(id);
            if (doc) items = sdb.prepare('SELECT * FROM factura_items WHERE factura_id = ?').all(id);
        } else {
            doc = sdb.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
            if (doc) items = sdb.prepare('SELECT * FROM ticket_items WHERE ticket_id = ?').all(id);
        }
        if (doc) {
            const html = tipo === 'factura' 
                ? generarHTMLFactura(doc, items || [], config)
                : generarHTMLTicket(doc, items || [], config);
            res.setHeader('Content-Type', 'text/html');
            res.writeHead(200); res.end(html);
        } else {
            res.writeHead(404); res.end('No encontrado');
        }
        return true;
    }
    
    const anularMatch = url.match(/^\/api\/anular\/(factura|ticket)\/(\d+)$/);
    if (metodo === 'POST' && anularMatch) {
        const tipo = anularMatch[1];
        const id = parseInt(anularMatch[2]);
        let doc;
        if (tipo === 'factura') {
            doc = sdb.prepare('SELECT * FROM facturas WHERE id = ?').get(id);
        } else {
            doc = sdb.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
        }
        if (!doc) { res.writeHead(404); res.end(JSON.stringify({ error: 'Documento no encontrado' })); return true; }
        if (doc.estado === 'anulada') { res.writeHead(400); res.end(JSON.stringify({ error: 'Ya está anulada' })); return true; }
        
        let items;
        if (tipo === 'factura') {
            items = sdb.prepare('SELECT producto_id, cantidad FROM factura_items WHERE factura_id = ?').all(id);
        } else {
            items = sdb.prepare('SELECT producto_id, cantidad FROM ticket_items WHERE ticket_id = ?').all(id);
        }
        const stmtStock = sdb.prepare('UPDATE productos SET cantidad = cantidad + ? WHERE id = ?');
        items.forEach(i => { if (i.producto_id) stmtStock.run(i.cantidad, i.producto_id); });
        
        if (tipo === 'factura') {
            sdb.prepare(`UPDATE facturas SET estado = 'anulada', fecha_anulacion = CURRENT_TIMESTAMP WHERE id = ?`).run(id);
            sdb.prepare(`UPDATE cuentas_cobrar SET monto_actual = 0, estado = 'anulada' WHERE documento = ?`).run(doc.numero);
        } else {
            sdb.prepare(`UPDATE tickets SET estado = 'anulada', fecha_anulacion = CURRENT_TIMESTAMP WHERE id = ?`).run(id);
        }
        res.writeHead(200); res.end(JSON.stringify({ ok: true, mensaje: 'Documento anulado y stock revertido' }));
        return true;
    }
    
    if (metodo === 'POST' && url === '/api/devolucion') {
        const data = await parseBody(req);
        const tipo = data.tipo;
        const docId = data.doc_id;
        
        let doc;
        if (tipo === 'factura') {
            doc = sdb.prepare('SELECT * FROM facturas WHERE id = ?').get(docId);
        } else {
            doc = sdb.prepare('SELECT * FROM tickets WHERE id = ?').get(docId);
        }
        
        if (!doc) {
            res.writeHead(404); res.end(JSON.stringify({ error: 'Documento no encontrado' }));
            return true;
        }
        
        const config = dbSQLite.getConfigEmpresa ? dbSQLite.getConfigEmpresa() : sdb.prepare('SELECT * FROM config_empresa WHERE id = 1').get();
        const numDevolucion = 'DEV' + Date.now().toString().slice(-8);
        
        let totalDevolucion = 0;
        const itemsDevolucion = [];
        
        for (const item of data.items) {
            const subtotal = item.cantidad * item.precio;
            totalDevolucion += subtotal;
            itemsDevolucion.push({ ...item, subtotal });
            
            if (item.producto_id) {
                sdb.prepare('UPDATE productos SET cantidad = cantidad + ? WHERE id = ?').run(item.cantidad, item.producto_id);
            }
        }
        
        const resultDev = sdb.prepare(`INSERT INTO devoluciones (factura_id, ticket_id, numero, motivo, total, usuario)
            VALUES (?,?,?,?,?,?)`).run(
                tipo === 'factura' ? docId : null,
                tipo === 'ticket' ? docId : null,
                numDevolucion,
                data.motivo || '',
                totalDevolucion,
                data.usuario || 'sistema'
            );
        const devolucionId = resultDev.lastInsertRowid;
        
        const stmtItemDev = sdb.prepare(`INSERT INTO devolucion_items (devolucion_id, producto_id, nombre, cantidad, precio, subtotal)
            VALUES (?,?,?,?,?,?)`);
        for (const item of itemsDevolucion) {
            stmtItemDev.run(devolucionId, item.producto_id || null, item.nombre, item.cantidad, item.precio, item.subtotal);
        }
        
        if (tipo === 'factura' && doc.terminos === 'Crédito') {
            sdb.prepare(`UPDATE cuentas_cobrar SET monto_actual = monto_actual - ? WHERE documento = ?`).run(totalDevolucion, doc.numero);
        }
        
        res.writeHead(200); res.end(JSON.stringify({ id: devolucionId, numero: numDevolucion, total: totalDevolucion }));
        return true;
    }
    
    if (metodo === 'GET' && url === '/api/devoluciones') {
        const devoluciones = sdb.prepare('SELECT * FROM devoluciones ORDER BY fecha DESC LIMIT 50').all();
        for (const dev of devoluciones) {
            dev.items = sdb.prepare('SELECT * FROM devolucion_items WHERE devolucion_id = ?').all(dev.id);
        }
        res.writeHead(200); res.end(JSON.stringify(devoluciones));
        return true;
    }
    
    if (metodo === 'GET' && url === '/api/siguiente-factura') {
        const config = dbSQLite.getConfigEmpresa ? dbSQLite.getConfigEmpresa() : sdb.prepare('SELECT * FROM config_empresa WHERE id = 1').get();
        const numero = generarNumeroCorrelativo(config, 'factura');
        res.writeHead(200); res.end(JSON.stringify({ numero, siguiente: config?.numero_siguiente_factura || 1 }));
        return true;
    }
    
    if (metodo === 'GET' && url === '/api/siguiente-ticket') {
        const config = dbSQLite.getConfigEmpresa ? dbSQLite.getConfigEmpresa() : sdb.prepare('SELECT * FROM config_empresa WHERE id = 1').get();
        const numero = generarNumeroCorrelativo(config, 'ticket');
        res.writeHead(200); res.end(JSON.stringify({ numero, siguiente: config?.numero_siguiente_ticket || 1 }));
        return true;
    }
    
    if (metodo === 'POST' && url === '/api/factura-lote') {
        const data = await parseBody(req);
        const config = dbSQLite.getConfigEmpresa ? dbSQLite.getConfigEmpresa() : sdb.prepare('SELECT * FROM config_empresa WHERE id = 1').get();
        const grupo = 'LOTE' + Date.now().toString().slice(-8);
        const facturasCreadas = [];
        
        for (const cliente of data.clientes) {
            let numero = generarNumeroCorrelativo(config, 'factura');
            sdb.prepare('UPDATE config_empresa SET numero_siguiente_factura = numero_siguiente_factura + 1 WHERE id = 1').run();
            
            let subtotal = 0;
            for (const item of data.items) {
                subtotal += item.cantidad * item.precio;
            }
            
            const stmtF = sdb.prepare(`INSERT INTO facturas 
                (numero, cliente_nombre, cliente_ruc, cliente_direccion, subtotal, descuento, impuesto, total, metodo, estado, usuario, terminos, fecha, grupo_facturacion)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,'Contado',CURRENT_TIMESTAMP,?)`);
            const resultF = stmtF.run(
                numero, 
                cliente.nombre || 'Cliente',
                cliente.ruc || '',
                cliente.direccion || '',
                subtotal,
                0, 0,
                subtotal,
                'efectivo',
                'activa',
                data.usuario || 'sistema',
                grupo
            );
            
            const facturaId = resultF.lastInsertRowid;
            const stmtItem = sdb.prepare(`INSERT INTO factura_items (factura_id, producto_id, nombre, cantidad, precio, subtotal, total) VALUES (?,?,?,?,?,?,?)`);
            const stmtStock = sdb.prepare(`UPDATE productos SET cantidad = cantidad - ? WHERE id = ?`);
            
            for (const item of data.items) {
                const total = item.cantidad * item.precio;
                stmtItem.run(facturaId, item.id || null, item.nombre, item.cantidad, item.precio, total, total);
                if (item.id) stmtStock.run(item.cantidad, item.id);
            }
            
            facturasCreadas.push({ numero, cliente: cliente.nombre, total: subtotal });
        }
        
        res.writeHead(200); res.end(JSON.stringify({ grupo, cantidad: facturasCreadas.length, facturas: facturasCreadas }));
        return true;
    }
    
    if (metodo === 'PUT' && url === '/api/factura') {
        const data = await parseBody(req);
        if (!data.id) {
            res.writeHead(400); res.end(JSON.stringify({ error: 'ID requerido' }));
            return true;
        }
        
        const factura = sdb.prepare('SELECT * FROM facturas WHERE id = ?').get(data.id);
        if (!factura) {
            res.writeHead(404); res.end(JSON.stringify({ error: 'Factura no encontrada' }));
            return true;
        }
        
        if (factura.estado === 'anulada') {
            res.writeHead(400); res.end(JSON.stringify({ error: 'No se puede modificar una factura anulada' }));
            return true;
        }
        
        const fields = [];
        const values = [];
        
        if (data.cliente_nombre !== undefined) { fields.push('cliente_nombre = ?'); values.push(data.cliente_nombre); }
        if (data.cliente_ruc !== undefined) { fields.push('cliente_ruc = ?'); values.push(data.cliente_ruc); }
        if (data.cliente_direccion !== undefined) { fields.push('cliente_direccion = ?'); values.push(data.cliente_direccion); }
        if (data.terminos !== undefined) { fields.push('terminos = ?'); values.push(data.terminos); }
        if (data.fecha_vencimiento !== undefined) { fields.push('fecha_vencimiento = ?'); values.push(data.fecha_vencimiento); }
        if (data.ref_cliente !== undefined) { fields.push('ref_cliente = ?'); values.push(data.ref_cliente); }
        if (data.comprobante !== undefined) { fields.push('comprobante = ?'); values.push(data.comprobante); }
        if (data.observaciones !== undefined) { fields.push('slogan = ?'); values.push(data.observaciones); }
        
        if (fields.length > 0) {
            values.push(data.id);
            sdb.prepare(`UPDATE facturas SET ${fields.join(', ')} WHERE id = ?`).run(...values);
        }
        
        const updated = sdb.prepare('SELECT * FROM facturas WHERE id = ?').get(data.id);
        res.writeHead(200); res.end(JSON.stringify({ ok: true, factura: updated }));
        return true;
    }
    
    if (metodo === 'PUT' && url === '/api/ticket') {
        const data = await parseBody(req);
        if (!data.id) {
            res.writeHead(400); res.end(JSON.stringify({ error: 'ID requerido' }));
            return true;
        }
        
        const ticket = sdb.prepare('SELECT * FROM tickets WHERE id = ?').get(data.id);
        if (!ticket) {
            res.writeHead(404); res.end(JSON.stringify({ error: 'Ticket no encontrado' }));
            return true;
        }
        
        if (ticket.estado === 'anulado') {
            res.writeHead(400); res.end(JSON.stringify({ error: 'No se puede modificar un ticket anulado' }));
            return true;
        }
        
        const fields = [];
        const values = [];
        
        if (data.cliente_nombre !== undefined) { fields.push('cliente_nombre = ?'); values.push(data.cliente_nombre); }
        if (data.observaciones !== undefined) { fields.push('observaciones = ?'); values.push(data.observaciones); }
        
        if (fields.length > 0) {
            values.push(data.id);
            sdb.prepare(`UPDATE tickets SET ${fields.join(', ')} WHERE id = ?`).run(...values);
        }
        
        const updated = sdb.prepare('SELECT * FROM tickets WHERE id = ?').get(data.id);
        res.writeHead(200); res.end(JSON.stringify({ ok: true, ticket: updated }));
        return true;
    }
    
    return false;
};
