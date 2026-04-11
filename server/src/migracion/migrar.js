const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const MAPEO_TABLAS = {
    'producto': 'productos',
    'productos': 'productos',
    'product': 'productos',
    'item': 'productos',
    'items': 'productos',
    'articulo': 'productos',
    'articulos': 'productos',
    'cliente': 'clientes',
    'clientes': 'clientes',
    'customer': 'clientes',
    'customers': 'clientes',
    'proveedor': 'proveedores',
    'proveedores': 'proveedores',
    'supplier': 'proveedores',
    'suppliers': 'proveedores',
    'factura': 'facturas',
    'facturas': 'facturas',
    'invoice': 'facturas',
    'invoices': 'facturas',
    'ticket': 'tickets',
    'tickets': 'tickets',
    'venta': 'facturas',
    'ventas': 'facturas',
    'usuario': 'usuarios',
    'usuarios': 'usuarios',
    'user': 'usuarios',
    'users': 'usuarios',
    'bodega': 'bodegas',
    'bodegas': 'bodegas',
    'warehouse': 'bodegas',
    'kardex': 'kardex',
    'movimiento': 'kardex',
    'movimientos': 'kardex',
    'compra': 'compras',
    'compras': 'compras',
    'purchase': 'compras',
    'cuenta_cobrar': 'cuentas_cobrar',
    'cuentas_cobrar': 'cuentas_cobrar',
    'receivable': 'cuentas_cobrar',
    'cuenta_pagar': 'cuentas_pagar',
    'cuentas_pagar': 'cuentas_pagar',
    'payable': 'cuentas_pagar'
};

const MAPEO_CAMPOS = {
    productos: {
        'codigo': 'codigo_barra',
        'codigo_barra': 'codigo_barra',
        'barcode': 'codigo_barra',
        'sku': 'codigo_barra',
        'nombre': 'nombre',
        'name': 'nombre',
        'descripcion': 'nombre',
        'description': 'nombre',
        'precio': 'precio',
        'price': 'precio',
        'precio1': 'precio',
        'precio_venta': 'precio',
        'cantidad': 'cantidad',
        'stock': 'cantidad',
        'quantity': 'cantidad',
        'existencia': 'cantidad',
        'costo': 'costo',
        'cost': 'costo',
        'precio_compra': 'costo',
        'categoria': 'categoria',
        'category': 'categoria',
        'familia': 'categoria',
        'unidad': 'unidad',
        'unit': 'unidad',
        'gramaje': 'gramaje',
        'peso': 'gramaje',
        'imagen': 'imagen',
        'image': 'imagen',
        'foto': 'imagen',
        'stock_minimo': 'stock_minimo',
        'min_stock': 'stock_minimo',
        'bodega_id': 'bodega_id',
        'warehouse_id': 'bodega_id'
    },
    clientes: {
        'nombre': 'nombre',
        'name': 'nombre',
        'razon_social': 'nombre',
        'ruc': 'ruc',
        'nit': 'ruc',
        'tax_id': 'ruc',
        'direccion': 'direccion',
        'address': 'direccion',
        'direccion1': 'direccion',
        'telefono': 'telefono',
        'phone': 'telefono',
        'tel': 'telefono',
        'email': 'email',
        'correo': 'email',
        'limite_credito': 'limite_credito',
        'credit_limit': 'limite_credito',
        'dias_credito': 'dias_credito',
        'dias': 'dias_credito',
        'contacto': 'contacto',
        'contact': 'contacto'
    },
    proveedores: {
        'nombre': 'nombre',
        'name': 'nombre',
        'razon_social': 'nombre',
        'ruc': 'ruc',
        'nit': 'ruc',
        'direccion': 'direccion',
        'telefono': 'telefono',
        'email': 'email',
        'contacto': 'contacto'
    },
    facturas: {
        'numero': 'numero',
        'number': 'numero',
        'num_factura': 'numero',
        'cliente_id': 'cliente_id',
        'customer_id': 'cliente_id',
        'cliente': 'cliente_nombre',
        'cliente_nombre': 'cliente_nombre',
        'cliente_ruc': 'cliente_ruc',
        'nit': 'cliente_ruc',
        'subtotal': 'subtotal',
        'sub_total': 'subtotal',
        'descuento': 'descuento',
        'discount': 'descuento',
        'impuesto': 'impuesto',
        'tax': 'impuesto',
        'iva': 'impuesto',
        'total': 'total',
        'fecha': 'fecha',
        'date': 'fecha',
        'fecha_emision': 'fecha',
        'estado': 'estado',
        'status': 'estado',
        'metodo': 'metodo',
        'metodo_pago': 'metodo',
        'payment_method': 'metodo',
        'usuario': 'usuario',
        'user': 'usuario',
        'vendedor': 'vendedor_nombre'
    },
    tickets: {
        'numero': 'numero',
        'cliente': 'cliente_nombre',
        'subtotal': 'subtotal',
        'total': 'total',
        'fecha': 'fecha',
        'estado': 'estado',
        'metodo': 'metodo',
        'usuario': 'usuario'
    },
    usuarios: {
        'username': 'username',
        'usuario': 'username',
        'user': 'username',
        'login': 'username',
        'password': 'password',
        'clave': 'password',
        'pass': 'password',
        'rol': 'rol',
        'role': 'rol',
        'perfil': 'rol',
        'nombre': 'nombre',
        'name': 'nombre'
    }
};

function detectarTipoSQL(contenido) {
    const upper = contenido.toUpperCase();
    
    if (upper.includes('CREATE TABLE') && (upper.includes('NVARCHAR') || upper.includes('DATETIME2') || upper.includes('IDENTITY(1,1)'))) {
        return 'sqlserver';
    }
    if (upper.includes('CREATE TABLE') && (upper.includes('AUTO_INCREMENT') || upper.includes('ENGINE=INNODB'))) {
        return 'mysql';
    }
    if (upper.includes('CREATE TABLE') && (upper.includes('SERIAL') || upper.includes('BIGSERIAL'))) {
        return 'postgresql';
    }
    if (upper.includes('CREATE TABLE') && upper.includes('TEXT') && !upper.includes('ENGINE')) {
        return 'sqlite';
    }
    
    return 'generico';
}

function extraerTablasSQLServer(contenido) {
    const tablas = [];
    const regex = /CREATE\s+TABLE\s+\[?(\w+)\]?\s*\(([\s\S]*?)\);?\s*(?=CREATE|GO|$)/gi;
    let match;
    
    while ((match = regex.exec(contenido)) !== null) {
        const nombre = match[1].toLowerCase();
        const columnas = [];
        const colsStr = match[2];
        
        const colRegex = /\[?(\w+)\]?\s+(\w+)(?:\(([^)]+)\))?(?:\s+(NOT NULL|NULL|IDENTITY|PRIMARY KEY|DEFAULT[^,]+))?/gi;
        let colMatch;
        
        while ((colMatch = colRegex.exec(colsStr)) !== null) {
            if (colMatch[1].toLowerCase() !== 'constraint' && colMatch[1].toLowerCase() !== 'primary') {
                columnas.push({
                    nombre: colMatch[1].toLowerCase(),
                    tipo: colMatch[2].toUpperCase(),
                    esPK: colMatch[0].toUpperCase().includes('PRIMARY KEY') || colMatch[0].toUpperCase().includes('IDENTITY')
                });
            }
        }
        
        tablas.push({ nombre, columnas });
    }
    
    return tablas;
}

function extraerTablasMySQL(contenido) {
    const tablas = [];
    const regex = /CREATE\s+TABLE\s+`?(\w+)`?\s*\(([\s\S]*?)\)\s*(?:ENGINE|;)/gi;
    let match;
    
    while ((match = regex.exec(contenido)) !== null) {
        const nombre = match[1].toLowerCase();
        const columnas = [];
        const colsStr = match[2];
        
        const colRegex = /`?(\w+)`?\s+(\w+)(?:\(([^)]+)\))?(?:\s+(?:NOT NULL|NULL|AUTO_INCREMENT|PRIMARY KEY|DEFAULT[^,]*))?/gi;
        let colMatch;
        
        while ((colMatch = colRegex.exec(colsStr)) !== null) {
            if (colMatch[1].toLowerCase() !== 'primary' && colMatch[1].toLowerCase() !== 'key' && colMatch[1].toLowerCase() !== 'unique') {
                columnas.push({
                    nombre: colMatch[1].toLowerCase(),
                    tipo: colMatch[2].toUpperCase(),
                    esPK: colMatch[0].toUpperCase().includes('PRIMARY KEY') || colMatch[0].toUpperCase().includes('AUTO_INCREMENT')
                });
            }
        }
        
        tablas.push({ nombre, columnas });
    }
    
    return tablas;
}

function extraerInserts(contenido) {
    const inserts = [];
    const regex = /INSERT\s+INTO\s+\[?`?(\w+)\]?`?\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/gi;
    let match;
    
    while ((match = regex.exec(contenido)) !== null) {
        const tabla = match[1].toLowerCase();
        const columnas = match[2].replace(/[\[\]`]/g, '').split(',').map(c => c.trim().toLowerCase());
        const valores = match[3].split(',').map(v => {
            v = v.trim();
            if (v.startsWith("'") || v.startsWith('"')) {
                return v.slice(1, -1).replace(/''/g, "'");
            }
            return v === 'NULL' ? null : (isNaN(v) ? v : parseFloat(v));
        });
        
        inserts.push({ tabla, columnas, valores });
    }
    
    return inserts;
}

function mapearTabla(nombreTabla) {
    const lower = nombreTabla.toLowerCase();
    
    for (const [key, value] of Object.entries(MAPEO_TABLAS)) {
        if (lower.includes(key)) {
            return value;
        }
    }
    return null;
}

function mapearCampo(tablaDestino, nombreCampo) {
    const lower = nombreCampo.toLowerCase();
    const mapeo = MAPEO_CAMPOS[tablaDestino];
    
    if (!mapeo) return lower;
    
    for (const [key, value] of Object.entries(mapeo)) {
        if (lower === key || lower.includes(key)) {
            return value;
        }
    }
    return lower;
}

function detectarYLeerDB(archivoPath) {
    const ext = path.extname(archivoPath).toLowerCase();
    
    if (ext === '.sql') {
        return { tipo: 'sql', contenido: fs.readFileSync(archivoPath, 'utf8') };
    }
    
    if (ext === '.db' || ext === '.sqlite' || ext === '.sqlite3') {
        return { tipo: 'sqlite', path: archivoPath };
    }
    
    if (ext === '.json') {
        return { tipo: 'json', contenido: fs.readFileSync(archivoPath, 'utf8') };
    }
    
    try {
        const contenido = fs.readFileSync(archivoPath, 'utf8');
        if (contenido.includes('CREATE TABLE') || contenido.includes('INSERT INTO')) {
            return { tipo: 'sql', contenido };
        }
        return { tipo: 'json', contenido };
    } catch (e) {
        return { tipo: 'desconocido', error: e.message };
    }
}

function extraerDeSQLite(sourcePath, targetDB) {
    const sourceDB = new Database(sourcePath, { readonly: true });
    const tablas = sourceDB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    
    const datos = {};
    
    for (const { name } of tablas) {
        if (name.startsWith('sqlite_')) continue;
        
        const tablaDestino = mapearTabla(name);
        if (!tablaDestino) continue;
        
        try {
            const filas = sourceDB.prepare(`SELECT * FROM ${name}`).all();
            if (filas.length > 0) {
                if (!datos[tablaDestino]) datos[tablaDestino] = [];
                
                filas.forEach(fila => {
                    const mapeada = {};
                    for (const [key, value] of Object.entries(fila)) {
                        const campoDestino = mapearCampo(tablaDestino, key);
                        mapeada[campoDestino] = value;
                    }
                    datos[tablaDestino].push(mapeada);
                });
            }
        } catch (e) {}
    }
    
    sourceDB.close();
    return datos;
}

function extraerDeSQL(contenido, targetDB) {
    const tipoSQL = detectarTipoSQL(contenido);
    console.log(`Tipo SQL detectado: ${tipoSQL}`);
    
    let tablas;
    if (tipoSQL === 'sqlserver') {
        tablas = extraerTablasSQLServer(contenido);
    } else {
        tablas = extraerTablasMySQL(contenido);
    }
    
    console.log(`Tablas encontradas: ${tablas.length}`);
    
    const inserts = extraerInserts(contenido);
    console.log(`INSERTs encontrados: ${inserts.length}`);
    
    const datos = {};
    
    inserts.forEach(ins => {
        const tablaDestino = mapearTabla(ins.tabla);
        if (!tablaDestino) return;
        
        if (!datos[tablaDestino]) datos[tablaDestino] = [];
        
        const fila = {};
        ins.columnas.forEach((col, i) => {
            const campoDestino = mapearCampo(tablaDestino, col);
            fila[campoDestino] = ins.valores[i];
        });
        
        datos[tablaDestino].push(fila);
    });
    
    return datos;
}

function extraerDeJSON(contenido) {
    const data = JSON.parse(contenido);
    const datos = {};
    
    for (const [tabla, filas] of Object.entries(data)) {
        const tablaDestino = mapearTabla(tabla);
        if (!tablaDestino || !Array.isArray(filas)) continue;
        
        datos[tablaDestino] = filas.map(fila => {
            const mapeada = {};
            for (const [key, value] of Object.entries(fila)) {
                const campoDestino = mapearCampo(tablaDestino, key);
                mapeada[campoDestino] = value;
            }
            return mapeada;
        });
    }
    
    return datos;
}

function insertarDatos(db, datos) {
    const resultados = {};
    
    for (const [tabla, filas] of Object.entries(datos)) {
        if (filas.length === 0) continue;
        
        try {
            const columnas = Object.keys(filas[0]);
            const placeholders = columnas.map(() => '?').join(', ');
            const colNames = columnas.join(', ');
            
            const stmt = db.prepare(`INSERT OR REPLACE INTO ${tabla} (${colNames}) VALUES (${placeholders})`);
            
            let insertados = 0;
            const insertMany = db.transaction((items) => {
                for (const item of items) {
                    try {
                        stmt.run(...columnas.map(c => item[c]));
                        insertados++;
                    } catch (e) {}
                }
            });
            
            insertMany(filas);
            resultados[tabla] = { total: filas.length, insertados };
            console.log(`${tabla}: ${insertados}/${filas.length} registros insertados`);
        } catch (e) {
            resultados[tabla] = { error: e.message };
            console.error(`Error en ${tabla}:`, e.message);
        }
    }
    
    return resultados;
}

function migrar(archivoOrigen, dbDestinoPath = './priceless.db') {
    console.log('=== MIGRACION MONICA -> FACTULITE ===');
    console.log(`Origen: ${archivoOrigen}`);
    console.log(`Destino: ${dbDestinoPath}`);
    
    const info = detectarYLeerDB(archivoOrigen);
    
    if (info.error) {
        return { exito: false, error: info.error };
    }
    
    let datos;
    
    switch (info.tipo) {
        case 'sqlite':
            const dbTemp = new Database(dbDestinoPath);
            datos = extraerDeSQLite(info.path, dbTemp);
            dbTemp.close();
            break;
        case 'sql':
            const dbSQL = new Database(dbDestinoPath);
            datos = extraerDeSQL(info.contenido, dbSQL);
            dbSQL.close();
            break;
        case 'json':
            const dbJSON = new Database(dbDestinoPath);
            datos = extraerDeJSON(info.contenido, dbJSON);
            dbJSON.close();
            break;
        default:
            return { exito: false, error: 'Formato no reconocido' };
    }
    
    console.log('\nDatos extraidos:');
    for (const [tabla, filas] of Object.entries(datos)) {
        console.log(`  ${tabla}: ${filas.length} registros`);
    }
    
    const db = new Database(dbDestinoPath);
    const resultados = insertarDatos(db, datos);
    db.close();
    
    const resumen = {
        exito: true,
        origen: archivoOrigen,
        tipo: info.tipo,
        tablas: Object.keys(datos).length,
        resultados
    };
    
    console.log('\n=== MIGRACION COMPLETADA ===');
    return resumen;
}

function analizarEstructura(archivoPath) {
    console.log(`Analizando: ${archivoPath}`);
    
    const info = detectarYLeerDB(archivoPath);
    
    if (info.error) {
        return { error: info.error };
    }
    
    const analisis = {
        tipo: info.tipo,
        tablas: [],
        sugerencias: []
    };
    
    if (info.tipo === 'sql') {
        const tipoSQL = detectarTipoSQL(info.contenido);
        analisis.tipoSQL = tipoSQL;
        
        let tablas;
        if (tipoSQL === 'sqlserver') {
            tablas = extraerTablasSQLServer(info.contenido);
        } else {
            tablas = extraerTablasMySQL(info.contenido);
        }
        
        analisis.tablas = tablas.map(t => ({
            original: t.nombre,
            destino: mapearTabla(t.nombre) || 'NO MAPEADA',
            columnas: t.columnas.length
        }));
        
        tablas.forEach(t => {
            const destino = mapearTabla(t.nombre);
            if (!destino) {
                analisis.sugerencias.push(`Tabla "${t.nombre}" no tiene mapeo definido`);
            }
        });
    } else if (info.tipo === 'sqlite') {
        const db = new Database(info.path, { readonly: true });
        const tablas = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        
        analisis.tablas = tablas.map(({ name }) => ({
            original: name,
            destino: mapearTabla(name) || 'NO MAPEADA'
        }));
        
        db.close();
    } else if (info.tipo === 'json') {
        const data = JSON.parse(info.contenido);
        analisis.tablas = Object.keys(data).map(k => ({
            original: k,
            destino: mapearTabla(k) || 'NO MAPEADA'
        }));
    }
    
    return analisis;
}

module.exports = {
    migrar,
    analizarEstructura,
    detectarTipoSQL,
    mapearTabla,
    mapearCampo
};
