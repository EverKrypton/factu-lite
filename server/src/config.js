function getConfig(db) {
    const defaults = {
        nombre: 'FactuLite',
        ruc: '',
        direccion: '',
        telefono: '',
        slogan: 'La atencion es nuestra calidad',
        tipo_cambio_usd: 36.7120,
        numero_siguiente_factura: 1,
        numero_siguiente_ticket: 1,
        prefijo_factura: 'F',
        prefijo_ticket: 'T',
        digitos_correlativo: 10,
        impuesto_defecto: 0,
        descuento_distribuidor: 15,
        version: '2.1.0'
    };
    
    if (!db) return defaults;
    
    try {
        const config = db.prepare('SELECT * FROM config_empresa WHERE id = 1').get();
        if (config) {
            return { ...defaults, ...config };
        }
    } catch (e) {
    }
    
    return defaults;
}

module.exports = {
    nombre: 'FactuLite',
    ruc: '',
    direccion: '',
    telefono: '',
    version: '2.0.5',
    getConfig
};
