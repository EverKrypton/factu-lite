async function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { resolve({}); } });
    });
}

module.exports = async function(req, res, url, metodo, context) {
    const sdb = context.dbSQLite.getDB();
    
    if (url === '/api/clientes' && metodo === 'GET') {
        const clientes = sdb.prepare('SELECT * FROM clientes WHERE activo = 1').all();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(clientes));
        return true;
    }
    
    if (url === '/api/cliente' && metodo === 'POST') {
        const data = await parseBody(req);
        const count = sdb.prepare('SELECT COUNT(*) as c FROM clientes').get().c;
        const codigo = 'CLI' + String(count + 1).padStart(4, '0');
        const stmt = sdb.prepare(`INSERT INTO clientes (codigo, nombre, ruc, telefono, direccion, email, limite_credito, dias_credito, contacto, activo)
            VALUES (?,?,?,?,?,?,?,?,?,1)`);
        const result = stmt.run(codigo, data.nombre, data.ruc || '', data.telefono || '', data.direccion || '', data.email || '', data.limite_credito || 0, data.dias_credito || 0, data.contacto || '');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ id: result.lastInsertRowid, codigo, nombre: data.nombre, activo: true }));
        return true;
    }
    
    if (url === '/api/cliente' && metodo === 'PUT') {
        const data = await parseBody(req);
        const stmt = sdb.prepare(`UPDATE clientes SET nombre = ?, ruc = ?, telefono = ?, direccion = ?, email = ?, limite_credito = ?, dias_credito = ?, contacto = ? WHERE id = ?`);
        stmt.run(data.nombre, data.ruc || '', data.telefono || '', data.direccion || '', data.email || '', data.limite_credito || 0, data.dias_credito || 0, data.contacto || '', data.id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
        return true;
    }
    
    if (url === '/api/cliente' && metodo === 'DELETE') {
        const data = await parseBody(req);
        sdb.prepare('UPDATE clientes SET activo = 0 WHERE id = ?').run(data.id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
        return true;
    }
    
    if (url === '/api/proveedores' && metodo === 'GET') {
        const proveedores = sdb.prepare('SELECT * FROM proveedores WHERE activo = 1').all();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(proveedores));
        return true;
    }
    
    if (url === '/api/proveedor' && metodo === 'POST') {
        const data = await parseBody(req);
        const count = sdb.prepare('SELECT COUNT(*) as c FROM proveedores').get().c;
        const codigo = 'PROV' + String(count + 1).padStart(4, '0');
        const stmt = sdb.prepare(`INSERT INTO proveedores (codigo, nombre, ruc, telefono, direccion, email, contacto, activo)
            VALUES (?,?,?,?,?,?,?,1)`);
        const result = stmt.run(codigo, data.nombre, data.ruc || '', data.telefono || '', data.direccion || '', data.email || '', data.contacto || '');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ id: result.lastInsertRowid, codigo, nombre: data.nombre, activo: true }));
        return true;
    }
    
    if (url === '/api/proveedor' && metodo === 'PUT') {
        const data = await parseBody(req);
        const stmt = sdb.prepare(`UPDATE proveedores SET nombre = ?, ruc = ?, telefono = ?, direccion = ?, email = ?, contacto = ? WHERE id = ?`);
        stmt.run(data.nombre, data.ruc || '', data.telefono || '', data.direccion || '', data.email || '', data.contacto || '', data.id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
        return true;
    }
    
    if (url === '/api/proveedor' && metodo === 'DELETE') {
        const data = await parseBody(req);
        sdb.prepare('UPDATE proveedores SET activo = 0 WHERE id = ?').run(data.id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
        return true;
    }
    
    return false;
};
