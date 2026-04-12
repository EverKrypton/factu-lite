async function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { resolve({}); } });
    });
}

module.exports = async function(req, res, url, metodo, context) {
    const sdb = context.dbSQLite.getDB();
    const urlObj = new URL(req.url, 'http://localhost');
    const pathname = urlObj.pathname;
    const params = urlObj.searchParams;
    
    if (metodo === 'GET' && pathname === '/api/cuentas-corrientes') {
        res.writeHead(200); res.end(JSON.stringify(sdb.prepare('SELECT * FROM cuentas_corrientes WHERE activo = 1').all()));
        return true;
    }
    
    if (metodo === 'POST' && pathname === '/api/cuenta-corriente') {
        const data = await parseBody(req);
        const stmt = sdb.prepare(`INSERT INTO cuentas_corrientes (nombre, numero_cuenta, banco, saldo_inicial, saldo_actual, activo)
            VALUES (?,?,?,?,?,1)`);
        const result = stmt.run(data.nombre, data.numero_cuenta || '', data.banco || '', data.saldo_inicial || 0, data.saldo_inicial || 0);
        res.writeHead(200); res.end(JSON.stringify({ id: result.lastInsertRowid, nombre: data.nombre, saldo_actual: data.saldo_inicial || 0 }));
        return true;
    }
    
    if (metodo === 'GET' && pathname === '/api/movimientos-bancarios') {
        const cuentaId = params.get('cuentaId');
        const fi = params.get('fi') || '';
        const ff = params.get('ff') || '';
        let query = 'SELECT * FROM movimientos_bancarios WHERE 1=1';
        if (cuentaId) query += ` AND cuenta_id = ${parseInt(cuentaId)}`;
        if (fi) query += ` AND fecha >= '${fi}'`;
        if (ff) query += ` AND fecha <= '${ff}'`;
        query += ' ORDER BY fecha DESC';
        res.writeHead(200); res.end(JSON.stringify(sdb.prepare(query).all()));
        return true;
    }
    
    if (metodo === 'POST' && pathname === '/api/movimiento-bancario') {
        const data = await parseBody(req);
        const cuenta = sdb.prepare('SELECT * FROM cuentas_corrientes WHERE id = ?').get(data.cuenta_id);
        if (!cuenta) { res.writeHead(400); res.end(JSON.stringify({ error: 'Cuenta no encontrada' })); return true; }
        
        const stmt = sdb.prepare(`INSERT INTO movimientos_bancarios (cuenta_id, tipo, monto, beneficiario, concepto, referencia, estado, fecha)
            VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`);
        const result = stmt.run(data.cuenta_id, data.tipo, data.monto, data.beneficiario || '', data.concepto || '', data.referencia || '', 'completado');
        
        const nuevoSaldo = data.tipo === 'entrada' ? cuenta.saldo_actual + data.monto : cuenta.saldo_actual - data.monto;
        sdb.prepare('UPDATE cuentas_corrientes SET saldo_actual = ? WHERE id = ?').run(nuevoSaldo, data.cuenta_id);
        res.writeHead(200); res.end(JSON.stringify({ id: result.lastInsertRowid, saldo: nuevoSaldo }));
        return true;
    }
    
    if (metodo === 'GET' && pathname === '/api/conciliacion') {
        const cuentaId = params.get('cuentaId') || params.get('id');
        const cuenta = sdb.prepare('SELECT * FROM cuentas_corrientes WHERE id = ?').get(cuentaId);
        if (!cuenta) { res.writeHead(404); res.end(JSON.stringify({ error: 'Cuenta no encontrada' })); return true; }
        const movimientos = sdb.prepare('SELECT * FROM movimientos_bancarios WHERE cuenta_id = ? ORDER BY fecha DESC').all(cuentaId);
        res.writeHead(200); res.end(JSON.stringify({ cuenta, movimientos, saldoContable: cuenta.saldo_actual }));
        return true;
    }
    
    const conciliarMatch = pathname.match(/^\/api\/movimiento-bancario\/(\d+)\/conciliar$/);
    if (metodo === 'POST' && conciliarMatch) {
        const id = parseInt(conciliarMatch[1]);
        sdb.prepare('UPDATE movimientos_bancarios SET estado = ? WHERE id = ?').run('conciliado', id);
        res.writeHead(200); res.end(JSON.stringify({ ok: true }));
        return true;
    }
    
    return false;
};
