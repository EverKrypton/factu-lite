const PERMISOS = {
    admin: { ver_inventario: true, editar_inventario: true, ver_todos_movimientos: true, crear_factura: true, crear_ticket: true, crear_orden: false, reportes: true, config: true, actualizar: true, imprimir: true, ver_reportes_detallados: true },
    caja: { ver_inventario: true, editar_inventario: false, ver_todos_movimientos: false, crear_factura: true, crear_ticket: true, crear_orden: false, reportes: true, config: false, actualizar: false, imprimir: true, ver_reportes_detallados: true },
    vendedor: { ver_inventario: true, editar_inventario: false, ver_todos_movimientos: false, crear_factura: true, crear_ticket: true, crear_orden: false, reportes: false, config: false, actualizar: false, imprimir: false, ver_reportes_detallados: false },
    bodega: { ver_inventario: true, editar_inventario: true, ver_todos_movimientos: false, crear_factura: false, crear_ticket: false, crear_orden: false, reportes: false, config: false, actualizar: false, imprimir: false, ver_reportes_detallados: false },
    distribuidor: { ver_inventario: true, editar_inventario: false, ver_todos_movimientos: false, crear_factura: true, crear_ticket: true, crear_orden: false, reportes: false, config: false, actualizar: false, imprimir: false, ver_reportes_detallados: false }
};

async function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { resolve({}); } });
    });
}

module.exports = async function(req, res, url, metodo, context) {
    const { dbSQLite, CONFIG, ipLocal, PUERTO, getConfigInstalacion } = context;
    const sdb = dbSQLite.getDB();
    
    if (url === '/api/login' && metodo === 'POST') {
        const { username, password } = await parseBody(req);
        const usuario = sdb.prepare('SELECT * FROM usuarios WHERE username = ? AND password = ? AND activo = 1').get(username, password);
        if (usuario) {
            usuario.permisos = PERMISOS[usuario.rol] || {};
            const configInstalacion = getConfigInstalacion ? getConfigInstalacion() : null;
            const configEmpresa = dbSQLite.getConfigEmpresa ? dbSQLite.getConfigEmpresa() : sdb.prepare('SELECT * FROM config_empresa WHERE id = 1').get();
            res.writeHead(200);
            res.end(JSON.stringify({ 
                ok: true, usuario, config: CONFIG, 
                primer_ingreso: usuario.primer_ingreso === 1,
                ipServidor: ipLocal, puerto: PUERTO,
                primera_ejecucion: !configInstalacion || !configInstalacion.instalacion_completada,
                db_path: dbSQLite.dbPath(),
                configEmpresa
            }));
        } else {
            res.writeHead(401);
            res.end(JSON.stringify({ error: 'Credenciales inválidas' }));
        }
        return true;
    }
    
    if (url === '/api/usuarios' && metodo === 'GET') {
        const usuarios = sdb.prepare('SELECT * FROM usuarios').all();
        res.writeHead(200);
        res.end(JSON.stringify(usuarios));
        return true;
    }
    
    if (url === '/api/usuario' && metodo === 'POST') {
        const data = await parseBody(req);
        const imprimir = data.imprimir !== undefined ? data.imprimir : (PERMISOS[data.rol]?.imprimir || false);
        const stmt = sdb.prepare(`INSERT INTO usuarios (username, password, rol, nombre, activo, primer_ingreso, imprimir) VALUES (?,?,?,?,1,1,?)`);
        const result = stmt.run(data.username, data.password || '', data.rol || 'caja', data.nombre || '', imprimir ? 1 : 0);
        const usuario = sdb.prepare('SELECT * FROM usuarios WHERE id = ?').get(result.lastInsertRowid);
        res.writeHead(200);
        res.end(JSON.stringify(usuario));
        return true;
    }
    
    if (url === '/api/usuario' && metodo === 'PUT') {
        const data = await parseBody(req);
        if (data.password) {
            sdb.prepare('UPDATE usuarios SET password = ?, primer_ingreso = 0 WHERE id = ?').run(data.password, data.id);
        } else {
            const imprimir = data.imprimir !== undefined ? data.imprimir : (PERMISOS[data.rol]?.imprimir || false);
            sdb.prepare('UPDATE usuarios SET nombre = ?, rol = ?, activo = ?, imprimir = ? WHERE id = ?').run(data.nombre, data.rol, data.activo ? 1 : 0, imprimir ? 1 : 0, data.id);
        }
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true }));
        return true;
    }
    
    if (url === '/api/config-empresa' && metodo === 'GET') {
        const config = dbSQLite.getConfigEmpresa ? dbSQLite.getConfigEmpresa() : sdb.prepare('SELECT * FROM config_empresa WHERE id = 1').get();
        res.writeHead(200);
        res.end(JSON.stringify(config || {}));
        return true;
    }
    
    if (url === '/api/config-empresa' && metodo === 'PUT') {
        const data = await parseBody(req);
        const fields = Object.keys(data).filter(k => k !== 'id');
        const setClause = fields.map(f => `${f} = @${f}`).join(', ');
        sdb.prepare(`UPDATE config_empresa SET ${setClause} WHERE id = 1`).run(data);
        const config = dbSQLite.getConfigEmpresa ? dbSQLite.getConfigEmpresa() : sdb.prepare('SELECT * FROM config_empresa WHERE id = 1').get();
        res.writeHead(200);
        res.end(JSON.stringify(config));
        return true;
    }
    
    if (url === '/api/tipo-cambio' && metodo === 'GET') {
        const config = dbSQLite.getConfigEmpresa ? dbSQLite.getConfigEmpresa() : sdb.prepare('SELECT * FROM config_empresa WHERE id = 1').get();
        res.writeHead(200);
        res.end(JSON.stringify({ 
            tipo_cambio_usd: config?.tipo_cambio_usd || 36.7120,
            fecha: new Date().toISOString()
        }));
        return true;
    }
    
    return false;
};
