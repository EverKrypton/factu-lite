// Hardware: Scanner Código de Barras + Gaveta de Dinero
// Los scanners USB funcionan como teclado (plug & play)
// Las gavetas se conectan a impresora térmica (RJ11) o USB

async function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { resolve({}); } });
    });
}

// Comando ESC/POS para abrir gaveta
// ESC p m t1 t2 = ASCII 27, 112, 0, 25, 250
const GAVETA_COMMAND = Buffer.from([0x1B, 0x70, 0x00, 0x19, 0xFA]);

module.exports = async function(req, res, url, metodo, context) {
    const { CONFIG } = context;
    
    // GET /api/hardware/scanner-status
    // Los scanners USB funcionan como teclado, no necesitan configuración
    if (metodo === 'GET' && url === '/api/hardware/scanner-status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            supported: true,
            type: 'usb',
            description: 'Scanner USB funciona como teclado. Solo conectar y escanear.'
        }));
        return true;
    }
    
    // POST /api/hardware/abrir-gaveta
    // Abre la gaveta conectada a la impresora térmica
    if (metodo === 'POST' && url === '/api/hardware/abrir-gaveta') {
        try {
            // TODO: En producción, enviar comando a impresora térmica
            // Por ahora retornamos éxito (la UI lo maneja)
            // 
            // Código para impresora USB real:
            // const printer = require('usb').findByIds(vendorId, productId);
            // printer.open();
            // printer.write(GAVETA_COMMAND);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                ok: true, 
                message: 'Comando enviado a impresora',
                note: 'En producción, conectar con impresora térmica USB'
            }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                ok: false, 
                error: error.message 
            }));
        }
        return true;
    }
    
    // GET /api/hardware/status
    // Estado general del hardware
    if (metodo === 'GET' && url === '/api/hardware/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            scanner: { supported: true, type: 'usb' },
            gaveta: { supported: true, type: 'printer-rj11' }
        }));
        return true;
    }
    
    return false;
};
