const PERMISOS_DEFECTO = {
    admin: { puede_ver: 1, puede_crear: 1, puede_editar: 1, puede_eliminar: 1, puede_imprimir: 1, puede_exportar: 1 },
    caja: { puede_ver: 1, puede_crear: 1, puede_editar: 0, puede_eliminar: 0, puede_imprimir: 1, puede_exportar: 0 },
    vendedor: { puede_ver: 1, puede_crear: 1, puede_editar: 0, puede_eliminar: 0, puede_imprimir: 0, puede_exportar: 0 },
    bodega: { puede_ver: 1, puede_crear: 0, puede_editar: 1, puede_eliminar: 0, puede_imprimir: 0, puede_exportar: 0 },
    distribuidor: { puede_ver: 1, puede_crear: 1, puede_editar: 0, puede_eliminar: 0, puede_imprimir: 0, puede_exportar: 0 }
};

async function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { resolve({}); } });
    });
}

function crearPermisosDefecto(sdb, usuarioId, rol) {
    const modulos = sdb.prepare('SELECT id FROM modulos').all();
    const permisos = PERMISOS_DEFECTO[rol] || PERMISOS_DEFECTO.caja;
    const stmt = sdb.prepare(`INSERT OR IGNORE INTO permisos_usuario (usuario_id, modulo_id, puede_ver, puede_crear, puede_editar, puede_eliminar, puede_imprimir, puede_exportar) VALUES (?,?,?,?,?,?,?,?)`);
    for (const m of modulos) {
        stmt.run(usuarioId, m.id, permisos.puede_ver, permisos.puede_crear, permisos.puede_editar, permisos.puede_eliminar, permisos.puede_imprimir, permisos.puede_exportar);
    }
}

function obtenerPermisosUsuario(sdb, usuarioId) {
    const permisos = sdb.prepare(`
        SELECT m.id as modulo_id, m.nombre, m.icon, 
               COALESCE(p.puede_ver, 1) as puede_ver,
               COALESCE(p.puede_crear, 0) as puede_crear,
               COALESCE(p.puede_editar, 0) as puede_editar,
               COALESCE(p.puede_eliminar, 0) as puede_eliminar,
               COALESCE(p.puede_imprimir, 0) as puede_imprimir,
               COALESCE(p.puede_exportar, 0) as puede_exportar
        FROM modulos m
        LEFT JOIN permisos_usuario p ON m.id = p.modulo_id AND p.usuario_id = ?
        WHERE m.enabled = 1
        ORDER BY m.orden
    `).all(usuarioId);
    
    const permisosObj = {};
    permisos.forEach(p => {
        permisosObj[p.modulo_id] = {
            nombre: p.nombre,
            icon: p.icon,
            puede_ver: p.puede_ver === 1,
            puede_crear: p.puede_crear === 1,
            puede_editar: p.puede_editar === 1,
            puede_eliminar: p.puede_eliminar === 1,
            puede_imprimir: p.puede_imprimir === 1,
            puede_exportar: p.puede_exportar === 1
        };
    });
    return permisosObj;
}

module.exports = async function(req, res, url, metodo, context) {
    const { dbSQLite, CONFIG, ipLocal, PUERTO, getConfigInstalacion } = context;
    const sdb = dbSQLite.getDB();
    
    if (url === '/api/login' && metodo === 'POST') {
        const { username, password } = await parseBody(req);
        const usuario = sdb.prepare('SELECT * FROM usuarios WHERE username = ? AND password = ? AND activo = 1').get(username, password);
        if (usuario) {
            const permisos = obtenerPermisosUsuario(sdb, usuario.id);
            usuario.permisos = permisos;
            usuario.imprimir = Object.values(permisos).some(p => p.puede_imprimir);
            
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
        const stmt = sdb.prepare(`INSERT INTO usuarios (username, password, rol, nombre, activo, primer_ingreso, imprimir) VALUES (?,?,?,?,1,1,0)`);
        const result = stmt.run(data.username, data.password || '', data.rol || 'caja', data.nombre || '');
        const usuarioId = result.lastInsertRowid;
        
        crearPermisosDefecto(sdb, usuarioId, data.rol || 'caja');
        
        const usuario = sdb.prepare('SELECT * FROM usuarios WHERE id = ?').get(usuarioId);
        usuario.permisos = obtenerPermisosUsuario(sdb, usuarioId);
        res.writeHead(200);
        res.end(JSON.stringify(usuario));
        return true;
    }
    
    if (url === '/api/usuario' && metodo === 'PUT') {
        const data = await parseBody(req);
        if (data.password) {
            sdb.prepare('UPDATE usuarios SET password = ?, primer_ingreso = 0 WHERE id = ?').run(data.password, data.id);
        } else {
            sdb.prepare('UPDATE usuarios SET nombre = ?, rol = ?, activo = ? WHERE id = ?').run(data.nombre, data.rol, data.activo ? 1 : 0, data.id);
        }
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true }));
        return true;
    }
    
    if (url === '/api/usuario' && metodo === 'DELETE') {
        const data = await parseBody(req);
        sdb.prepare('DELETE FROM permisos_usuario WHERE usuario_id = ?').run(data.id);
        sdb.prepare('DELETE FROM usuarios WHERE id = ?').run(data.id);
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true }));
        return true;
    }
    
    if (url === '/api/permisos-usuario' && metodo === 'GET') {
        const urlObj = new URL(req.url, 'http://localhost');
        const usuarioId = urlObj.searchParams.get('usuario_id');
        if (!usuarioId) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Falta usuario_id' }));
            return true;
        }
        const permisos = obtenerPermisosUsuario(sdb, parseInt(usuarioId));
        res.writeHead(200);
        res.end(JSON.stringify(permisos));
        return true;
    }
    
    if (url === '/api/permisos-usuario' && metodo === 'PUT') {
        const data = await parseBody(req);
        const { usuario_id, modulo_id, puede_ver, puede_crear, puede_editar, puede_eliminar, puede_imprimir, puede_exportar } = data;
        
        sdb.prepare(`INSERT OR REPLACE INTO permisos_usuario (usuario_id, modulo_id, puede_ver, puede_crear, puede_editar, puede_eliminar, puede_imprimir, puede_exportar) VALUES (?,?,?,?,?,?,?,?)`)
            .run(usuario_id, modulo_id, puede_ver ? 1 : 0, puede_crear ? 1 : 0, puede_editar ? 1 : 0, puede_eliminar ? 1 : 0, puede_imprimir ? 1 : 0, puede_exportar ? 1 : 0);
        
        const tieneImprimir = sdb.prepare(`SELECT COUNT(*) as c FROM permisos_usuario WHERE usuario_id = ? AND puede_imprimir = 1`).get(usuario_id).c > 0;
        sdb.prepare('UPDATE usuarios SET imprimir = ? WHERE id = ?').run(tieneImprimir ? 1 : 0, usuario_id);
        
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true }));
        return true;
    }
    
    if (url === '/api/permisos-usuario/reset' && metodo === 'POST') {
        const data = await parseBody(req);
        const usuario = sdb.prepare('SELECT rol FROM usuarios WHERE id = ?').get(data.usuario_id);
        if (!usuario) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Usuario no encontrado' }));
            return true;
        }
        sdb.prepare('DELETE FROM permisos_usuario WHERE usuario_id = ?').run(data.usuario_id);
        crearPermisosDefecto(sdb, data.usuario_id, usuario.rol);
        const permisos = obtenerPermisosUsuario(sdb, data.usuario_id);
        res.writeHead(200);
        res.end(JSON.stringify(permisos));
        return true;
    }
    
    if (url === '/api/modulos' && metodo === 'GET') {
        const modulos = sdb.prepare('SELECT * FROM modulos WHERE enabled = 1 ORDER BY orden').all();
        res.writeHead(200);
        res.end(JSON.stringify(modulos));
        return true;
    }
    
    if (url === '/api/modulos' && metodo === 'PUT') {
        const data = await parseBody(req);
        sdb.prepare('UPDATE modulos SET enabled = 0').run();
        for (const id of (data.activos || [])) sdb.prepare('UPDATE modulos SET enabled = 1 WHERE id = ?').run(id);
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
