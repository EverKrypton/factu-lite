const PDFDocument = require('pdfkit');

async function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { resolve({}); } });
    });
}

module.exports = async function(req, res, url, metodo, context) {
    const { dbSQLite, CONFIG } = context || {};
    const db = dbSQLite.getDB();
    const urlObj = new URL(req.url, 'http://localhost');
    const pathname = urlObj.pathname;
    const params = urlObj.searchParams;
    
    if (url === '/api/productos' && metodo === 'GET') {
        const productos = db.prepare('SELECT * FROM productos').all();
        res.writeHead(200);
        res.end(JSON.stringify(productos));
        return true;
    }

    if (url === '/api/producto' && metodo === 'POST') {
        const data = await parseBody(req);
        const stmt = db.prepare(`
            INSERT INTO productos (codigo_barra, nombre, precio, precio2, cantidad, bodega_id, imagen, gramaje, categoria, stock_minimo, costo, unidad, numero_lote, fecha_vencimiento_prod, numero_serie)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
            data.codigo_barra || null, data.nombre, data.precio || 0, data.precio2 || 0,
            data.cantidad || 0, data.bodega_id || 1, data.imagen || '', data.gramaje || '',
            data.categoria || 'General', data.stock_minimo || 0, data.costo || 0,
            data.unidad || 'UN', data.numero_lote || '', data.fecha_vencimiento_prod || null, data.numero_serie || ''
        );
        const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(result.lastInsertRowid);
        res.writeHead(200);
        res.end(JSON.stringify(producto));
        return true;
    }

    if (url === '/api/producto' && metodo === 'PUT') {
        const data = await parseBody(req);
        const stmt = db.prepare(`
            UPDATE productos SET codigo_barra = ?, nombre = ?, precio = ?, precio2 = ?, cantidad = ?,
            bodega_id = ?, imagen = ?, gramaje = ?, categoria = ?, stock_minimo = ?, costo = ?,
            unidad = ?, numero_lote = ?, fecha_vencimiento_prod = ?, numero_serie = ?
            WHERE id = ?
        `);
        const result = stmt.run(
            data.codigo_barra, data.nombre, data.precio, data.precio2, data.cantidad,
            data.bodega_id, data.imagen, data.gramaje, data.categoria, data.stock_minimo, data.costo,
            data.unidad || 'UN', data.numero_lote || '', data.fecha_vencimiento_prod || null, data.numero_serie || '',
            data.id
        );
        if (result.changes > 0) {
            res.writeHead(200);
            res.end(JSON.stringify({ ok: true }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'No encontrado' }));
        }
        return true;
    }

    if (url === '/api/producto' && metodo === 'DELETE') {
        const data = await parseBody(req);
        db.prepare('DELETE FROM productos WHERE id = ?').run(data.id);
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true }));
        return true;
    }

    if (url.startsWith('/api/producto/') && metodo === 'GET') {
        const codigo = url.split('/api/producto/')[1];
        const producto = db.prepare('SELECT * FROM productos WHERE codigo_barra = ? OR id = ?').get(codigo, codigo);
        if (producto) {
            res.writeHead(200);
            res.end(JSON.stringify(producto));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'No encontrado' }));
        }
        return true;
    }

    if (url.startsWith('/api/buscar-productos') && metodo === 'GET') {
        const q = params.get('q') || '';
        const resultados = db.prepare(`
            SELECT id, nombre, codigo_barra, precio, precio2, cantidad, gramaje, categoria, imagen, unidad
            FROM productos 
            WHERE nombre LIKE ? OR codigo_barra LIKE ?
        `).all(`%${q}%`, `%${q}%`).map(p => ({
            ...p,
            en_stock: p.cantidad > 0
        }));
        res.writeHead(200);
        res.end(JSON.stringify(resultados));
        return true;
    }

    if (url === '/api/upload-imagen' && metodo === 'POST') {
        try {
            const data = await parseBody(req);
            if (!data.imagen || !data.producto_id) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Datos invalidos' }));
                return true;
            }
            db.prepare('UPDATE productos SET imagen = ? WHERE id = ?').run(data.imagen, data.producto_id);
            res.writeHead(200);
            res.end(JSON.stringify({ ok: true, imagen: data.imagen }));
        } catch(e) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: e.message }));
        }
        return true;
    }

    if (url === '/api/unidades' && metodo === 'GET') {
        const unidades = ['UN', 'CAJA', 'LB', 'KG', 'ML', 'L', 'DOCENA', 'PAQUETE', 'PAR'];
        res.writeHead(200);
        res.end(JSON.stringify(unidades));
        return true;
    }

    if (url.startsWith('/api/etiquetas-pdf') && metodo === 'GET') {
        const idsParam = params.get('ids') || '';
        const ids = idsParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
        
        if (ids.length === 0) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'No se especificaron IDs' }));
            return true;
        }
        
        const placeholders = ids.map(() => '?').join(',');
        const productos = db.prepare(`SELECT * FROM productos WHERE id IN (${placeholders})`).all(...ids);
        
        const doc = new PDFDocument({ margin: 10, size: [141.73, 85.04], layout: 'landscape' });
        const chunks = [];
        
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="etiquetas.pdf"');
            res.setHeader('Content-Length', pdfBuffer.length);
            res.writeHead(200);
            res.end(pdfBuffer);
        });
        
        let etiquetasEnPagina = 0;
        
        productos.forEach((p, i) => {
            if (i > 0 && i % 30 === 0) {
                doc.addPage();
            }
            
            const nombreCorto = (p.nombre || '').substring(0, 20);
            const precio = (p.precio || 0).toFixed(2);
            const codigo = p.codigo_barra || '';
            
            doc.fontSize(10).fillColor('#000').text(nombreCorto, 5, 5, { width: 130 });
            doc.fontSize(14).fillColor('#183e6d').text(`C$ ${precio}`, 5, 20, { width: 130 });
            if (codigo) {
                doc.fontSize(8).fillColor('#666').text(codigo, 5, 38, { width: 130 });
            }
            
            etiquetasEnPagina++;
            
            if (etiquetasEnPagina < productos.length && etiquetasEnPagina % 3 !== 0) {
                doc.translate(142, 0);
            } else if (etiquetasEnPagina % 3 === 0 && etiquetasEnPagina < productos.length) {
                doc.translate(-284, 85);
            }
        });
        
        doc.end();
        return true;
    }

    if (url.startsWith('/api/catalogo-pdf') && metodo === 'GET') {
        const fecha = new Date().toISOString().split('T')[0];
        const ordenar = params.get('ordenar') || 'descripcion';
        const categoriaFilter = params.get('categoria') || '';

        let prods = db.prepare('SELECT * FROM productos').all();
        if (categoriaFilter) prods = prods.filter(p => p.categoria === categoriaFilter);

        if (ordenar === 'codigo') prods.sort((a, b) => (a.codigo_barra || '').localeCompare(b.codigo_barra || ''));
        else if (ordenar === 'precio') prods.sort((a, b) => (b.precio || 0) - (a.precio || 0));
        else prods.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));

        const doc = new PDFDocument({ margin: 30, size: 'letter', layout: 'portrait' });
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="catalogo_${fecha}.pdf"`);
            res.setHeader('Content-Length', pdfBuffer.length);
            res.writeHead(200);
            res.end(pdfBuffer);
        });

        doc.fontSize(24).fillColor('#183e6d').text('CATALOGO DE PRODUCTOS', { align: 'center' });
        doc.fontSize(10).fillColor('#666').text(`Fecha: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(1);
        doc.fontSize(10).fillColor('#183e6d').text(CONFIG?.nombre || 'FactuLite', { align: 'center' });
        doc.moveDown(1.5);

        let y = doc.y;
        const colWidths = [80, 180, 70, 70, 50, 90];
        const rowHeight = 25;

        doc.fillColor('white').rect(30, y, 540, rowHeight).fill('#183e6d');
        doc.fillColor('white').fontSize(9);
        doc.text('Codigo', 35, y + 8, { width: colWidths[0] });
        doc.text('Producto', 115, y + 8, { width: colWidths[1] });
        doc.text('Categoria', 295, y + 8, { width: colWidths[2] });
        doc.text('Stock', 365, y + 8, { width: colWidths[3] });
        doc.text('Unid.', 415, y + 8, { width: colWidths[4] });
        doc.text('Precio', 465, y + 8, { width: colWidths[5] });

        y += rowHeight;

        doc.fillColor('#333').fontSize(8);
        prods.forEach((p, i) => {
            if (y > 720) {
                doc.addPage();
                y = 30;
            }

            const bgColor = i % 2 === 0 ? '#f9f9f9' : '#ffffff';
            doc.fillColor(bgColor).rect(30, y, 540, rowHeight).fill();
            doc.fillColor('#333').fontSize(8);
            doc.text(p.codigo_barra || '-', 35, y + 8, { width: colWidths[0] });
            doc.text(p.nombre || '-', 115, y + 8, { width: colWidths[1] });
            doc.text(p.categoria || '-', 295, y + 8, { width: colWidths[2] });
            doc.text(String(p.cantidad || 0), 365, y + 8, { width: colWidths[3] });
            doc.text(p.unidad || 'UN', 415, y + 8, { width: colWidths[4] });
            doc.fillColor('#183e6d').text(`C$ ${(p.precio || 0).toFixed(2)}`, 465, y + 8, { width: colWidths[5] });

            y += rowHeight;
        });

        doc.moveDown(2);
        doc.fontSize(8).fillColor('#999').text('Precios sujetos a cambios sin previo aviso', { align: 'center' });

        doc.end();
        return true;
    }

    return false;
};
