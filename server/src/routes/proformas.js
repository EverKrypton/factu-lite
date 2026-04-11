async function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { resolve({}); } });
    });
}

function extractId(url) {
    const parts = url.split('/');
    const id = parts[3];
    return id && !isNaN(id) ? parseInt(id) : null;
}

module.exports = async function(req, res, url, metodo, context) {
    const sdb = context.dbSQLite.getDB();
    
    if (metodo === 'GET' && url === '/api/proformas') {
        const proformas = sdb.prepare(`SELECT * FROM proformas ORDER BY fecha DESC LIMIT 100`).all();
        res.writeHead(200); res.end(JSON.stringify(proformas));
        return true;
    }
    
    if (metodo === 'POST' && url === '/api/proforma') {
        const data = await parseBody(req);
        const count = sdb.prepare('SELECT COUNT(*) as c FROM proformas').get().c;
        const numero = 'PRO' + String(count + 1).padStart(6, '0');
        const fechaVencimiento = new Date(Date.now() + (data.validez || 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const stmt = sdb.prepare(`INSERT INTO proformas (numero, cliente_id, cliente_nombre, cliente_ruc, subtotal, descuento, impuesto, total, validez, estado, observaciones, usuario, fecha_vencimiento)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`);
        const result = stmt.run(numero, data.cliente_id || null, data.cliente_nombre || '', data.cliente_ruc || '', data.subtotal || 0, data.descuento || 0, data.impuesto || 0, data.total || 0, data.validez || 30, 'pendiente', data.observaciones || '', data.usuario || 'sistema', fechaVencimiento);
        const proformaId = result.lastInsertRowid;
        
        for (const item of (data.items || [])) {
            sdb.prepare('INSERT INTO proforma_items (proforma_id, producto_id, codigo, nombre, cantidad, precio, subtotal) VALUES (?,?,?,?,?,?,?)').run(proformaId, item.producto_id || null, item.codigo || '', item.nombre, item.cantidad, item.precio, item.cantidad * item.precio);
        }
        
        res.writeHead(200); res.end(JSON.stringify({ id: proformaId, numero }));
        return true;
    }
    
    if (metodo === 'GET' && url.startsWith('/api/proforma/') && !url.includes('/convertir')) {
        const id = extractId(url);
        if (id === null) return false;
        
        const proforma = sdb.prepare('SELECT * FROM proformas WHERE id = ?').get(id);
        if (!proforma) { res.writeHead(404); res.end(JSON.stringify({ error: 'No encontrada' })); return true; }
        const items = sdb.prepare('SELECT * FROM proforma_items WHERE proforma_id = ?').all(id);
        res.writeHead(200); res.end(JSON.stringify({ ...proforma, items }));
        return true;
    }
    
    if (metodo === 'PUT' && url === '/api/proforma') {
        const data = await parseBody(req);
        sdb.prepare('UPDATE proformas SET cliente_nombre = ?, cliente_ruc = ?, subtotal = ?, descuento = ?, total = ?, estado = ?, observaciones = ? WHERE id = ?')
            .run(data.cliente_nombre, data.cliente_ruc || '', data.subtotal, data.descuento || 0, data.total, data.estado || 'pendiente', data.observaciones || '', data.id);
        
        sdb.prepare('DELETE FROM proforma_items WHERE proforma_id = ?').run(data.id);
        for (const item of (data.items || [])) {
            sdb.prepare('INSERT INTO proforma_items (proforma_id, producto_id, codigo, nombre, cantidad, precio, subtotal) VALUES (?,?,?,?,?,?,?)')
                .run(data.id, item.producto_id || null, item.codigo || '', item.nombre, item.cantidad, item.precio, item.cantidad * item.precio);
        }
        
        res.writeHead(200); res.end(JSON.stringify({ ok: true }));
        return true;
    }
    
    if (metodo === 'DELETE' && url.startsWith('/api/proforma/')) {
        const id = extractId(url);
        if (id === null) return false;
        
        sdb.prepare('DELETE FROM proforma_items WHERE proforma_id = ?').run(id);
        sdb.prepare('DELETE FROM proformas WHERE id = ?').run(id);
        res.writeHead(200); res.end(JSON.stringify({ ok: true }));
        return true;
    }
    
    if (metodo === 'POST' && url.includes('/convertir')) {
        const id = extractId(url);
        if (id === null) return false;
        
        const proforma = sdb.prepare('SELECT * FROM proformas WHERE id = ?').get(id);
        if (!proforma) { res.writeHead(404); res.end(JSON.stringify({ error: 'No encontrada' })); return true; }
        
        const items = sdb.prepare('SELECT * FROM proforma_items WHERE proforma_id = ?').all(id);
        const numeroFactura = 'F' + Date.now().toString().slice(-10);
        
        const stmtF = sdb.prepare(`INSERT INTO facturas (numero, cliente_id, cliente_nombre, cliente_ruc, subtotal, descuento, impuesto, total, metodo, estado, usuario, fecha)
            VALUES (?,?,?,?,?,?,?,?,'efectivo','activa',?,CURRENT_TIMESTAMP)`);
        const resultF = stmtF.run(numeroFactura, proforma.cliente_id, proforma.cliente_nombre, proforma.cliente_ruc, proforma.subtotal, proforma.descuento, proforma.impuesto, proforma.total, proforma.usuario);
        const facturaId = resultF.lastInsertRowid;
        
        for (const item of items) {
            sdb.prepare('INSERT INTO factura_items (factura_id, producto_id, codigo, nombre, cantidad, precio, subtotal) VALUES (?,?,?,?,?,?,?)')
                .run(facturaId, item.producto_id, item.codigo, item.nombre, item.cantidad, item.precio, item.subtotal);
            if (item.producto_id) {
                sdb.prepare('UPDATE productos SET cantidad = cantidad - ? WHERE id = ?').run(item.cantidad, item.producto_id);
            }
        }
        
        sdb.prepare("UPDATE proformas SET estado = 'convertida' WHERE id = ?").run(id);
        
        res.writeHead(200); res.end(JSON.stringify({ ok: true, factura_id: facturaId, numero: numeroFactura }));
        return true;
    }
    
    return false;
};
