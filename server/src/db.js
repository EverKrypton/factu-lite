const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

let defaultPath = './priceless.db';
let dbPath = defaultPath;
let db = null;
let configPath = './priceless_config.json';

function getSafeDataPath() {
    try {
        if (process.type === 'browser' || process.versions.electron) {
            const { app } = require('electron');
            const userDataPath = app.getPath('userData');
            if (!fs.existsSync(userDataPath)) fs.mkdirSync(userDataPath, { recursive: true });
            return userDataPath;
        }
    } catch(e) {}
    
    const execDir = path.dirname(process.execPath);
    const portableDir = path.join(execDir, 'data');
    if (!fs.existsSync(portableDir)) fs.mkdirSync(portableDir, { recursive: true });
    return portableDir;
}

function initDB(customPath = null) {
    if (customPath) {
        dbPath = customPath;
    } else {
        const safePath = getSafeDataPath();
        dbPath = path.join(safePath, 'priceless.db');
        configPath = path.join(safePath, 'priceless_config.json');
    }
    
    console.log('Inicializando SQLite en:', dbPath);
    
    db = new Database(dbPath);
    
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.pragma('synchronous = NORMAL');
    db.pragma('cache_size = -64000');
    db.pragma('temp_store = MEMORY');
    db.pragma('mmap_size = 268435456');
    
    crearTablas();
    crearIndices();
    console.log('SQLite inicializado correctamente');
    
    return db;
}

function crearIndices() {
    const indices = [
        'CREATE INDEX IF NOT EXISTS idx_facturas_fecha ON facturas(fecha)',
        'CREATE INDEX IF NOT EXISTS idx_facturas_cliente_id ON facturas(cliente_id)',
        'CREATE INDEX IF NOT EXISTS idx_facturas_estado ON facturas(estado)',
        'CREATE INDEX IF NOT EXISTS idx_facturas_usuario ON facturas(usuario)',
        'CREATE INDEX IF NOT EXISTS idx_factura_items_factura_id ON factura_items(factura_id)',
        'CREATE INDEX IF NOT EXISTS idx_tickets_fecha ON tickets(fecha)',
        'CREATE INDEX IF NOT EXISTS idx_tickets_usuario ON tickets(usuario)',
        'CREATE INDEX IF NOT EXISTS idx_ticket_items_ticket_id ON ticket_items(ticket_id)',
        'CREATE INDEX IF NOT EXISTS idx_productos_codigo_barra ON productos(codigo_barra)',
        'CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos(nombre)',
        'CREATE INDEX IF NOT EXISTS idx_kardex_producto_id ON kardex(producto_id)',
        'CREATE INDEX IF NOT EXISTS idx_kardex_fecha ON kardex(fecha)',
        'CREATE INDEX IF NOT EXISTS idx_cuentas_cobrar_estado ON cuentas_cobrar(estado)',
        'CREATE INDEX IF NOT EXISTS idx_cuentas_pagar_estado ON cuentas_pagar(estado)'
    ];
    
    indices.forEach(idx => {
        try { db.exec(idx); } catch(e) {}
    });
}

function optimizarDB() {
    if (!db) return;
    try {
        db.pragma('wal_checkpoint(TRUNCATE)');
        db.exec('VACUUM');
        db.pragma('ANALYZE');
        console.log('DB optimizada');
        return true;
    } catch(e) {
        console.error('Error optimizando DB:', e);
        return false;
    }
}

function crearTablas() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT DEFAULT '',
            rol TEXT DEFAULT 'caja',
            nombre TEXT DEFAULT '',
            activo INTEGER DEFAULT 1,
            primer_ingreso INTEGER DEFAULT 1,
            imprimir INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS bodegas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            principal INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo_barra TEXT,
            nombre TEXT NOT NULL,
            precio REAL DEFAULT 0,
            precio2 REAL DEFAULT 0,
            cantidad INTEGER DEFAULT 0,
            bodega_id INTEGER DEFAULT 1,
            imagen TEXT DEFAULT '',
            gramaje TEXT DEFAULT '',
            categoria TEXT DEFAULT 'General',
            stock_minimo INTEGER DEFAULT 0,
            costo REAL DEFAULT 0,
            unidad TEXT DEFAULT 'UN',
            numero_lote TEXT DEFAULT '',
            fecha_vencimiento_prod DATE,
            numero_serie TEXT DEFAULT '',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (bodega_id) REFERENCES bodegas(id)
        );

        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT,
            nombre TEXT NOT NULL,
            ruc TEXT DEFAULT '',
            direccion TEXT DEFAULT '',
            telefono TEXT DEFAULT '',
            email TEXT DEFAULT '',
            limite_credito REAL DEFAULT 0,
            dias_credito INTEGER DEFAULT 0,
            contacto TEXT DEFAULT '',
            activo INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS proveedores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT,
            nombre TEXT NOT NULL,
            ruc TEXT DEFAULT '',
            direccion TEXT DEFAULT '',
            telefono TEXT DEFAULT '',
            email TEXT DEFAULT '',
            contacto TEXT DEFAULT '',
            activo INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS facturas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT NOT NULL,
            cliente_id INTEGER,
            cliente_nombre TEXT DEFAULT '',
            cliente_ruc TEXT DEFAULT '',
            cliente_direccion TEXT DEFAULT '',
            subtotal REAL DEFAULT 0,
            descuento REAL DEFAULT 0,
            impuesto REAL DEFAULT 0,
            total REAL DEFAULT 0,
            metodo TEXT DEFAULT 'efectivo',
            terminos TEXT DEFAULT 'Contado',
            tipo_cliente TEXT DEFAULT '',
            estado TEXT DEFAULT 'activa',
            usuario TEXT DEFAULT '',
            grupo_facturacion TEXT DEFAULT '',
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
            fecha_vencimiento DATE,
            fecha_anulacion DATETIME,
            ref_cliente TEXT DEFAULT '',
            comprobante TEXT DEFAULT '',
            miscelaneos REAL DEFAULT 0,
            incluye_impuesto INTEGER DEFAULT 0,
            tipo_cambio REAL DEFAULT 1,
            slogan TEXT DEFAULT '',
            vendedor_nombre TEXT DEFAULT '',
            FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        );

        CREATE TABLE IF NOT EXISTS factura_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            factura_id INTEGER NOT NULL,
            producto_id INTEGER,
            codigo TEXT DEFAULT '',
            nombre TEXT NOT NULL,
            cantidad INTEGER DEFAULT 1,
            precio REAL DEFAULT 0,
            subtotal REAL DEFAULT 0,
            total REAL DEFAULT 0,
            unidad TEXT DEFAULT 'UN',
            descuento_pct REAL DEFAULT 0,
            impuesto_pct REAL DEFAULT 0,
            precio_usd REAL DEFAULT 0,
            FOREIGN KEY (factura_id) REFERENCES facturas(id),
            FOREIGN KEY (producto_id) REFERENCES productos(id)
        );

        CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT NOT NULL,
            subtotal REAL DEFAULT 0,
            descuento REAL DEFAULT 0,
            total REAL DEFAULT 0,
            metodo TEXT DEFAULT 'efectivo',
            usuario TEXT DEFAULT '',
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
            estado TEXT DEFAULT 'activa',
            fecha_anulacion DATETIME,
            vendedor_nombre TEXT DEFAULT '',
            cliente_nombre TEXT DEFAULT '',
            cliente_direccion TEXT DEFAULT '',
            slogan TEXT DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS ticket_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket_id INTEGER NOT NULL,
            producto_id INTEGER,
            codigo TEXT DEFAULT '',
            nombre TEXT NOT NULL,
            cantidad INTEGER DEFAULT 1,
            precio REAL DEFAULT 0,
            subtotal REAL DEFAULT 0,
            total REAL DEFAULT 0,
            unidad TEXT DEFAULT 'UN',
            codigo_producto TEXT DEFAULT '',
            FOREIGN KEY (ticket_id) REFERENCES tickets(id),
            FOREIGN KEY (producto_id) REFERENCES productos(id)
        );

        CREATE TABLE IF NOT EXISTS cuentas_cobrar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id INTEGER NOT NULL,
            cliente_nombre TEXT DEFAULT '',
            documento TEXT NOT NULL,
            monto_original REAL DEFAULT 0,
            monto_actual REAL DEFAULT 0,
            fecha_emision DATE DEFAULT CURRENT_DATE,
            fecha_vencimiento DATE,
            estado TEXT DEFAULT 'pendiente',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        );

        CREATE TABLE IF NOT EXISTS pagos_cobrar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cuenta_id INTEGER NOT NULL,
            monto REAL DEFAULT 0,
            metodo TEXT DEFAULT 'efectivo',
            referencia TEXT DEFAULT '',
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cuenta_id) REFERENCES cuentas_cobrar(id)
        );

        CREATE TABLE IF NOT EXISTS cuentas_pagar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            proveedor_id INTEGER NOT NULL,
            proveedor_nombre TEXT DEFAULT '',
            documento TEXT NOT NULL,
            monto_original REAL DEFAULT 0,
            monto_actual REAL DEFAULT 0,
            fecha_emision DATE DEFAULT CURRENT_DATE,
            fecha_vencimiento DATE,
            estado TEXT DEFAULT 'pendiente',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
        );

        CREATE TABLE IF NOT EXISTS pagos_pagar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cuenta_id INTEGER NOT NULL,
            monto REAL DEFAULT 0,
            metodo TEXT DEFAULT 'efectivo',
            referencia TEXT DEFAULT '',
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cuenta_id) REFERENCES cuentas_pagar(id)
        );

        CREATE TABLE IF NOT EXISTS compras (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT NOT NULL,
            proveedor_id INTEGER,
            proveedor TEXT DEFAULT '',
            items TEXT DEFAULT '[]',
            total REAL DEFAULT 0,
            estado TEXT DEFAULT 'pendiente',
            usuario TEXT DEFAULT '',
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
            fecha_recibido DATETIME,
            FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
        );

        CREATE TABLE IF NOT EXISTS kardex (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            producto_id INTEGER NOT NULL,
            producto_nombre TEXT DEFAULT '',
            tipo TEXT NOT NULL,
            cantidad INTEGER DEFAULT 0,
            costo_unitario REAL DEFAULT 0,
            costo_total REAL DEFAULT 0,
            referencia TEXT DEFAULT '',
            usuario TEXT DEFAULT '',
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (producto_id) REFERENCES productos(id)
        );

        CREATE TABLE IF NOT EXISTS cuentas_corrientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            numero_cuenta TEXT DEFAULT '',
            banco TEXT DEFAULT '',
            saldo_inicial REAL DEFAULT 0,
            saldo_actual REAL DEFAULT 0,
            activo INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS movimientos_bancarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cuenta_id INTEGER NOT NULL,
            tipo TEXT NOT NULL,
            monto REAL DEFAULT 0,
            beneficiario TEXT DEFAULT '',
            concepto TEXT DEFAULT '',
            referencia TEXT DEFAULT '',
            estado TEXT DEFAULT 'completado',
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cuenta_id) REFERENCES cuentas_corrientes(id)
        );

        CREATE TABLE IF NOT EXISTS cuentas_contables (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT NOT NULL,
            nombre TEXT NOT NULL,
            tipo TEXT DEFAULT 'mayor',
            naturaleza TEXT DEFAULT 'deudora',
            nivel INTEGER DEFAULT 1,
            padre_id INTEGER,
            acepta_movimientos INTEGER DEFAULT 0,
            activo INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (padre_id) REFERENCES cuentas_contables(id)
        );

        CREATE TABLE IF NOT EXISTS asientos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT NOT NULL,
            fecha DATE DEFAULT CURRENT_DATE,
            concepto TEXT DEFAULT '',
            referencia TEXT DEFAULT '',
            total REAL DEFAULT 0,
            estado TEXT DEFAULT 'activo',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS asiento_detalles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asiento_id INTEGER NOT NULL,
            cuenta_id INTEGER NOT NULL,
            cuenta_codigo TEXT DEFAULT '',
            cuenta_nombre TEXT DEFAULT '',
            debe REAL DEFAULT 0,
            haber REAL DEFAULT 0,
            FOREIGN KEY (asiento_id) REFERENCES asientos(id),
            FOREIGN KEY (cuenta_id) REFERENCES cuentas_contables(id)
        );

        CREATE TABLE IF NOT EXISTS config (
            clave TEXT PRIMARY KEY,
            valor TEXT DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS cortes_caja (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha DATE,
            usuario TEXT,
            efectivo_reportado REAL DEFAULT 0,
            transferencia_reportado REAL DEFAULT 0,
            tarjeta_reportado REAL DEFAULT 0,
            efectivo_sistema REAL DEFAULT 0,
            transferencia_sistema REAL DEFAULT 0,
            tarjeta_sistema REAL DEFAULT 0,
            total_sistema REAL DEFAULT 0,
            diferencia REAL DEFAULT 0,
            cantidad_ventas INTEGER DEFAULT 0,
            ventas_credito REAL DEFAULT 0,
            ventas_contado REAL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS lotes_facturacion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            grupo TEXT NOT NULL,
            cantidad INTEGER DEFAULT 0,
            usuario TEXT DEFAULT '',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS proformas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT NOT NULL,
            cliente_id INTEGER,
            cliente_nombre TEXT DEFAULT '',
            cliente_ruc TEXT DEFAULT '',
            subtotal REAL DEFAULT 0,
            descuento REAL DEFAULT 0,
            impuesto REAL DEFAULT 0,
            total REAL DEFAULT 0,
            validez INTEGER DEFAULT 30,
            estado TEXT DEFAULT 'pendiente',
            observaciones TEXT DEFAULT '',
            usuario TEXT DEFAULT '',
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
            fecha_vencimiento DATE,
            FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        );

        CREATE TABLE IF NOT EXISTS proforma_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            proforma_id INTEGER NOT NULL,
            producto_id INTEGER,
            codigo TEXT DEFAULT '',
            nombre TEXT NOT NULL,
            cantidad INTEGER DEFAULT 1,
            precio REAL DEFAULT 0,
            subtotal REAL DEFAULT 0,
            FOREIGN KEY (proforma_id) REFERENCES proformas(id),
            FOREIGN KEY (producto_id) REFERENCES productos(id)
        );

        CREATE TABLE IF NOT EXISTS modulos (
            id TEXT PRIMARY KEY,
            nombre TEXT NOT NULL,
            descripcion TEXT DEFAULT '',
            enabled INTEGER DEFAULT 1,
            icon TEXT DEFAULT '📦',
            orden INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS permisos_usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            modulo_id TEXT NOT NULL,
            puede_ver INTEGER DEFAULT 1,
            puede_crear INTEGER DEFAULT 0,
            puede_editar INTEGER DEFAULT 0,
            puede_eliminar INTEGER DEFAULT 0,
            puede_imprimir INTEGER DEFAULT 0,
            puede_exportar INTEGER DEFAULT 0,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
            FOREIGN KEY (modulo_id) REFERENCES modulos(id),
            UNIQUE(usuario_id, modulo_id)
        );

        CREATE TABLE IF NOT EXISTS config_empresa (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            nombre TEXT DEFAULT 'Mi Empresa',
            ruc TEXT DEFAULT '',
            direccion TEXT DEFAULT '',
            telefono TEXT DEFAULT '',
            slogan TEXT DEFAULT 'La atencion es nuestra calidad',
            tipo_cambio_usd REAL DEFAULT 36.7120,
            numero_siguiente_factura INTEGER DEFAULT 1,
            numero_siguiente_ticket INTEGER DEFAULT 1,
            prefijo_factura TEXT DEFAULT 'F',
            prefijo_ticket TEXT DEFAULT 'T',
            digitos_correlativo INTEGER DEFAULT 10,
            impuesto_defecto REAL DEFAULT 0,
            descuento_distribuidor REAL DEFAULT 15
        );

        CREATE TABLE IF NOT EXISTS devoluciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            factura_id INTEGER,
            ticket_id INTEGER,
            numero TEXT NOT NULL,
            motivo TEXT DEFAULT '',
            total REAL DEFAULT 0,
            usuario TEXT DEFAULT '',
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS devolucion_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            devolucion_id INTEGER NOT NULL,
            producto_id INTEGER,
            nombre TEXT NOT NULL,
            cantidad INTEGER DEFAULT 1,
            precio REAL DEFAULT 0,
            subtotal REAL DEFAULT 0,
            FOREIGN KEY (devolucion_id) REFERENCES devoluciones(id)
        );

        INSERT OR IGNORE INTO modulos (id, nombre, descripcion, enabled, icon, orden) VALUES
        ('pos', 'Punto de Venta', 'Facturación rápida y tickets', 1, '🛒', 1),
        ('facturacion', 'Facturación', 'Facturas y documentos', 1, '📄', 2),
        ('factura_lote', 'Factura por Lote', 'Facturación masiva mensual', 1, '📋', 3),
        ('inventario', 'Inventario', 'Control de productos y stock', 1, '📦', 4),
        ('clientes', 'Clientes', 'Cartera de clientes', 1, '👥', 5),
        ('proveedores', 'Proveedores', 'Directorio de proveedores', 1, '🏭', 6),
        ('cuentas_cobrar', 'Cuentas por Cobrar', 'Cartera y cobros', 1, '💰', 7),
        ('cuentas_pagar', 'Cuentas por Pagar', 'Pagos a proveedores', 1, '💳', 8),
        ('contabilidad', 'Contabilidad', 'Partida doble y reportes', 1, '📊', 9),
        ('kardex', 'Kárdex', 'Movimientos de inventario', 1, '🔄', 10),
        ('bancario', 'Bancario', 'Cuentas corrientes', 1, '🏦', 11),
        ('conciliacion', 'Conciliación', 'Conciliación bancaria', 1, '🔀', 12),
        ('corte_caja', 'Corte de Caja', 'Cierres y arqueos', 1, '💵', 13),
        ('reportes', 'Reportes', 'Reportes de ventas', 1, '📈', 14),
        ('proformas', 'Proformas', 'Cotizaciones', 1, '📝', 15),
        ('ordenes', 'Órdenes de Compra', 'Compras a proveedores', 1, '🛍️', 16),
        ('devoluciones', 'Devoluciones', 'Devoluciones de ventas', 1, '↩️', 17),
        ('backup', 'Backup/Restore', 'Respaldos de base de datos', 1, '💾', 18),
        ('scanner', 'Scanner Código Barras', 'Lectura de códigos', 1, '📷', 19),
        ('gaveta', 'Gaveta Electrónica', 'Caja de dinero', 1, '🔐', 20);

        INSERT OR IGNORE INTO config_empresa (id) VALUES (1);
    `);

    try {
        const productosCols = db.prepare("PRAGMA table_info(productos)").all();
        if (!productosCols.find(c => c.name === 'unidad')) {
            db.prepare('ALTER TABLE productos ADD COLUMN unidad TEXT DEFAULT "UN"').run();
        }
        if (!productosCols.find(c => c.name === 'numero_lote')) {
            db.prepare('ALTER TABLE productos ADD COLUMN numero_lote TEXT DEFAULT ""').run();
        }
        if (!productosCols.find(c => c.name === 'fecha_vencimiento_prod')) {
            db.prepare('ALTER TABLE productos ADD COLUMN fecha_vencimiento_prod DATE').run();
        }
        if (!productosCols.find(c => c.name === 'numero_serie')) {
            db.prepare('ALTER TABLE productos ADD COLUMN numero_serie TEXT DEFAULT ""').run();
        }
        
        const facturasCols = db.prepare("PRAGMA table_info(facturas)").all();
        if (!facturasCols.find(c => c.name === 'cliente_direccion')) {
            db.prepare('ALTER TABLE facturas ADD COLUMN cliente_direccion TEXT DEFAULT ""').run();
        }
        if (!facturasCols.find(c => c.name === 'terminos')) {
            db.prepare('ALTER TABLE facturas ADD COLUMN terminos TEXT DEFAULT "Contado"').run();
        }
        if (!facturasCols.find(c => c.name === 'tipo_cliente')) {
            db.prepare('ALTER TABLE facturas ADD COLUMN tipo_cliente TEXT DEFAULT ""').run();
        }
        if (!facturasCols.find(c => c.name === 'grupo_facturacion')) {
            db.prepare('ALTER TABLE facturas ADD COLUMN grupo_facturacion TEXT DEFAULT ""').run();
        }
        if (!facturasCols.find(c => c.name === 'fecha_vencimiento')) {
            db.prepare('ALTER TABLE facturas ADD COLUMN fecha_vencimiento DATE').run();
        }
        if (!facturasCols.find(c => c.name === 'fecha_anulacion')) {
            db.prepare('ALTER TABLE facturas ADD COLUMN fecha_anulacion DATETIME').run();
        }
        if (!facturasCols.find(c => c.name === 'ref_cliente')) {
            db.prepare('ALTER TABLE facturas ADD COLUMN ref_cliente TEXT DEFAULT ""').run();
        }
        if (!facturasCols.find(c => c.name === 'comprobante')) {
            db.prepare('ALTER TABLE facturas ADD COLUMN comprobante TEXT DEFAULT ""').run();
        }
        if (!facturasCols.find(c => c.name === 'miscelaneos')) {
            db.prepare('ALTER TABLE facturas ADD COLUMN miscelaneos REAL DEFAULT 0').run();
        }
        if (!facturasCols.find(c => c.name === 'incluye_impuesto')) {
            db.prepare('ALTER TABLE facturas ADD COLUMN incluye_impuesto INTEGER DEFAULT 0').run();
        }
        if (!facturasCols.find(c => c.name === 'tipo_cambio')) {
            db.prepare('ALTER TABLE facturas ADD COLUMN tipo_cambio REAL DEFAULT 1').run();
        }
        if (!facturasCols.find(c => c.name === 'slogan')) {
            db.prepare('ALTER TABLE facturas ADD COLUMN slogan TEXT DEFAULT ""').run();
        }
        if (!facturasCols.find(c => c.name === 'vendedor_nombre')) {
            db.prepare('ALTER TABLE facturas ADD COLUMN vendedor_nombre TEXT DEFAULT ""').run();
        }
        
        const facturaItemsCols = db.prepare("PRAGMA table_info(factura_items)").all();
        if (!facturaItemsCols.find(c => c.name === 'total')) {
            db.prepare('ALTER TABLE factura_items ADD COLUMN total REAL DEFAULT 0').run();
        }
        if (!facturaItemsCols.find(c => c.name === 'unidad')) {
            db.prepare('ALTER TABLE factura_items ADD COLUMN unidad TEXT DEFAULT "UN"').run();
        }
        if (!facturaItemsCols.find(c => c.name === 'descuento_pct')) {
            db.prepare('ALTER TABLE factura_items ADD COLUMN descuento_pct REAL DEFAULT 0').run();
        }
        if (!facturaItemsCols.find(c => c.name === 'impuesto_pct')) {
            db.prepare('ALTER TABLE factura_items ADD COLUMN impuesto_pct REAL DEFAULT 0').run();
        }
        if (!facturaItemsCols.find(c => c.name === 'precio_usd')) {
            db.prepare('ALTER TABLE factura_items ADD COLUMN precio_usd REAL DEFAULT 0').run();
        }
        
        const ticketsCols = db.prepare("PRAGMA table_info(tickets)").all();
        if (!ticketsCols.find(c => c.name === 'estado')) {
            db.prepare('ALTER TABLE tickets ADD COLUMN estado TEXT DEFAULT "activa"').run();
        }
        if (!ticketsCols.find(c => c.name === 'fecha_anulacion')) {
            db.prepare('ALTER TABLE tickets ADD COLUMN fecha_anulacion DATETIME').run();
        }
        if (!ticketsCols.find(c => c.name === 'vendedor_nombre')) {
            db.prepare('ALTER TABLE tickets ADD COLUMN vendedor_nombre TEXT DEFAULT ""').run();
        }
        if (!ticketsCols.find(c => c.name === 'cliente_nombre')) {
            db.prepare('ALTER TABLE tickets ADD COLUMN cliente_nombre TEXT DEFAULT ""').run();
        }
        if (!ticketsCols.find(c => c.name === 'cliente_direccion')) {
            db.prepare('ALTER TABLE tickets ADD COLUMN cliente_direccion TEXT DEFAULT ""').run();
        }
        if (!ticketsCols.find(c => c.name === 'slogan')) {
            db.prepare('ALTER TABLE tickets ADD COLUMN slogan TEXT DEFAULT ""').run();
        }
        
        const ticketItemsCols = db.prepare("PRAGMA table_info(ticket_items)").all();
        if (!ticketItemsCols.find(c => c.name === 'total')) {
            db.prepare('ALTER TABLE ticket_items ADD COLUMN total REAL DEFAULT 0').run();
        }
        if (!ticketItemsCols.find(c => c.name === 'unidad')) {
            db.prepare('ALTER TABLE ticket_items ADD COLUMN unidad TEXT DEFAULT "UN"').run();
        }
        if (!ticketItemsCols.find(c => c.name === 'codigo_producto')) {
            db.prepare('ALTER TABLE ticket_items ADD COLUMN codigo_producto TEXT DEFAULT ""').run();
        }
        
        const cortesCols = db.prepare("PRAGMA table_info(cortes_caja)").all();
        if (!cortesCols.find(c => c.name === 'ventas_credito')) {
            db.prepare('ALTER TABLE cortes_caja ADD COLUMN ventas_credito REAL DEFAULT 0').run();
        }
        if (!cortesCols.find(c => c.name === 'ventas_contado')) {
            db.prepare('ALTER TABLE cortes_caja ADD COLUMN ventas_contado REAL DEFAULT 0').run();
        }
        
        const clientesCols = db.prepare("PRAGMA table_info(clientes)").all();
        if (!clientesCols.find(c => c.name === 'contacto')) {
            db.prepare('ALTER TABLE clientes ADD COLUMN contacto TEXT DEFAULT ""').run();
        }
        
        console.log('✅ Migración completada');
    } catch (e) {
    }

    const countUsuarios = db.prepare('SELECT COUNT(*) as c FROM usuarios').get();
    if (countUsuarios.c === 0) {
        console.log('📝 Insertando datos iniciales...');
        
        const insertBodega = db.prepare('INSERT INTO bodegas (nombre, principal) VALUES (?, ?)');
        insertBodega.run('Principal', 1);
        insertBodega.run('Bodega 2', 0);
        insertBodega.run('Bodega 3', 0);
        insertBodega.run('Bodega 4', 0);

        const insertCuenta = db.prepare('INSERT INTO cuentas_contables (codigo, nombre, tipo, naturaleza, nivel, activo) VALUES (?, ?, ?, ?, ?, ?)');
        insertCuenta.run('1101', 'Caja', 'mayor', 'deudora', 1, 1);
        insertCuenta.run('1101-01', 'Caja General', 'auxiliar', 'deudora', 2, 1);
        insertCuenta.run('1102', 'Bancos', 'mayor', 'deudora', 1, 1);
        insertCuenta.run('1102-01', 'Cuenta Corriente', 'auxiliar', 'deudora', 2, 1);
        insertCuenta.run('1201', 'Cuentas por Cobrar - Corto Plazo', 'mayor', 'deudora', 1, 1);
        insertCuenta.run('1201-01', 'Clientes locales', 'auxiliar', 'deudora', 2, 1);
        insertCuenta.run('1202', 'Cuentas por Cobrar - Largo Plazo', 'mayor', 'deudora', 1, 1);
        insertCuenta.run('1301', 'Inventarios', 'mayor', 'deudora', 1, 1);
        insertCuenta.run('1301-01', 'Mercadería para venta', 'auxiliar', 'deudora', 2, 1);
        insertCuenta.run('2101', 'Cuentas por Pagar', 'mayor', 'acreedora', 1, 1);
        insertCuenta.run('2101-01', 'Proveedores locales', 'auxiliar', 'acreedora', 2, 1);
        insertCuenta.run('2201', 'Impuestos por Pagar', 'mayor', 'acreedora', 1, 1);
        insertCuenta.run('3101', 'Capital', 'mayor', 'acreedora', 1, 1);
        insertCuenta.run('3102', 'Utilidades Acumuladas', 'mayor', 'acreedora', 1, 1);
        insertCuenta.run('3103', 'Pérdidas Acumuladas', 'mayor', 'deudora', 1, 1);
        insertCuenta.run('4101', 'Ventas', 'mayor', 'acreedora', 1, 1);
        insertCuenta.run('4101-01', 'Venta de mercancía', 'auxiliar', 'acreedora', 2, 1);
        insertCuenta.run('4102', 'Otros Ingresos', 'mayor', 'acreedora', 1, 1);
        insertCuenta.run('5101', 'Costo de Ventas', 'mayor', 'deudora', 1, 1);
        insertCuenta.run('5101-01', 'Costo de mercancía vendida', 'auxiliar', 'deudora', 2, 1);
        insertCuenta.run('5201', 'Gastos de Operación', 'mayor', 'deudora', 1, 1);
        
        console.log('✅ Datos iniciales insertados');
    }
}

function getDB() {
    if (!db) {
        initDB();
    }
    return db;
}

function closeDB() {
    if (db) {
        db.close();
        db = null;
    }
}

function backup() {
    const backupPath = dbPath + '.backup';
    db.backup(backupPath);
    return backupPath;
}

function exportar() {
    const data = {
        usuarios: db.prepare('SELECT * FROM usuarios').all(),
        productos: db.prepare('SELECT * FROM productos').all(),
        clientes: db.prepare('SELECT * FROM clientes').all(),
        proveedores: db.prepare('SELECT * FROM proveedores').all(),
        facturas: db.prepare('SELECT * FROM facturas').all(),
        factura_items: db.prepare('SELECT * FROM factura_items').all(),
        tickets: db.prepare('SELECT * FROM tickets').all(),
        ticket_items: db.prepare('SELECT * FROM ticket_items').all(),
        cuentas_cobrar: db.prepare('SELECT * FROM cuentas_cobrar').all(),
        pagos_cobrar: db.prepare('SELECT * FROM pagos_cobrar').all(),
        cuentas_pagar: db.prepare('SELECT * FROM cuentas_pagar').all(),
        pagos_pagar: db.prepare('SELECT * FROM pagos_pagar').all(),
        compras: db.prepare('SELECT * FROM compras').all(),
        kardex: db.prepare('SELECT * FROM kardex').all(),
        cuentas_corrientes: db.prepare('SELECT * FROM cuentas_corrientes').all(),
        movimientos_bancarios: db.prepare('SELECT * FROM movimientos_bancarios').all(),
        cuentas_contables: db.prepare('SELECT * FROM cuentas_contables').all(),
        asientos: db.prepare('SELECT * FROM asientos').all(),
        asiento_detalles: db.prepare('SELECT * FROM asiento_detalles').all(),
        bodegas: db.prepare('SELECT * FROM bodegas').all(),
        config_empresa: db.prepare('SELECT * FROM config_empresa WHERE id = 1').get(),
        devoluciones: db.prepare('SELECT * FROM devoluciones').all(),
        devolucion_items: db.prepare('SELECT * FROM devolucion_items').all()
    };
    return data;
}

function crearCompatibilidad() {
    return {
        get usuarios() { return db.prepare('SELECT * FROM usuarios').all(); },
        set usuarios(val) { },
        get productos() { return db.prepare('SELECT * FROM productos').all(); },
        set productos(val) { },
        get clientes() { return db.prepare('SELECT * FROM clientes').all(); },
        set clientes(val) { },
        get proveedores() { return db.prepare('SELECT * FROM proveedores').all(); },
        set proveedores(val) { },
        get facturas() { return db.prepare('SELECT * FROM facturas').all(); },
        set facturas(val) { },
        get tickets() { return db.prepare('SELECT * FROM tickets').all(); },
        set tickets(val) { },
        get cuentasCobrar() { return db.prepare('SELECT * FROM cuentas_cobrar').all(); },
        set cuentasCobrar(val) { },
        get cuentasPagar() { return db.prepare('SELECT * FROM cuentas_pagar').all(); },
        set cuentasPagar(val) { },
        get compras() { return db.prepare('SELECT * FROM compras').all(); },
        set compras(val) { },
        get kardex() { return db.prepare('SELECT * FROM kardex').all(); },
        set kardex(val) { },
        get cuentasCorrientes() { return db.prepare('SELECT * FROM cuentas_corrientes').all(); },
        set cuentasCorientes(val) { },
        get movimientosBancarios() { return db.prepare('SELECT * FROM movimientos_bancarios').all(); },
        set movimientosBancarios(val) { },
        get ordenes() { return db.prepare('SELECT * FROM compras').all(); },
        set ordenes(val) { },
        get cuentasContables() { return db.prepare('SELECT * FROM cuentas_contables').all(); },
        set cuentasContables(val) { },
        get asientos() { return db.prepare('SELECT * FROM asientos').all(); },
        set asientos(val) { },
        get periodos() { return []; },
        set periodos(val) { },
        get bodega() { return db.prepare('SELECT * FROM bodegas').all(); },
        set bodega(val) { },
        get precios() { return { descuento_distribuidor: 15 }; },
        set precios(val) { },
        get configImpresoras() { 
            return {
                ticket: { nombre: '', tipo: 'usb', ip: '', puerto: 9100 },
                factura: { nombre: '', tipo: 'usb', ip: '', puerto: 9100 }
            };
        },
        set configImpresoras(val) { },
        get siguienteId() { return 1; },
        set siguienteId(val) { }
    };
}

function getConfigEmpresa() {
    const sdb = getDB();
    return sdb.prepare('SELECT * FROM config_empresa WHERE id = 1').get();
}

function updateConfigEmpresa(data) {
    const sdb = getDB();
    const fields = Object.keys(data).filter(k => k !== 'id');
    const setClause = fields.map(f => `${f} = @${f}`).join(', ');
    sdb.prepare(`UPDATE config_empresa SET ${setClause} WHERE id = 1`).run(data);
    return getConfigEmpresa();
}

module.exports = {
    initDB,
    getDB,
    closeDB,
    backup,
    exportar,
    dbPath: () => dbPath,
    crearCompatibilidad,
    getConfigEmpresa,
    updateConfigEmpresa,
    optimizarDB,
    getSafeDataPath
};
