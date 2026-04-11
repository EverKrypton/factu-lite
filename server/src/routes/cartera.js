async function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { resolve({}); } });
    });
}

module.exports = async function(req, res, url, metodo, context) {
    const { dbSQLite } = context;
    const sdb = dbSQLite.getDB();
    
    if (url === '/api/cuentas-cobrar' && metodo === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify(sdb.prepare('SELECT * FROM cuentas_cobrar ORDER BY fecha_vencimiento').all()));
        return true;
    }
    
    if (url === '/api/cuenta-cobrar' && metodo === 'POST') {
        const data = await parseBody(req);
        const stmt = sdb.prepare(`INSERT INTO cuentas_cobrar (cliente_id, cliente_nombre, documento, monto_original, monto_actual, fecha_emision, fecha_vencimiento, estado)
            VALUES (?,?,?,?,?,?,?,?)`);
        const result = stmt.run(data.cliente_id, data.cliente_nombre, data.documento, data.monto, data.monto, data.fecha_emision, data.fecha_vencimiento, 'pendiente');
        res.writeHead(200);
        res.end(JSON.stringify({ id: result.lastInsertRowid, monto_actual: data.monto, estado: 'pendiente' }));
        return true;
    }
    
    if (url === '/api/pago-cobrar' && metodo === 'POST') {
        const data = await parseBody(req);
        const id = data.id || data.cuenta_id;
        const cuenta = sdb.prepare('SELECT * FROM cuentas_cobrar WHERE id = ?').get(id);
        if (cuenta) {
            sdb.prepare('INSERT INTO pagos_cobrar (cuenta_id, monto, metodo, referencia) VALUES (?,?,?,?)').run(id, data.monto, data.metodo || 'efectivo', data.observaciones || '');
            const nuevoMonto = cuenta.monto_actual - data.monto;
            const estado = nuevoMonto <= 0 ? 'pagada' : 'pendiente';
            sdb.prepare('UPDATE cuentas_cobrar SET monto_actual = ?, estado = ? WHERE id = ?').run(Math.max(0, nuevoMonto), estado, id);
            res.writeHead(200);
            res.end(JSON.stringify({ ok: true, monto_actual: Math.max(0, nuevoMonto), estado }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Cuenta no encontrada' }));
        }
        return true;
    }
    
    if (url === '/api/cuentas-pagar' && metodo === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify(sdb.prepare('SELECT * FROM cuentas_pagar ORDER BY fecha_vencimiento').all()));
        return true;
    }
    
    if (url === '/api/cuenta-pagar' && metodo === 'POST') {
        const data = await parseBody(req);
        const stmt = sdb.prepare(`INSERT INTO cuentas_pagar (proveedor_id, proveedor_nombre, documento, monto_original, monto_actual, fecha_emision, fecha_vencimiento, estado)
            VALUES (?,?,?,?,?,?,?,?)`);
        const result = stmt.run(data.proveedor_id, data.proveedor_nombre, data.documento, data.monto, data.monto, data.fecha_emision, data.fecha_vencimiento, 'pendiente');
        res.writeHead(200);
        res.end(JSON.stringify({ id: result.lastInsertRowid, monto_actual: data.monto, estado: 'pendiente' }));
        return true;
    }
    
    if (url === '/api/pago-pagar' && metodo === 'POST') {
        const data = await parseBody(req);
        const id = data.id || data.cuenta_id;
        const cuenta = sdb.prepare('SELECT * FROM cuentas_pagar WHERE id = ?').get(id);
        if (cuenta) {
            sdb.prepare('INSERT INTO pagos_pagar (cuenta_id, monto, metodo, referencia) VALUES (?,?,?,?)').run(id, data.monto, data.metodo || 'efectivo', data.observaciones || '');
            const nuevoMonto = cuenta.monto_actual - data.monto;
            const estado = nuevoMonto <= 0 ? 'pagada' : 'pendiente';
            sdb.prepare('UPDATE cuentas_pagar SET monto_actual = ?, estado = ? WHERE id = ?').run(Math.max(0, nuevoMonto), estado, id);
            res.writeHead(200);
            res.end(JSON.stringify({ ok: true, monto_actual: Math.max(0, nuevoMonto), estado }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Cuenta no encontrada' }));
        }
        return true;
    }
    
    if (url === '/api/dashboard-cartera' && metodo === 'GET') {
        const totalCobrar = sdb.prepare("SELECT COALESCE(SUM(monto_actual),0) as t FROM cuentas_cobrar WHERE estado='pendiente'").get().t;
        const totalPagar = sdb.prepare("SELECT COALESCE(SUM(monto_actual),0) as t FROM cuentas_pagar WHERE estado='pendiente'").get().t;
        const vencidoCobrar = sdb.prepare("SELECT COALESCE(SUM(monto_actual),0) as t FROM cuentas_cobrar WHERE estado='pendiente' AND fecha_vencimiento < date('now')").get().t;
        const vencidoPagar = sdb.prepare("SELECT COALESCE(SUM(monto_actual),0) as t FROM cuentas_pagar WHERE estado='pendiente' AND fecha_vencimiento < date('now')").get().t;
        res.writeHead(200);
        res.end(JSON.stringify({
            totalCobrar, totalPagar, vencidoCobrar, vencidoPagar,
            clientes: sdb.prepare('SELECT COUNT(*) as c FROM clientes').get().c,
            proveedores: sdb.prepare('SELECT COUNT(*) as c FROM proveedores').get().c
        }));
        return true;
    }
    
    return false;
};
