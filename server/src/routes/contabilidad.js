module.exports = async function(req, res, url, metodo, context) {
    const db = context.dbSQLite.getDB();
    const parseBody = () => context.parseBody(req);

    if (url === '/api/cuentas-contables' && metodo === 'GET') {
        const cuentas = db.prepare('SELECT * FROM cuentas_contables ORDER BY codigo').all();
        res.writeHead(200);
        res.end(JSON.stringify(cuentas));
        return true;
    }

    if (url === '/api/cuenta-contable' && metodo === 'POST') {
        const data = await parseBody();
        const stmt = db.prepare(`INSERT INTO cuentas_contables (codigo, nombre, tipo, naturaleza, nivel, padre_id, acepta_movimientos, activo)
            VALUES (?,?,?,?,?,?,?,1)`);
        const result = stmt.run(data.codigo, data.nombre, data.tipo || 'auxiliar', data.naturaleza || 'deudora', data.nivel || 1, data.padre_id || null, data.acepta_movimientos !== false ? 1 : 0);
        res.writeHead(200);
        res.end(JSON.stringify({ id: result.lastInsertRowid, codigo: data.codigo, nombre: data.nombre }));
        return true;
    }

    if (url === '/api/cuenta-contable' && metodo === 'PUT') {
        const data = await parseBody();
        db.prepare('UPDATE cuentas_contables SET codigo = ?, nombre = ?, tipo = ?, naturaleza = ?, nivel = ?, padre_id = ?, acepta_movimientos = ? WHERE id = ?')
            .run(data.codigo, data.nombre, data.tipo, data.naturaleza, data.nivel, data.padre_id, data.acepta_movimientos ? 1 : 0, data.id);
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true }));
        return true;
    }

    if (url === '/api/cuenta-contable' && metodo === 'DELETE') {
        const data = await parseBody();
        db.prepare('UPDATE cuentas_contables SET activo = 0 WHERE id = ?').run(data.id);
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true }));
        return true;
    }

    if (url === '/api/asientos' && metodo === 'GET') {
        const urlObj = new URL(req.url, 'http://localhost');
        const fechaIni = urlObj.searchParams.get('fechaIni');
        const fechaFin = urlObj.searchParams.get('fechaFin');
        let query = 'SELECT * FROM asientos WHERE 1=1';
        if (fechaIni && fechaFin) query += ` AND fecha >= '${fechaIni}' AND fecha <= '${fechaFin}'`;
        query += ' ORDER BY fecha DESC, id DESC';
        const asientos = db.prepare(query).all();
        res.writeHead(200);
        res.end(JSON.stringify(asientos));
        return true;
    }

    if (url === '/api/asiento' && metodo === 'POST') {
        const data = await parseBody();
        const totalDebito = data.movimientos.filter(m => m.tipo === 'debito').reduce((s, m) => s + m.monto, 0);
        const totalCredito = data.movimientos.filter(m => m.tipo === 'credito').reduce((s, m) => s + m.monto, 0);
        if (Math.abs(totalDebito - totalCredito) > 0.01) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'La partida doble no cuadra' }));
            return true;
        }
        const count = db.prepare('SELECT COUNT(*) as c FROM asientos').get().c;
        const stmt = db.prepare(`INSERT INTO asientos (numero, fecha, concepto, referencia, total, estado, usuario)
            VALUES (?,?,?,?,?,?,?)`);
        const result = stmt.run('AS' + new Date().getFullYear() + String(count + 1).padStart(4, '0'), data.fecha || new Date().toISOString().split('T')[0], data.concepto, data.referencia || '', totalDebito, 'activo', data.usuario);
        const asientoId = result.lastInsertRowid;
        const stmtDet = db.prepare(`INSERT INTO asiento_detalles (asiento_id, cuenta_id, cuenta_codigo, cuenta_nombre, debe, haber)
            VALUES (?,?,?,?,?,?)`);
        data.movimientos.forEach(m => {
            const cuenta = db.prepare('SELECT codigo, nombre FROM cuentas_contables WHERE id = ?').get(m.cuenta_id);
            stmtDet.run(asientoId, m.cuenta_id, cuenta?.codigo || '', cuenta?.nombre || '', m.tipo === 'debito' ? m.monto : 0, m.tipo === 'credito' ? m.monto : 0);
        });
        res.writeHead(200);
        res.end(JSON.stringify({ id: asientoId, total: totalDebito }));
        return true;
    }

    if (url === '/api/asiento' && metodo === 'PUT') {
        const data = await parseBody();
        db.prepare('UPDATE asientos SET fecha = ?, concepto = ?, referencia = ? WHERE id = ?')
            .run(data.fecha, data.concepto, data.referencia || '', data.id);
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true }));
        return true;
    }

    if (url === '/api/mayor-general' && metodo === 'GET') {
        const urlObj = new URL(req.url, 'http://localhost');
        const fechaIni = urlObj.searchParams.get('fechaIni') || new Date().toISOString().split('T')[0];
        const fechaFin = urlObj.searchParams.get('fechaFin') || fechaIni;
        const movimientos = [];
        const asientos = db.prepare(`SELECT * FROM asientos WHERE estado = 'activo' AND fecha >= ? AND fecha <= ?`).all(fechaIni, fechaFin + 'T23:59:59');
        for (const asiento of asientos) {
            const detalles = db.prepare('SELECT * FROM asiento_detalles WHERE asiento_id = ?').all(asiento.id);
            for (const m of detalles) {
                const cuenta = db.prepare('SELECT * FROM cuentas_contables WHERE id = ?').get(m.cuenta_id);
                movimientos.push({
                    fecha: asiento.fecha,
                    asiento: asiento.numero,
                    concepto: asiento.concepto,
                    cuenta_id: m.cuenta_id,
                    cuenta_nombre: cuenta ? cuenta.nombre : 'Unknown',
                    debe: m.debe,
                    haber: m.haber,
                    referencia: asiento.referencia
                });
            }
        }
        res.writeHead(200);
        res.end(JSON.stringify(movimientos));
        return true;
    }

    if (url === '/api/balance-comprobacion' && metodo === 'GET') {
        const urlObj = new URL(req.url, 'http://localhost');
        const fecha = urlObj.searchParams.get('fecha') || new Date().toISOString().split('T')[0];
        const cuentas = db.prepare('SELECT * FROM cuentas_contables WHERE activo = 1').all();
        const balance = cuentas.map(c => {
            let debitos = 0, creditos = 0;
            const asientos = db.prepare(`SELECT a.id FROM asientos a WHERE a.estado = 'activo' AND a.fecha <= ?`).all(fecha + 'T23:59:59');
            for (const a of asientos) {
                const detalles = db.prepare('SELECT * FROM asiento_detalles WHERE asiento_id = ? AND cuenta_id = ?').all(a.id, c.id);
                for (const m of detalles) {
                    debitos += m.debe || 0;
                    creditos += m.haber || 0;
                }
            }
            const saldo = c.naturaleza === 'deudora' ? debitos - creditos : creditos - debitos;
            return { codigo: c.codigo, nombre: c.nombre, naturaleza: c.naturaleza, debitos, creditos, saldo };
        });
        const totalDeb = balance.reduce((s, c) => s + c.debitos, 0);
        const totalCred = balance.reduce((s, c) => s + c.creditos, 0);
        const totalSaldo = balance.reduce((s, c) => s + c.saldo, 0);
        res.writeHead(200);
        res.end(JSON.stringify({ fecha, cuentas: balance, totalDebitos: totalDeb, totalCreditos: totalCred, totalSaldo: totalSaldo }));
        return true;
    }

    if (url === '/api/generar-asiento-venta' && metodo === 'POST') {
        const data = await parseBody();
        const caja = db.prepare("SELECT * FROM cuentas_contables WHERE codigo = '1101-01'").get();
        const ventas = db.prepare("SELECT * FROM cuentas_contables WHERE codigo = '4101-01'").get();
        const ivs = db.prepare("SELECT * FROM cuentas_contables WHERE codigo = '4102-01'").get();

        if (!caja || !ventas) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Cuentas contables no configuradas' }));
            return true;
        }

        const movimientos = [];
        if (caja) movimientos.push({ cuenta_id: caja.id, tipo: 'debito', monto: data.total });
        if (ventas) movimientos.push({ cuenta_id: ventas.id, tipo: 'credito', monto: data.subtotal });
        if (ivs && data.impuesto > 0) movimientos.push({ cuenta_id: ivs.id, tipo: 'credito', monto: data.impuesto });

        if (data.esCredito) {
            const cxcliente = db.prepare("SELECT * FROM cuentas_contables WHERE codigo = '1202-01'").get();
            const cxc = db.prepare("SELECT * FROM cuentas_contables WHERE codigo = '1202-02'").get();
            if (cxcliente) movimientos.push({ cuenta_id: cxcliente.id, tipo: 'debito', monto: data.total });
            if (cxc) movimientos.push({ cuenta_id: cxc.id, tipo: 'credito', monto: data.total });
        }

        const count = db.prepare('SELECT COUNT(*) as c FROM asientos').get().c;
        const stmt = db.prepare(`INSERT INTO asientos (numero, fecha, concepto, referencia, total, estado, usuario)
            VALUES (?,?,?,?,?,?,?)`);
        const result = stmt.run('AS' + new Date().getFullYear() + String(count + 1).padStart(4, '0'), new Date().toISOString().split('T')[0], 'Venta ' + data.documento, data.documento, data.total, 'activo', data.usuario);
        const asientoId = result.lastInsertRowid;

        for (const m of movimientos) {
            const cuenta = db.prepare('SELECT codigo, nombre FROM cuentas_contables WHERE id = ?').get(m.cuenta_id);
            db.prepare('INSERT INTO asiento_detalles (asiento_id, cuenta_id, cuenta_codigo, cuenta_nombre, debe, haber) VALUES (?,?,?,?,?,?)')
                .run(asientoId, m.cuenta_id, cuenta?.codigo || '', cuenta?.nombre || '', m.tipo === 'debito' ? m.monto : 0, m.tipo === 'credito' ? m.monto : 0);
        }

        res.writeHead(200);
        res.end(JSON.stringify({ ok: true, asientoId }));
        return true;
    }

    return false;
};
