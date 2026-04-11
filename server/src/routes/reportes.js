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
    const urlObj = new URL(req.url, 'http://localhost');
    const pathname = urlObj.pathname;
    const params = urlObj.searchParams;

    if (metodo === 'GET' && pathname === '/api/reporte-diario') {
        const fecha = params.get('fecha') || new Date().toISOString().split('T')[0];
        const ventasF = sdb.prepare(`SELECT numero, total, metodo, usuario, fecha FROM facturas WHERE date(fecha)=?`).all(fecha);
        const ventasT = sdb.prepare(`SELECT numero, total, metodo, usuario, fecha FROM tickets WHERE date(fecha)=?`).all(fecha);
        const ventas = [...ventasF.map(v => ({...v, tipo: 'factura'})), ...ventasT.map(v => ({...v, tipo: 'ticket'}))];
        const porMetodo = {
            efectivo: ventas.filter(v => v.metodo === 'efectivo').reduce((s, v) => s + v.total, 0),
            transferencia: ventas.filter(v => v.metodo === 'transferencia').reduce((s, v) => s + v.total, 0),
            tarjeta: ventas.filter(v => v.metodo === 'tarjeta').reduce((s, v) => s + v.total, 0)
        };
        res.writeHead(200); res.end(JSON.stringify({ 
            fecha, 
            totalVentas: ventas.reduce((s, v) => s + v.total, 0), 
            cantidadVentas: ventas.length, 
            porMetodo, 
            ventas: ventas.map(v => ({ 
                numero: v.numero, 
                total: v.total, 
                metodo: v.metodo, 
                usuario: v.usuario, 
                hora: new Date(v.fecha).toLocaleTimeString() 
            })) 
        }));
        return true;
    }

    if (metodo === 'GET' && pathname === '/api/reporte-mensual') {
        const anio = parseInt(params.get('anio') || new Date().getFullYear());
        const mes = parseInt(params.get('mes') || new Date().getMonth() + 1);
        const ventasF = sdb.prepare(`SELECT total, fecha FROM facturas WHERE strftime('%Y', fecha) = ? AND strftime('%m', fecha) = ?`).all(String(anio), String(mes).padStart(2, '0'));
        const ventasT = sdb.prepare(`SELECT total, fecha FROM tickets WHERE strftime('%Y', fecha) = ? AND strftime('%m', fecha) = ?`).all(String(anio), String(mes).padStart(2, '0'));
        const ventas = [...ventasF, ...ventasT];
        const dias = {};
        ventas.forEach(v => {
            const dia = new Date(v.fecha).getDate();
            dias[dia] = (dias[dia] || 0) + v.total;
        });
        res.writeHead(200); res.end(JSON.stringify({ 
            anio, 
            mes, 
            total: ventas.reduce((s, v) => s + v.total, 0), 
            cantidad: ventas.length, 
            promedio: ventas.length > 0 ? ventas.reduce((s, v) => s + v.total, 0) / ventas.length : 0, 
            ventasPorDia: dias 
        }));
        return true;
    }

    if (metodo === 'GET' && pathname === '/api/reporte-productos') {
        const fechaIni = params.get('fechaIni') || new Date().toISOString().split('T')[0];
        const fechaFin = params.get('fechaFin') || fechaIni;
        const itemsF = sdb.prepare(`SELECT fi.nombre, fi.cantidad, fi.precio FROM factura_items fi JOIN facturas f ON fi.factura_id = f.id WHERE date(f.fecha) BETWEEN ? AND ?`).all(fechaIni, fechaFin);
        const itemsT = sdb.prepare(`SELECT ti.nombre, ti.cantidad, ti.precio FROM ticket_items ti JOIN tickets t ON ti.ticket_id = t.id WHERE date(t.fecha) BETWEEN ? AND ?`).all(fechaIni, fechaFin);
        const productos = {};
        [...itemsF, ...itemsT].forEach(i => { 
            productos[i.nombre] = (productos[i.nombre] || { cantidad: 0, total: 0 }); 
            productos[i.nombre].cantidad += i.cantidad; 
            productos[i.nombre].total += i.cantidad * i.precio; 
        });
        const top = Object.entries(productos).map(([nombre, data]) => ({ nombre, cantidad: data.cantidad, total: data.total })).sort((a, b) => b.total - a.total).slice(0, 20);
        res.writeHead(200); res.end(JSON.stringify({ fechaIni, fechaFin, productos: top, totalGeneral: top.reduce((s, p) => s + p.total, 0) }));
        return true;
    }

    if (metodo === 'GET' && pathname === '/api/reporte-usuarios') {
        const fechaIni = params.get('fechaIni') || new Date().toISOString().split('T')[0];
        const fechaFin = params.get('fechaFin') || fechaIni;
        const ventasF = sdb.prepare(`SELECT usuario, total, fecha FROM facturas WHERE date(fecha) BETWEEN ? AND ?`).all(fechaIni, fechaFin);
        const ventasT = sdb.prepare(`SELECT usuario, total, fecha FROM tickets WHERE date(fecha) BETWEEN ? AND ?`).all(fechaIni, fechaFin);
        const ventas = [...ventasF, ...ventasT];
        const usuarios = {};
        ventas.forEach(v => { 
            usuarios[v.usuario] = (usuarios[v.usuario] || { ventas: 0, total: 0 }); 
            usuarios[v.usuario].ventas++; 
            usuarios[v.usuario].total += v.total; 
        });
        const reporte = Object.entries(usuarios).map(([nombre, data]) => ({ nombre, ventas: data.ventas, total: data.total })).sort((a, b) => b.total - a.total);
        res.writeHead(200); res.end(JSON.stringify({ fechaIni, fechaFin, usuarios: reporte, totalGeneral: reporte.reduce((s, u) => s + u.total, 0) }));
        return true;
    }

    if (metodo === 'GET' && pathname === '/api/dashboard') {
        const hoy = new Date().toISOString().split('T')[0];
        const ventasF = sdb.prepare(`SELECT COALESCE(SUM(total),0) as v FROM facturas WHERE date(fecha)=?`).get(hoy).v;
        const ventasT = sdb.prepare(`SELECT COALESCE(SUM(total),0) as v FROM tickets WHERE date(fecha)=?`).get(hoy).v;
        const ventasHoy = ventasF + ventasT;
        const facturasF = sdb.prepare(`SELECT COUNT(*) as c FROM facturas WHERE date(fecha)=?`).get(hoy).c;
        const facturasT = sdb.prepare(`SELECT COUNT(*) as c FROM tickets WHERE date(fecha)=?`).get(hoy).c;
        const facturasHoy = facturasF + facturasT;
        const productosBajosStock = sdb.prepare(`SELECT id, nombre, cantidad, stock_minimo FROM productos WHERE stock_minimo > 0 AND cantidad < stock_minimo`).all();
        res.writeHead(200); res.end(JSON.stringify({ 
            ventasHoy, 
            facturasHoy, 
            productos: sdb.prepare('SELECT COUNT(*) as c FROM productos').get().c,
            productosBajos: productosBajosStock.length,
            alertasStock: productosBajosStock
        }));
        return true;
    }

    if (metodo === 'POST' && pathname === '/api/corte-caja') {
        const data = await parseBody(req);
        const usuario = data.usuario || 'admin';
        const fecha = new Date().toISOString().split('T')[0];
        
        const efectivoF = sdb.prepare(`SELECT COALESCE(SUM(total),0) as t FROM facturas WHERE date(fecha)=? AND metodo='efectivo'`).get(fecha).t;
        const efectivoT = sdb.prepare(`SELECT COALESCE(SUM(total),0) as t FROM tickets WHERE date(fecha)=? AND metodo='efectivo'`).get(fecha).t;
        const efectivo = efectivoF + efectivoT;
        
        const transferencia = sdb.prepare(`SELECT COALESCE(SUM(total),0) as t FROM facturas WHERE date(fecha)=? AND metodo='transferencia'`).get(fecha).t + 
                              sdb.prepare(`SELECT COALESCE(SUM(total),0) as t FROM tickets WHERE date(fecha)=? AND metodo='transferencia'`).get(fecha).t;
        const tarjeta = sdb.prepare(`SELECT COALESCE(SUM(total),0) as t FROM facturas WHERE date(fecha)=? AND metodo='tarjeta'`).get(fecha).t + 
                        sdb.prepare(`SELECT COALESCE(SUM(total),0) as t FROM tickets WHERE date(fecha)=? AND metodo='tarjeta'`).get(fecha).t;
        
        const ventasCredito = sdb.prepare(`SELECT COALESCE(SUM(total),0) as t FROM facturas WHERE date(fecha)=? AND terminos='Crédito'`).get(fecha).t;
        const ventasContado = sdb.prepare(`SELECT COALESCE(SUM(total),0) as t FROM facturas WHERE date(fecha)=? AND terminos='Contado'`).get(fecha).t + 
                              sdb.prepare(`SELECT COALESCE(SUM(total),0) as t FROM tickets WHERE date(fecha)=?`).get(fecha).t;
        
        const totalSistema = efectivo + transferencia + tarjeta;
        const cantidadVentas = sdb.prepare(`SELECT COUNT(*) as c FROM facturas WHERE date(fecha)=?`).get(fecha).c + sdb.prepare(`SELECT COUNT(*) as c FROM tickets WHERE date(fecha)=?`).get(fecha).c;
        
        const stmt = sdb.prepare(`INSERT INTO cortes_caja (fecha, usuario, efectivo_reportado, transferencia_reportado, tarjeta_reportado, efectivo_sistema, transferencia_sistema, tarjeta_sistema, total_sistema, diferencia, cantidad_ventas, ventas_credito, ventas_contado)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`);
        const result = stmt.run(
            fecha, usuario,
            data.efectivo_reportado || 0, data.transferencia_reportado || 0, data.tarjeta_reportado || 0,
            efectivo, transferencia, tarjeta, totalSistema,
            ((data.efectivo_reportado || 0) + (data.transferencia_reportado || 0) + (data.tarjeta_reportado || 0)) - totalSistema,
            cantidadVentas, ventasCredito, ventasContado
        );
        res.writeHead(200); res.end(JSON.stringify({ id: result.lastInsertRowid, fecha, total_sistema: totalSistema, cantidad_ventas: cantidadVentas, ventas_credito: ventasCredito, ventas_contado: ventasContado }));
        return true;
    }

    if (metodo === 'GET' && pathname === '/api/cortes-caja') {
        const ultimos = sdb.prepare(`SELECT * FROM cortes_caja ORDER BY created_at DESC LIMIT 30`).all();
        res.writeHead(200); res.end(JSON.stringify(ultimos));
        return true;
    }

    if (metodo === 'GET' && pathname === '/api/reporte-devoluciones') {
        const fi = params.get('fi') || new Date().toISOString().split('T')[0];
        const ff = params.get('ff') || fi;
        const devoluciones = sdb.prepare(`SELECT * FROM devoluciones WHERE date(fecha) BETWEEN ? AND ? ORDER BY fecha DESC`).all(fi, ff);
        const total = devoluciones.reduce((s, d) => s + (d.total || 0), 0);
        for (const dev of devoluciones) {
            dev.items = sdb.prepare('SELECT * FROM devolucion_items WHERE devolucion_id = ?').all(dev.id);
        }
        res.writeHead(200); res.end(JSON.stringify({ fecha_inicio: fi, fecha_fin: ff, devoluciones, total, cantidad: devoluciones.length }));
        return true;
    }

    return false;
};
