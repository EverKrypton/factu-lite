function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { resolve({}); } });
    });
}

module.exports = async function(req, res, url, metodo, context) {
    const { dbSQLite } = context;
    const sdb = dbSQLite.getDB();
    
    const urlObj = new URL(req.url, 'http://localhost');
    const pathname = urlObj.pathname;
    const params = urlObj.searchParams;
    
    if (pathname === '/api/kardex' && metodo === 'GET') {
        const productoId = params.get('productoId');
        const fechaIni = params.get('fi');
        const fechaFin = params.get('ff');
        
        let query = 'SELECT * FROM kardex WHERE 1=1';
        const args = [];
        
        if (productoId) {
            query += ' AND producto_id = ?';
            args.push(parseInt(productoId));
        }
        if (fechaIni) {
            query += ' AND date(fecha) >= ?';
            args.push(fechaIni);
        }
        if (fechaFin) {
            query += ' AND date(fecha) <= ?';
            args.push(fechaFin);
        }
        query += ' ORDER BY fecha DESC LIMIT 500';
        
        const movimientos = sdb.prepare(query).all(...args);
        res.writeHead(200);
        res.end(JSON.stringify(movimientos));
        return true;
    }
    
    if (pathname === '/api/kardex' && metodo === 'POST') {
        const data = await parseBody(req);
        const stmt = sdb.prepare(`
            INSERT INTO kardex (producto_id, producto_nombre, tipo, cantidad, costo_unitario, costo_total, referencia, usuario)
            VALUES (?,?,?,?,?,?,?,?)
        `);
        const result = stmt.run(
            data.producto_id,
            data.producto_nombre || '',
            data.tipo,
            data.cantidad,
            data.costo_unitario || 0,
            (data.costo_unitario || 0) * data.cantidad,
            data.referencia || '',
            data.usuario || 'sistema'
        );
        
        if (data.cantidad_nueva !== undefined) {
            sdb.prepare('UPDATE productos SET cantidad = ? WHERE id = ?').run(data.cantidad_nueva, data.producto_id);
        }
        
        res.writeHead(200);
        res.end(JSON.stringify({ id: result.lastInsertRowid, ok: true }));
        return true;
    }
    
    return false;
};
