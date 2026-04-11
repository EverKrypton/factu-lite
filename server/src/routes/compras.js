const dbSQLite = require('../db');

async function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { resolve({}); } });
    });
}

module.exports = async function(req, res, url, metodo, context) {
    const sdb = dbSQLite.getDB();
    
    if (url === '/api/compras' && metodo === 'GET') {
        const compras = sdb.prepare('SELECT * FROM compras ORDER BY fecha DESC LIMIT 50').all();
        res.writeHead(200); res.end(JSON.stringify(compras));
        return true;
    }
    
    if (url === '/api/compras' && metodo === 'POST') {
        const data = await parseBody(req);
        const count = sdb.prepare('SELECT COUNT(*) as c FROM compras').get().c;
        const numero = 'C' + String(count + 1).padStart(4, '0');
        const total = (data.items || []).reduce((s, i) => s + (i.cantidad * i.costo), 0);
        
        const stmt = sdb.prepare(`INSERT INTO compras (numero, proveedor_id, proveedor, items, total, estado, usuario, fecha)
            VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`);
        const result = stmt.run(
            numero,
            data.proveedor_id || null,
            data.proveedor || '',
            JSON.stringify(data.items || []),
            total,
            'pendiente',
            data.usuario || 'sistema'
        );
        
        res.writeHead(200); res.end(JSON.stringify({ id: result.lastInsertRowid, numero, total, estado: 'pendiente' }));
        return true;
    }
    
    const recibirMatch = url.match(/^\/api\/compras\/(\d+)\/recibir$/);
    if (recibirMatch && metodo === 'POST') {
        const id = parseInt(recibirMatch[1]);
        const compra = sdb.prepare('SELECT * FROM compras WHERE id = ?').get(id);
        
        if (!compra) {
            res.writeHead(404); res.end(JSON.stringify({ error: 'Compra no encontrada' }));
            return true;
        }
        if (compra.estado === 'recibido') {
            res.writeHead(400); res.end(JSON.stringify({ error: 'Compra ya fue recibida' }));
            return true;
        }
        
        const items = JSON.parse(compra.items || '[]');
        const stmtProd = sdb.prepare(`INSERT INTO productos (codigo_barra, nombre, precio, precio2, cantidad, bodega_id, gramaje, categoria, stock_minimo, costo, unidad)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
        for (const item of items) {
            stmtProd.run(
                item.codigo_barra || null,
                item.nombre,
                item.precio_venta || item.costo * 1.3,
                item.precio2 || 0,
                item.cantidad,
                item.bodega_id || 1,
                item.gramaje || '',
                item.categoria || 'General',
                item.stock_minimo || 0,
                item.costo,
                item.unidad || 'UN'
            );
        }
        sdb.prepare(`UPDATE compras SET estado = 'recibido', fecha_recibido = CURRENT_TIMESTAMP WHERE id = ?`).run(id);
        res.writeHead(200); res.end(JSON.stringify({ ok: true, message: 'Productos agregados al inventario' }));
        return true;
    }
    
    if (url === '/api/ordenes' && metodo === 'GET') {
        const ordenes = sdb.prepare('SELECT * FROM compras ORDER BY id DESC LIMIT 50').all();
        res.writeHead(200); res.end(JSON.stringify(ordenes));
        return true;
    }
    
    if (url === '/api/orden' && metodo === 'POST') {
        const data = await parseBody(req);
        const numero = 'O' + Date.now().toString().slice(-10);
        const stmt = sdb.prepare(`INSERT INTO compras (numero, proveedor_id, proveedor, items, total, usuario, estado) VALUES (?,?,?,?,?,?,?)`);
        const result = stmt.run(
            numero, 
            data.proveedor_id || null,
            data.proveedor || '', 
            JSON.stringify(data.items || []), 
            data.total || 0, 
            data.usuario || '', 
            'pendiente'
        );
        res.writeHead(200); res.end(JSON.stringify({ numero, id: result.lastInsertRowid }));
        return true;
    }
    
    return false;
};
