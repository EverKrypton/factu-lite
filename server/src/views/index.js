// Auto-generated views file
// Extracted from main.js

const COLORES = {
    primary: '#183e6d',
    primaryLight: '#2a5290',
    primaryDark: '#0f2544',
    accent: '#f7ac0f',
    accentLight: '#ffc107',
    accentDark: '#e6a000',
    verde: '#56a805',
    verdeLight: '#7bc903',
    rojo: '#ed0707',
    rojoLight: '#ff3333',
    grisOscuro: '#183e6d',
    grisMedio: '#444444',
    grisClaro: '#dddddd',
    blanco: '#ffffff',
    fondo: '#f0f4f8',
    fondoCard: '#ffffff',
    texto: '#333333',
    textoLight: '#666666'
};
const DEFAULT_DB_PATH = './priceless.db';


const css = `
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
    :root { 
        --primary: ${COLORES.primary}; 
        --primaryLight: ${COLORES.primaryLight}; 
        --primaryDark: ${COLORES.primaryDark}; 
        --accent: ${COLORES.accent}; 
        --accentLight: ${COLORES.accentLight}; 
        --accentDark: ${COLORES.accentDark}; 
        --verde: ${COLORES.verde}; 
        --verdeLight: ${COLORES.verdeLight}; 
        --rojo: ${COLORES.rojo}; 
        --rojoLight: ${COLORES.rojoLight}; 
        --fondo: ${COLORES.fondo}; 
        --fondoCard: ${COLORES.fondoCard};
        --texto: ${COLORES.texto};
        --textoLight: ${COLORES.textoLight};
        --sidebar-width: 240px;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; }
    body { 
        font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif; 
        background: var(--fondo); 
        color: var(--texto); 
        line-height: 1.6; 
    }
    
    /* Header */
    .header { 
        background: linear-gradient(135deg, var(--primary) 0%, var(--primaryDark) 100%); 
        color: white; 
        padding: 12px 24px; 
        display: flex; 
        justify-content: space-between; 
        align-items: center;
        box-shadow: 0 4px 12px rgba(24, 62, 109, 0.3);
        flex-shrink: 0;
        min-height: 60px;
    }
    .header h1 { 
        color: var(--accent); 
        font-size: 18px; 
        font-weight: 700;
    }
    .header .logo { display: flex; align-items: center; gap: 10px; }
    .header .logo-icon {
        width: 32px;
        height: 32px;
        background: var(--accent);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        color: var(--primary);
        font-size: 16px;
    }
    
    /* Layout */
    .container { 
        display: flex; 
        min-height: calc(100vh - 60px);
        flex: 1;
    }
    .sidebar { 
        width: var(--sidebar-width); 
        background: var(--fondoCard); 
        padding: 15px 0;
        box-shadow: 2px 0 10px rgba(0,0,0,0.05);
        flex-shrink: 0;
        overflow-y: auto;
    }
    .sidebar a { 
        display: flex; 
        align-items: center; 
        gap: 10px; 
        padding: 12px 20px; 
        color: var(--textoLight); 
        text-decoration: none; 
        border-left: 4px solid transparent; 
        transition: all 0.2s ease; 
        font-weight: 500;
        font-size: 14px;
    }
    .sidebar a:hover, .sidebar a.active { 
        background: linear-gradient(90deg, rgba(247,172,15,0.15) 0%, transparent 100%); 
        border-left-color: var(--accent); 
        color: var(--primary);
    }
    .sidebar svg { width: 20px; height: 20px; flex-shrink: 0; }
    .main {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    
    /* Buttons */
    .btn { 
        padding: 10px 18px; 
        border: none; 
        border-radius: 8px; 
        cursor: pointer; 
        font-size: 14px; 
        transition: all 0.25s ease;
        font-weight: 600;
        white-space: nowrap;
    }
    .btn-primary { 
        background: linear-gradient(135deg, var(--accent) 0%, var(--accentDark) 100%); 
        color: var(--primary); 
    }
    .btn-primary:hover { transform: translateY(-2px); }
    .btn-verde { background: var(--verde); color: white; }
    .btn-rojo { background: var(--rojo); color: white; }
    
    /* Cards & Stats */
    .card { 
        background: var(--fondoCard); 
        border-radius: 12px; 
        padding: 20px; 
        box-shadow: 0 2px 15px rgba(0,0,0,0.06); 
    }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
    .stat { 
        background: linear-gradient(135deg, var(--primary) 0%, var(--primaryLight) 100%); 
        color: white; 
        border-radius: 12px; 
        padding: 16px;
    }
    .stat h3 { font-size: 24px; color: var(--accent); font-weight: 700; }
    .stat p { font-size: 12px; opacity: 0.9; }
    
    /* Productos Grid */
    .producto-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 14px;
    }
    .producto { 
        background: var(--fondoCard); 
        border-radius: 10px; 
        padding: 14px; 
        text-align: center; 
        cursor: pointer; 
        border: 2px solid transparent;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .producto:hover { border-color: var(--accent); transform: translateY(-2px); }
    .producto .codigo { font-size: 10px; color: #999; }
    .producto .nombre { font-weight: 600; margin: 8px 0; font-size: 12px; height: 36px; overflow: hidden; }
    .producto .precio { font-size: 18px; color: var(--primary); font-weight: 700; }
    .producto .stock { font-size: 11px; color: var(--textoLight); margin-top: 6px; }
    
    /* Carrito */
    .carrito-container {
        display: flex;
        gap: 20px;
        height: calc(100vh - 100px);
    }
    .carrito-productos { flex: 1; overflow-y: auto; }
    .carrito { 
        width: 320px;
        background: var(--fondoCard); 
        border-radius: 12px; 
        padding: 16px; 
        display: flex; 
        flex-direction: column; 
        box-shadow: 0 2px 15px rgba(0,0,0,0.06);
        flex-shrink: 0;
    }
    .carrito-item { 
        display: flex; 
        justify-content: space-between; 
        padding: 10px; 
        border-bottom: 1px solid #eee; 
        align-items: center;
    }
    .item-btns button { 
        width: 28px; 
        height: 28px; 
        background: #f0f0f0; 
        border: none; 
        border-radius: 6px; 
        cursor: pointer; 
        font-weight: bold;
    }
    .total { font-size: 24px; font-weight: 700; text-align: right; margin: 12px 0; color: var(--primary); }
    .metodo { padding: 10px; background: #f5f5f5; border-radius: 8px; text-align: center; cursor: pointer; font-size: 13px; }
    .metodo:hover, .metodo.sel { background: var(--accent); color: var(--primary); }
    
    /* Tables */
    table { width: 100%; border-collapse: collapse; background: var(--fondoCard); border-radius: 12px; overflow: hidden; }
    th { background: linear-gradient(135deg, var(--primary), var(--primaryLight)); color: white; padding: 12px; text-align: left; font-size: 13px; }
    td { padding: 12px; border-bottom: 1px solid #eee; font-size: 13px; }
    tr:hover { background: #f8f9fa; }
    
    /* Forms */
    input, select { 
        padding: 10px 14px; 
        border: 2px solid #e0e0e0; 
        border-radius: 8px; 
        font-size: 14px;
    }
    input:focus, select:focus { border-color: var(--accent); }
    
    /* Badges */
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .badge-verde { background: #e8f5e9; color: var(--verde); }
    .badge-rojo { background: #ffebee; color: var(--rojo); }
    .badge-primary { background: rgba(24, 62, 109, 0.1); color: var(--primary); }
    
    /* Login */
    .login { background: linear-gradient(135deg, var(--primary) 0%, var(--primaryDark) 50%, var(--primary) 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; }
    .login-box { background: white; padding: 32px; border-radius: 16px; width: 100%; max-width: 380px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .login-box h1 { color: var(--primary); text-align: center; margin-bottom: 4px; font-size: 22px; }
    .login-box .sub { color: var(--textoLight); text-align: center; margin-bottom: 24px; font-size: 13px; }
    .login-box button { width: 100%; padding: 14px; background: var(--accent); color: var(--primary); font-weight: 700; border: none; border-radius: 10px; cursor: pointer; }
    
    /* Title */
    .titulo-seccion { color: var(--primary); font-size: 20px; font-weight: 700; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 3px solid var(--accent); }
    
    /* Responsive Desktop Extra */
    @media (max-width: 1400px) {
        .stats { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 1200px) {
        .carrito-container { flex-direction: column; height: auto; }
        .carrito { width: 100%; }
        .producto-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
    }
    @media (max-width: 1024px) {
        :root { --sidebar-width: 200px; }
        .stats { grid-template-columns: repeat(2, 1fr); }
        .header h1 { font-size: 16px; }
    }
    @media (max-width: 768px) {
        :root { --sidebar-width: 100%; }
        .container { flex-direction: column; }
        .sidebar { width: 100%; padding: 10px 0; }
        .sidebar a { padding: 10px 16px; font-size: 13px; }
        .stats { grid-template-columns: 1fr; }
        .producto-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
        .carrito { width: 100%; }
        table { display: block; overflow-x: auto; }
        .header { padding: 10px 16px; }
        .main { padding: 16px; }
    }
    @media (max-width: 480px) {
        .stats { gap: 10px; }
        .stat { padding: 12px; }
        .stat h3 { font-size: 20px; }
        .btn { padding: 8px 14px; font-size: 13px; }
        .login-box { padding: 24px; margin: 16px; }
        input, select { padding: 8px 12px; font-size: 13px; }
    }
    /* Badges */
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .badge-verde { background: #e8f5e9; color: var(--verde); }
    .badge-rojo { background: #ffebee; color: var(--rojo); }
    .badge-primary { background: rgba(24, 62, 109, 0.1); color: var(--primary); }
    /* Login */
    .login { background: linear-gradient(135deg, var(--primary) 0%, var(--primaryDark) 50%, var(--primary) 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; }
    .login-box { background: white; padding: 32px; border-radius: 16px; width: 100%; max-width: 380px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .login-box h1 { color: var(--primary); text-align: center; margin-bottom: 4px; font-size: 22px; }
    .login-box .sub { color: var(--textoLight); text-align: center; margin-bottom: 24px; font-size: 13px; }
    .login-box button { width: 100%; padding: 14px; background: var(--accent); color: var(--primary); font-weight: 700; border: none; border-radius: 10px; cursor: pointer; }
    /* Title */
    .titulo-seccion { color: var(--primary); font-size: 20px; font-weight: 700; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 3px solid var(--accent); }
    .update-banner { background: linear-gradient(90deg, var(--accent), var(--accentLight)); color: var(--primary); padding: 14px 24px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; cursor: pointer; transition: all 0.3s; font-weight: 600; }
    .update-banner:hover { transform: scale(1.02); }
    .empty-state { text-align: center; padding: 60px 20px; color: var(--textoLight); }
    .empty-state svg { width: 80px; height: 80px; margin-bottom: 20px; opacity: 0.3; }
    
    /* Spinner */
    .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; vertical-align: middle; margin-right: 8px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    button.loading { opacity: 0.7; pointer-events: none; }
    
    /* Loading overlay */
    .loading-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.9); display: flex; justify-content: center; align-items: center; z-index: 9999; flex-direction: column; gap: 20px; }
    .loading-overlay .spinner { width: 50px; height: 50px; border-width: 4px; border-color: var(--primary); border-top-color: transparent; }
    .loading-overlay p { color: var(--primary); font-weight: 600; font-size: 18px; }
</style>`;


const icons = {
    home: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    caja: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="5" rx="1"/><path d="M22 7v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7"/><line x1="6" y1="12" x2="6" y2="12"/><line x1="12" y1="12" x2="12" y2="12"/></svg>',
    factura: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    buscar: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    orden: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    update: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>',
    imprimir: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
    usuario: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    clientes: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    proveedor: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    cartera: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    contabilidad: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>',
    balance: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18"/><path d="M3 9l9-6 9 6"/><path d="M3 15l9 6 9-6"/></svg>',
    inventario: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    kardex: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
    bancario: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    asientos: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    facturalote: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    reportes: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    corte: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    alerta: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
    export: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    import: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    warning: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
};

module.exports = {
    css,
    instalacion: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Instalación - Priceless Facturación</title>${css}</head>
<body>
<div class="login">
<div class="login-box">
<div style="text-align:center;margin-bottom:30px;">
<div class="logo-icon" style="width:80px;height:80px;font-size:40px;margin:0 auto 20px;">P</div>
<h1 style="font-size:28px;">Priceless Facturación</h1>
<p class="sub">Asistente de Instalación</p>
</div>

<div id="step1">
<h2 style="color:var(--primary);margin-bottom:20px;font-size:20px;">Paso 1: Ubicación de la Base de Datos</h2>
<p style="color:var(--textoLight);margin-bottom:15px;">La base de datos se guardará en:</p>
<input type="text" id="dbPath" style="width:100%;margin-bottom:12px;" readonly>
<button onclick="cambiarDB()" style="width:100%;margin-bottom:20px;background:var(--primaryLight);color:white;">Cambiar Ubicación</button>
<button onclick="nextStep(2)" style="width:100%;background:var(--accent);color:var(--primary);">Siguiente</button>
</div>

<div id="step2" style="display:none;">
<h2 style="color:var(--primary);margin-bottom:20px;font-size:20px;">Paso 2: Configurar Administrador</h2>
<p style="color:var(--textoLight);margin-bottom:15px;">Establece la contraseña del administrador:</p>
<input type="password" id="adminPass" placeholder="Contraseña" style="width:100%;margin-bottom:12px;">
<input type="password" id="adminPass2" placeholder="Confirmar" style="width:100%;margin-bottom:15px;">
<button id="btnStep2" onclick="nextStep(3)" style="width:100%;background:var(--accent);color:var(--primary);">Siguiente</button>
</div>

<div id="step3" style="display:none;">
<h2 style="color:var(--primary);margin-bottom:20px;font-size:20px;">Paso 3: Selección de Módulos</h2>
<p style="color:var(--textoLight);margin-bottom:15px;">Selecciona los módulos que deseas activar:</p>
<div style="max-height:280px;overflow-y:auto;margin-bottom:20px;">
<label style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;cursor:pointer;"><input type="checkbox" id="mod_pos" checked style="width:18px;height:18px;accent-color:var(--accent);"><span style="font-weight:500;">POS (Punto de Venta)</span></label>
<label style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;cursor:pointer;"><input type="checkbox" id="mod_facturacion" checked style="width:18px;height:18px;accent-color:var(--accent);"><span style="font-weight:500;">Facturación</span></label>
<label style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;cursor:pointer;"><input type="checkbox" id="mod_inventario" checked style="width:18px;height:18px;accent-color:var(--accent);"><span style="font-weight:500;">Inventario</span></label>
<label style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;cursor:pointer;"><input type="checkbox" id="mod_clientes" checked style="width:18px;height:18px;accent-color:var(--accent);"><span style="font-weight:500;">Clientes</span></label>
<label style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;cursor:pointer;"><input type="checkbox" id="mod_proveedores" checked style="width:18px;height:18px;accent-color:var(--accent);"><span style="font-weight:500;">Proveedores</span></label>
<label style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;cursor:pointer;"><input type="checkbox" id="mod_cxc" checked style="width:18px;height:18px;accent-color:var(--accent);"><span style="font-weight:500;">Cuentas por Cobrar</span></label>
<label style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;cursor:pointer;"><input type="checkbox" id="mod_cxp" checked style="width:18px;height:18px;accent-color:var(--accent);"><span style="font-weight:500;">Cuentas por Pagar</span></label>
<label style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;cursor:pointer;"><input type="checkbox" id="mod_contabilidad" checked style="width:18px;height:18px;accent-color:var(--accent);"><span style="font-weight:500;">Contabilidad</span></label>
<label style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;cursor:pointer;"><input type="checkbox" id="mod_kardex" checked style="width:18px;height:18px;accent-color:var(--accent);"><span style="font-weight:500;">Kárdex</span></label>
<label style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;cursor:pointer;"><input type="checkbox" id="mod_bancario" checked style="width:18px;height:18px;accent-color:var(--accent);"><span style="font-weight:500;">Bancario</span></label>
<label style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;cursor:pointer;"><input type="checkbox" id="mod_reportes" checked style="width:18px;height:18px;accent-color:var(--accent);"><span style="font-weight:500;">Reportes</span></label>
<label style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;cursor:pointer;"><input type="checkbox" id="mod_proformas" checked style="width:18px;height:18px;accent-color:var(--accent);"><span style="font-weight:500;">Proformas</span></label>
</div>
<button onclick="finalizarInstalacion()" style="width:100%;background:var(--accent);color:var(--primary);">Finalizar Instalación</button>
</div>

<div id="step4" style="display:none;">
<h2 style="color:var(--primary);margin-bottom:20px;font-size:20px;">Instalación Completada</h2>
<div style="background:var(--primaryLight);color:white;padding:20px;border-radius:10px;margin-bottom:20px;">
<p style="font-weight:bold;margin-bottom:10px;">Servidor activo en:</p>
<p style="font-size:18px;">http://localhost:5000</p>
</div>
<div style="background:white;padding:20px;border-radius:10px;margin-bottom:20px;text-align:center;">
<p style="font-weight:bold;color:var(--primary);margin-bottom:15px;">Para acceder desde otras PCs:</p>
<p style="font-size:18px;color:var(--accent);" id="ipRed">Cargando...</p>
<p style="font-size:14px;color:var(--textoLight);margin-top:10px;">Users: http://[IP]:5000</p>
</div>
<div style="background:#e8f5e9;padding:15px;border-radius:10px;margin-bottom:20px;">
<p style="color:green;font-weight:bold;">Ejemplos de IP en tu red:</p>
<p style="font-size:13px;color:var(--textoLight);">192.168.1.100, 192.168.1.50, 10.0.0.5</p>
</div>
<button onclick="irAlSistema()" style="width:100%;background:var(--accent);color:var(--primary);">Ir al Sistema</button>
</div>

<div id="error" style="display:none;background:#ffebee;color:#c62828;padding:14px;border-radius:8px;margin-bottom:15px;font-weight:500;"></div>
</div></div>
<script>
let currentDbPath = '';
async function init(){
    const r = await fetch('/api/instalacion');
    const d = await r.json();
    currentDbPath = d.db_path;
    document.getElementById('dbPath').value = d.db_path;
    // Obtener IP de red
    const sr = await fetch('/api/servidor');
    const sd = await sr.json();
    document.getElementById('ipRed').innerHTML = 'http://'+sd.ip+':5000';
}
async function cambiarDB(){
    const nuevaRuta = prompt('Nueva ruta para la base de datos:', currentDbPath);
    if(nuevaRuta && nuevaRuta !== currentDbPath){
        currentDbPath = nuevaRuta;
        document.getElementById('dbPath').value = nuevaRuta;
    }
}
function nextStep(step){
    if(step === 3){
        const btn = document.getElementById('btnStep2');
        btn.classList.add('loading');
        btn.innerHTML = '<span class="spinner"></span>Guardando...';
        const p1 = document.getElementById('adminPass').value;
        const p2 = document.getElementById('adminPass2').value;
        if(p1 !== p2){ showError('Las contraseñas no coinciden'); btn.classList.remove('loading'); btn.textContent = 'Siguiente'; return; }
        if(p1.length < 4){ showError('La contraseña debe tener al menos 4 caracteres'); btn.classList.remove('loading'); btn.textContent = 'Siguiente'; return; }
        btn.classList.remove('loading');
        btn.textContent = 'Siguiente';
    }
    document.querySelectorAll('#step1,#step2,#step3,#step4').forEach(el => el.style.display = 'none');
    document.getElementById('step'+step).style.display = 'block';
}
async function finalizarInstalacion(){
    const p1 = document.getElementById('adminPass').value;
    const p2 = document.getElementById('adminPass2').value;
    if(p1 !== p2){ showError('Las contraseñas no coinciden'); return; }
    if(p1.length < 4){ showError('La contraseña debe tener al menos 4 caracteres'); return; }
    const modulos = ['pos','facturacion','inventario','clientes','proveedores','cxc','cxp','contabilidad','kardex','bancario','reportes','proformas'];
    const activos = modulos.filter(m => document.getElementById('mod_'+m)?.checked);
    await fetch('/api/instalacion', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({db_path:currentDbPath})});
    await fetch('/api/usuario', {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id:1, password:p1, primer_ingreso:false})});
    await fetch('/api/modulos', {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({activos})});
    nextStep(4);
    // Abrir instrucciones automáticamente
    window.open('/instrucciones.html', '_blank');
}
function irAlSistema(){ location.href='/login'; }
function showError(msg){ document.getElementById('error').textContent=msg; document.getElementById('error').style.display='block'; }
init();
</script></body></html>`,
    login: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Login - Priceless Imports</title>${css}</head>
<body>
<div class="login">
<div class="login-box">
<div class="logo-icon" style="margin: 0 auto 20px;">P</div>
<h1>PRICELESS IMPORTS</h1>
<p class="sub">Sistema de Facturación v1.0.7</p>
<div class="error" id="error" style="display:none; background:#ffebee; color:#c62828; padding:14px; border-radius:8px; margin-bottom:15px; font-weight:500;"></div>
<input type="text" id="user" placeholder="Usuario" style="width:100%; margin-bottom:12px;">
<input type="password" id="pass" placeholder="Contraseña" style="width:100%; margin-bottom:20px;">
<button onclick="login()">INGRESAR AL SISTEMA</button>
<p style="margin-top:24px;font-size:12px;color:#999;text-align:center;">Desarrollado por <a href="https://t.me/ograinhard" target="_blank" style="color:var(--accent);text-decoration:none;font-weight:600;">@ograinhard</a></p>
</div></div>
<div id="setupModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,37,68,0.95); justify-content:center; align-items:center; z-index:1000;">
<div class="login-box" style="width:420px;">
<h1 style="font-size:24px;">Configurar Cuenta</h1>
<p class="sub">Establece tu contraseña de acceso</p>
<input type="password" id="newPass" placeholder="Nueva Contraseña" style="width:100%;margin-bottom:12px;">
<input type="password" id="confirmPass" placeholder="Confirmar Contraseña" style="width:100%;margin-bottom:20px;">
<button onclick="guardarPassword()">GUARDAR CONTRASEÑA</button>
</div>
</div>
<script>
let tempUsuario = null;
async function login() {
const u = document.getElementById('user').value;
const p = document.getElementById('pass').value;
if(!u || !p){ document.getElementById('error').textContent='Ingresa usuario y contraseña'; document.getElementById('error').style.display='block'; return; }

const btn = document.querySelector('button');
btn.classList.add('loading');
btn.innerHTML = '<span class="spinner"></span>Ingresando...';

try {
    const r = await fetch('/api/login', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username:u, password:p})});
    const d = await r.json();
    if(d.ok){ 
        localStorage.setItem('usuario', JSON.stringify(d.usuario)); 
        localStorage.setItem('config', JSON.stringify(d.config)); 
        if(d.primer_ingreso){
            tempUsuario = d.usuario;
            document.getElementById('setupModal').style.display = 'flex';
            btn.classList.remove('loading');
            btn.textContent = 'INGRESAR AL SISTEMA';
        } else {
            location.href='/dashboard'; 
        }
    }
    else{ 
        document.getElementById('error').textContent=d.error; 
        document.getElementById('error').style.display='block';
        btn.classList.remove('loading');
        btn.textContent = 'INGRESAR AL SISTEMA';
    }
} catch(e) {
    document.getElementById('error').textContent='Error de conexión';
    document.getElementById('error').style.display='block';
    btn.classList.remove('loading');
    btn.textContent = 'INGRESAR AL SISTEMA';
}
}
async function guardarPassword(){
const p1 = document.getElementById('newPass').value;
const p2 = document.getElementById('confirmPass').value;
if(p1 !== p2){ alert('Las contraseñas no coinciden'); return; }
if(p1.length < 4){ alert('La contraseña debe tener al menos 4 caracteres'); return; }
await fetch('/api/usuario', {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id:tempUsuario.id, password:p1, primer_ingreso:false})});
alert('Contraseña guardada. Por favor ingresa de nuevo.');
location.reload();
}
document.addEventListener('keypress',function(e){ if(e.key==='Enter') login(); });
</script></body></html>`,
    dashboard: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Dashboard - Priceless Imports</title>${css}</head>
<body>
<div class="header">
<div class="logo">
<div class="logo-icon">P</div>
<h1>PRICELESS IMPORTS</h1>
</div>
<div style="display:flex;align-items:center;gap:15px;">
<span id="userName" style="color:var(--accent);font-weight:600;"></span>
<span id="userRole" style="color:white;opacity:0.8;font-size:13px;"></span>
<a href="/" onclick="logout()" style="color:white;text-decoration:none;font-weight:500;">Cerrar Sesión</a>
</div></div>
<div class="container">
<div class="sidebar">
<a href="/dashboard" class="active">${icons.home} Inicio</a>
<a href="/pos">${icons.caja} Punto de Venta</a>
<a href="/inventario">${icons.buscar} Inventario</a>
<a href="/kardex" id="linkKardex" style="display:none;">${icons.inventario} Kárdex</a>
<a href="/clientes">${icons.clientes} Clientes</a>
<a href="/proveedores">${icons.proveedor} Proveedores</a>
<a href="/cartera">${icons.cartera} Cartera</a>
<a href="/bancario" id="linkBancario" style="display:none;">${icons.bancario} Cuentas Corrientes</a>
<a href="/contabilidad">${icons.contabilidad} Contabilidad</a>
<a href="/asientos" id="linkAsientos" style="display:none;">${icons.asientos} Asientos</a>
<a href="/balance" id="linkBalance" style="display:none;">${icons.balance} Balance</a>
<a href="/facturas">${icons.factura} Facturas</a>
<a href="/factura-lote" id="linkFacturaLote" style="display:none;">${icons.facturalote} Factura Lote</a>
<a href="/ordenes">${icons.orden} Órdenes</a>
<a href="/compras" id="linkCompras" style="display:none;">${icons.orden} Compras</a>
<a href="#" id="linkCorteCaja" onclick="hacerCorteCaja()" style="display:none;">${icons.corte} Corte de Caja</a>
<a href="/reportes" id="linkReportes" style="display:none;">${icons.reportes} Reportes</a>
<a href="/usuarios" id="linkUsuarios" style="display:none;">${icons.usuario} Usuarios</a>
</div>
<div class="main">
<div class="update-banner" id="updateBanner" onclick="actualizar()" style="display:none;">
<span>Nueva versión disponible</span>
<span>${icons.update} Actualizar</span>
</div>
<h2 class="titulo-seccion">Dashboard</h2>
<div class="stats" id="stats"></div>
<div class="card"><h2 style="color:var(--primary);margin-bottom:20px;font-size:20px;">Últimas Transacciones</h2>
<div id="ultimas"></div></div>
</div></div>
<script>
let usuario = JSON.parse(localStorage.getItem('usuario')||'{}');
if(!usuario.id) location.href='/';
document.getElementById('userName').textContent = usuario.nombre;
document.getElementById('userRole').textContent = '(' + usuario.rol + ')';

if(usuario.rol === 'admin') {
    document.getElementById('linkUsuarios').style.display = 'flex';
    document.getElementById('linkAsientos').style.display = 'flex';
    document.getElementById('linkBalance').style.display = 'flex';
    document.getElementById('linkKardex').style.display = 'flex';
    document.getElementById('linkBancario').style.display = 'flex';
    document.getElementById('linkFacturaLote').style.display = 'flex';
}

// Solo admin y caja ven reportes
if(usuario.rol === 'admin' || usuario.rol === 'caja') {
    document.getElementById('linkReportes').style.display = 'flex';
    document.getElementById('linkCorteCaja').style.display = 'flex';
}

// Bodega solo ve inventario en sidebar
if(usuario.rol === 'bodega') {
    // Simple sidebar for bodega - avoiding template issues
}

// Compras visible para admin y bodega
if(usuario.rol === 'admin' || usuario.rol === 'bodega') {
    document.getElementById('linkCompras').style.display = 'flex';
}

async function hacerCorteCaja(){
    const fecha = new Date().toISOString().split('T')[0];
    const ventas = await fetch('/api/facturas').then(r=>r.json()).then(d=>d.filter(v=>v.fecha.startsWith(fecha)));
    const ef = ventas.filter(v=>v.metodo==='efectivo').reduce((s,v)=>s+v.total,0);
    const tr = ventas.filter(v=>v.metodo==='transferencia').reduce((s,v)=>s+v.total,0);
    const tj = ventas.filter(v=>v.metodo==='tarjeta').reduce((s,v)=>s+v.total,0);
    const repEf = parseFloat(prompt('Efectivo reportado:', ef.toFixed(2)));
    if(isNaN(repEf))return;
    const repTr = parseFloat(prompt('Transferencia reportada:', tr.toFixed(2)));
    if(isNaN(repTr))return;
    const repTj = parseFloat(prompt('Tarjeta reportada:', tj.toFixed(2)));
    if(isNaN(repTj))return;
    await fetch('/api/corte-caja', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({usuario:usuario.nombre, efectivo_reportado:repEf, transferencia_reportado:repTr, tarjeta_reportado:repTj})});
    alert('Corte de caja guardado');
}
async function loadStats(){
const d = await fetch('/api/dashboard').then(r=>r.json());
document.getElementById('stats').innerHTML = '<div class="stat"><h3>C$ '+d.ventasHoy.toFixed(2)+'</h3><p>Ventas Hoy</p></div><div class="stat"><h3>'+d.facturasHoy+'</h3><p>Transacciones</p></div><div class="stat"><h3>'+d.productos+'</h3><p>Productos</p></div><div class="stat"><h3>'+d.productosBajos+'</h3><p>Stock Bajo</p></div>';
const alertas = d.alertasStock && d.alertasStock.length > 0 ? '<div style="margin-top:15px;padding:15px;background:#fff3cd;border-radius:8px;border-left:4px solid var(--rojo);"><h4 style="color:var(--rojo);margin-bottom:10px;">Alertas de Stock Minimo</h4>' + d.alertasStock.map(p => '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;"><span>'+p.nombre+'</span><span style="color:var(--rojo);font-weight:600;">Stock: '+p.cantidad+' / Min: '+p.stock_minimo+'</span></div>').join('') + '</div>' : '';
const f = await fetch('/api/facturas').then(r=>r.json());
document.getElementById('ultimas').innerHTML = f.slice(0,5).map(t=>'<div class="carrito-item"><div><strong>'+t.numero+'</strong><br><small style="color:var(--textoLight);">'+new Date(t.fecha).toLocaleString()+'</small></div><div style="text-align:right;"><strong style="color:var(--primary);">C$ '+t.total.toFixed(2)+'</strong><br><span class="badge '+(t.tipo==='factura'?'badge-verde':'badge-primary')+'">'+t.tipo+'</span></div></div>').join('')||'<div class="empty-state"><p>Sin transacciones aún</p></div>';
}
async function checkUpdate(){ const u = await fetch('/api/actualizar').then(r=>r.json()); if(u.disponible) document.getElementById('updateBanner').style.display='flex'; }
function actualizar(){ alert('Descargando actualización...'); }
function logout(){ localStorage.clear(); location.href='/'; }
loadStats(); checkUpdate();
</script></body></html>`,
    pos: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Punto de Venta - Priceless Imports</title>${css}</head>
<body>
<div class="header">
<div class="logo">
<div class="logo-icon">P</div>
<h1>PRICELESS IMPORTS - PUNTO DE VENTA</h1>
</div>
<div><a href="/dashboard" style="color:white;text-decoration:none;font-weight:500;">← Volver</a></div>
</div>
<div class="container">
<div class="main" style="display:flex;flex-direction:column;height:calc(100vh - 60px);">
<div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
<input id="buscar" placeholder="Código o buscar producto..." style="flex:1;min-width:200px;" onkeyup="render()">
<select id="tipoCliente" onchange="render()" style="padding:10px 16px;border:2px solid var(--accent);border-radius:8px;font-size:14px;font-weight:500;background:white;">
<option value="publico">Público General</option>
<option value="distribuidor">Distribuidor (-15%)</option>
</select>
<select id="clienteSelect" onchange="seleccionarCliente()" style="padding:10px 16px;border:2px solid var(--primary);border-radius:8px;font-size:14px;background:white;flex:1;min-width:200px;">
<option value="">-- Seleccionar Cliente --</option>
</select>
</div>
<h2 class="titulo-seccion">Productos</h2>
<div class="producto-grid" id="grid" style="flex:1;overflow-y:auto;"></div>
</div>
<div class="carrito">
<h2 style="color:var(--primary);font-size:20px;margin-bottom:16px;">Carrito <span id="count" style="color:var(--accent);">0</span> <span id="tipoLabel" style="font-size:14px;color:#666;margin-left:10px;"></span></h2>
<div style="margin-bottom:15px;padding:12px;background:#f8f9fa;border-radius:8px;">
    <div style="font-weight:600;color:var(--primary);margin-bottom:8px;">Datos del Cliente (opcional)</div>
    <input id="clienteNombre" placeholder="Nombre del cliente" style="width:100%;padding:8px;margin-bottom:6px;border:1px solid #ddd;border-radius:4px;">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
        <input id="clienteRUC" placeholder="RUC/Cédula" style="padding:8px;border:1px solid #ddd;border-radius:4px;">
        <input id="clienteTelefono" placeholder="Teléfono" style="padding:8px;border:1px solid #ddd;border-radius:4px;">
    </div>
</div>
<div id="items" style="flex:1;overflow-y:auto;"></div>
<div class="total">Total: <span id="total" style="color:var(--accent);">C$ 0.00</span></div>
<div style="margin-bottom:12px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <label style="font-weight:600;color:var(--primary);">Recibido:</label>
        <input id="recibido" type="number" placeholder="0.00" style="flex:1;padding:10px;border:2px solid var(--primary);border-radius:6px;font-size:16px;font-weight:600;">
    </div>
    <div style="text-align:right;font-size:18px;font-weight:700;color:var(--verde);">Cambio: <span id="cambio">C$ 0.00</span></div>
</div>
<div style="display:flex;gap:10px;margin-bottom:18px;">
<div class="metodo sel" onclick="selPago(this)">Efectivo</div>
<div class="metodo" onclick="selPago(this)">Transferencia</div>
<div class="metodo" onclick="selPago(this)">Tarjeta</div>
<div class="metodo" onclick="selPago(this)" style="background:var(--primaryLight);color:white;">Crédito</div>
</div>
<div style="display:flex;gap:10px;">
<button class="btn btn-primary" onclick="hacer('factura')" style="flex:2;padding:18px;font-size:16px;">FACTURA</button>
<button class="btn" onclick="hacer('ticket')" style="flex:1;background:var(--primary);color:white;">Ticket</button>
<button class="btn btn-rojo" onclick="limpiar()" style="flex:1;">Limpiar</button>
</div></div></div>
<script>
let carousel = [], productos = [], clientes = [], metodoPago = 'efectivo', tipoCliente = 'publico', clienteId = null;
async function init(){ 
    productos = await fetch('/api/productos').then(r=>r.json()); 
    clientes = await fetch('/api/clientes').then(r=>r.json());
    const select = document.getElementById('clienteSelect');
    select.innerHTML = '<option value="">-- Seleccionar Cliente --</option>' + 
        clientes.filter(c=>c.activo).map(c=>'<option value="'+c.id+'">'+c.nombre+' (Lím: C$ '+c.limite_credito.toFixed(0)+')</option>').join('');
    render(); 
}
function render(){
    const f = document.getElementById('buscar').value.toLowerCase();
    const dc = tipoCliente === 'distribuidor' ? 0.85 : 1;
    document.getElementById('tipoLabel').textContent = tipoCliente === 'distribuidor' ? '(Precio Distribuidor -15%)' : '';
    document.getElementById('grid').innerHTML = productos.filter(p=>f===''||p.codigo_barra.toLowerCase().includes(f)||p.nombre.toLowerCase().includes(f)).map(p=>'<div class="producto" onclick="agregar('+p.id+')"><div class="codigo">'+p.codigo_barra+'</div><div class="nombre">'+p.nombre+'</div><div class="precio">C$ '+(p.precio*dc).toFixed(2)+'</div><div class="stock">Stock: '+p.cantidad+'</div></div>').join('')||'<div class="empty-state"><p>No hay productos</p></div>';
}
function seleccionarCliente(){
    const sel = document.getElementById('clienteSelect');
    if(sel.value){
        const c = clientes.find(x=>x.id === parseInt(sel.value));
        if(c){ 
            clienteId = c.id; 
            document.getElementById('clienteNombre').value = c.nombre;
            document.getElementById('clienteRUC').value = c.ruc;
            document.getElementById('clienteTelefono').value = c.telefono;
            document.getElementById('tipoCliente').value = 'credito';
            tipoCliente = 'credito';
            render();
        }
    } else {
        clienteId = null;
    }
}
document.getElementById('buscar').addEventListener('keyup', function(e){ if(e.key==='Enter'){ const cod=this.value.trim(); const p=productos.find(x=>x.codigo_barra===cod); if(p){agregar(p.id); this.value='';} } });
document.getElementById('recibido').addEventListener('input', function(){ 
    const total=parseFloat(document.getElementById('total').textContent.replace('C$ ',''))||0; 
    const rec=parseFloat(this.value)||0; 
    const cambio=Math.max(0,rec-total); 
    document.getElementById('cambio').textContent='C$ '+cambio.toFixed(2); 
});
}
function agregar(id){
const p = productos.find(x=>x.id===id); if(!p)return;
const dc = tipoCliente === 'distribuidor' ? 0.85 : 1;
const precio = p.precio * dc;
const ex = carousel.find(c=>c.id===id);
if(ex){ if(ex.cantidad<p.cantidad) ex.cantidad++; }
else{ if(p.cantidad>0) carousel.push({id, nombre:p.nombre, precio:precio, cantidad:1}); }
renderCarrito();
}
function renderCarrito(){
let total = 0;
document.getElementById('items').innerHTML = carousel.map((c,i)=>{ total+=c.cantidad*c.precio; return '<div class="carrito-item"><div><div style="font-weight:600;">'+c.nombre+'</div><div style="font-size:13px;color:#666;">C$ '+c.precio.toFixed(2)+' x '+c.cantidad+'</div></div><div class="item-btns"><button onclick="cambiar('+i+',1)">+</button><button onclick="cambiar('+i+',-1)">-</button><button onclick="quitar('+i+')" style="color:var(--rojo);">×</button></div></div>'; }).join('')||'<div class="empty-state"><p>Carrito vacío</p></div>';
document.getElementById('total').textContent = 'C$ '+total.toFixed(2);
document.getElementById('count').textContent = carousel.length;
}
function cambiar(i,delta){ carousel[i].cantidad+=delta; if(carousel[i].cantidad<=0) carousel.splice(i,1); renderCarrito(); }
function quitar(i){ carousel.splice(i,1); renderCarrito(); }
function limpiar(){ if(confirm('Vaciar carrito?')){ carousel=[]; renderCarrito(); }}
function selPago(el){ document.querySelectorAll('.metodo').forEach(e=>e.classList.remove('sel')); el.classList.add('sel'); metodoPago = el.textContent.toLowerCase(); if(metodoPago === 'crédito'){ document.getElementById('recibido').value = ''; document.getElementById('recibido').disabled = true; } else { document.getElementById('recibido').disabled = false; } }
async function hacer(tipo){
if(carousel.length===0)return;
const btn = event.target;
const originalText = btn.innerHTML;
btn.classList.add('loading');
btn.innerHTML = '<span class="spinner"></span>Procesando...';

const u = JSON.parse(localStorage.getItem('usuario')||'{}');
const total = carousel.reduce((s,c)=>s+c.precio*c.cantidad,0);
const endpoint = tipo==='factura'? '/api/factura':'/api/ticket';
const clienteNombre = document.getElementById('clienteNombre').value;
const clienteRUC = document.getElementById('clienteRUC').value;
const clienteTelefono = document.getElementById('clienteTelefono').value;
const recibido = parseFloat(document.getElementById('recibido').value) || 0;
const terminos = metodoPago === 'crédito' ? 'Crédito' : 'Contado';

try {
    const r = await fetch(endpoint, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({items:carousel, total, metodo:metodoPago, terminos, usuario:u.nombre, tipo_cliente: tipoCliente, cliente_id: clienteId, cliente_nombre: clienteNombre || 'Público General', cliente_ruc: clienteRUC, cliente_telefono: clienteTelefono, recibido: (metodoPago === 'crédito' ? 0 : recibido)})});
    const d = await r.json();
    const puedeImprimir = u.permisos && u.permisos.imprimir;
    if(puedeImprimir){
        if(confirm((tipo==='factura'?'Factura':'Ticket')+' #'+d.numero+' creada. ¿Imprimir ahora?')){
            const win = window.open('/api/imprimir/'+tipo+'/'+d.id, '_blank');
            win.onload = function(){ setTimeout(function(){ win.print(); }, 500); };
        }
    } else {
        alert((tipo==='factura'?'Factura':'Ticket')+' #'+d.numero+' creada.\nNo tienes permiso para imprimir.');
    }
    location.reload();
} catch(e) {
    alert('Error al procesar la venta');
    btn.classList.remove('loading');
    btn.innerHTML = originalText;
}
}
init();
</script></body></html>`,
    inventario: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Inventario - Priceless Imports</title>${css}</head>
<body>
<div class="header">
<div class="logo">
<div class="logo-icon">P</div>
<h1>INVENTARIO - PRICELESS IMPORTS</h1>
</div>
<div><a href="/dashboard" style="color:white;text-decoration:none;font-weight:500;">← Volver</a></div>
</div>
<div style="background:white;padding:20px;display:flex;gap:12px;margin:20px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);flex-wrap:wrap;align-items:center;">
<input id="buscar" placeholder="Buscar por nombre o codigo..." style="flex:1;min-width:200px;" onkeyup="render()">
<select id="catFilter" onchange="render()" style="padding:10px;border:1px solid #ddd;border-radius:8px;">
<option value="">Todas las categorias</option>
</select>
<select id="stockFilter" onchange="render()" style="padding:10px;border:1px solid #ddd;border-radius:8px;">
<option value="">Todos</option>
<option value="con_stock">Con stock</option>
<option value="sin_stock">Sin stock</option>
</select>
<button id="btnAgregar" class="btn btn-primary" onclick="abrirModal()">+ Agregar</button>
<button class="btn" onclick="exportarCatalogo()" style="background:#667eea;color:white;">Exportar Catalogo</button>
</div>
<h2 class="titulo-seccion">Productos en Inventario</h2>
<table><thead><tr><th>Codigo</th><th>Nombre</th><th>Gramaje</th><th>Categoria</th><th>Precio 1 / Precio 2</th><th>Cantidad</th><th>Stock Min</th><th>Estado</th><th>Acciones</th></tr></thead>
<tbody id="tabla"></tbody></table>

<div id="modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);justify-content:center;align-items:center;z-index:1000;">
<div style="background:white;padding:30px;border-radius:12px;width:500px;max-height:90vh;overflow-y:auto;">
<h2 id="modalTitulo" style="color:var(--primary);margin-bottom:20px;">Nuevo Producto</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
<div style="grid-column:1/-1;">
<label style="display:block;margin-bottom:5px;font-weight:500;">Nombre *</label>
<input id="nombre" type="text" placeholder="Nombre del producto" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;">
</div>
<div>
<label style="display:block;margin-bottom:5px;font-weight:500;">Precio Venta *</label>
<input id="precio" type="number" step="0.01" placeholder="0.00" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;">
</div>
<div>
<label style="display:block;margin-bottom:5px;font-weight:500;">Precio 2 (opcional)</label>
<input id="precio2" type="number" step="0.01" placeholder="0.00" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;">
</div>
<div>
<label style="display:block;margin-bottom:5px;font-weight:500;">Cantidad *</label>
<input id="cantidad" type="number" placeholder="0" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;">
</div>
<div>
<label style="display:block;margin-bottom:5px;font-weight:500;">Codigo de Barra</label>
<input id="codigo" type="text" placeholder="Codigo" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;">
</div>
<div>
<label style="display:block;margin-bottom:5px;font-weight:500;">Gramaje/Presentacion</label>
<input id="gramaje" type="text" placeholder="ej: 500mg" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;">
</div>
<div>
<label style="display:block;margin-bottom:5px;font-weight:500;">Categoria</label>
<input id="categoria" type="text" placeholder="ej: Vitaminas" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;">
</div>
<div>
<label style="display:block;margin-bottom:5px;font-weight:500;">Stock Minimo (alerta)</label>
<input id="stockMin" type="number" placeholder="0" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;">
</div>
<div>
<label style="display:block;margin-bottom:5px;font-weight:500;">Unidad</label>
<select id="unidad" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;">
<option value="UN">UN - Unidad</option>
<option value="CAJA">CAJA - Caja</option>
<option value="LB">LB - Libra</option>
<option value="KG">KG - Kilogramo</option>
<option value="ML">ML - Mililitro</option>
<option value="L">L - Litro</option>
<option value="DOCENA">DOCENA - Docena</option>
<option value="PAQUETE">PAQUETE - Paquete</option>
<option value="PAR">PAR - Par</option>
</select>
</div>
<div>
<label style="display:block;margin-bottom:5px;font-weight:500;">Número de Lote</label>
<input id="numeroLote" type="text" placeholder="Lote" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;">
</div>
<div>
<label style="display:block;margin-bottom:5px;font-weight:500;">Fecha Vencimiento</label>
<input id="fechaVencimiento" type="date" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;">
</div>
<div>
<label style="display:block;margin-bottom:5px;font-weight:500;">Número de Serie</label>
<input id="numeroSerie" type="text" placeholder="Serie" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;">
</div>
<div style="grid-column:1/-1;">
<label style="display:block;margin-bottom:5px;font-weight:500;">Imagen del producto</label>
<input type="file" id="imagenFile" accept="image/*" onchange="previewImagen(this)" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;">
<img id="previewImg" style="display:none;max-width:200px;margin-top:10px;border-radius:8px;">
</div>
</div>
<div style="display:flex;gap:10px;margin-top:20px;">
<button onclick="guardarProducto()" class="btn btn-primary" style="flex:1;">Guardar</button>
<button onclick="cerrarModal()" class="btn" style="background:#666;color:white;flex:1;">Cancelar</button>
</div>
</div>
</div>

<script>
let productos = [], puedeEditar = false, editId = null;
async function init(){
const u = JSON.parse(localStorage.getItem('usuario')||'{}');
puedeEditar = u.permisos && u.permisos.editar_inventario;
if(!puedeEditar) document.getElementById('btnAgregar').style.display='none';
productos = await fetch('/api/productos').then(r=>r.json());
const cats = [...new Set(productos.filter(p=>p.categoria).map(p=>p.categoria))];
const catSelect = document.getElementById('catFilter');
if(catSelect){
cats.forEach(c=>{ const opt=document.createElement('option'); opt.value=c; opt.textContent=c; catSelect.appendChild(opt); });
}
render();
}
function render(){
const f = document.getElementById('buscar').value.toLowerCase();
const catFilter = document.getElementById('catFilter')?.value || '';
const stockFilter = document.getElementById('stockFilter')?.value || '';
let filtered = productos.filter(p => {
    const matchBuscar = f==='' || p.nombre.toLowerCase().includes(f) || (p.codigo_barra||'').toLowerCase().includes(f);
    const matchCat = catFilter==='' || p.categoria === catFilter;
    const matchStock = stockFilter==='' || (stockFilter==='con_stock' && p.cantidad>0) || (stockFilter==='sin_stock' && p.cantidad<=0);
    return matchBuscar && matchCat && matchStock;
});
document.getElementById('tabla').innerHTML = filtered.map(p=>'<tr><td style="font-weight:500;">'+(p.codigo_barra||'-')+'</td><td style="font-weight:600;">'+p.nombre+'</td><td>'+(p.gramaje||'-')+'</td><td><span class="badge badge-primary">'+(p.categoria||'General')+'</span></td><td style="color:var(--primary);font-weight:700;">C$ '+p.precio.toFixed(2)+(p.precio2 ? '<br><small style="color:#666;">C$ '+p.precio2.toFixed(2)+'</small>' : '')+'</td><td>'+p.cantidad+'</td><td>'+(p.stock_minimo > 0 ? '<small style="color:#666;">Mín: '+p.stock_minimo+'</small>' : '-')+'</td><td><span class="badge '+(p.cantidad>10?'badge-verde':p.cantidad>0?'badge-rojo':'badge-deshabilitado')+'">'+(p.cantidad>10?'Disponible':p.cantidad>0?'Bajo':'Agotado')+'</span></td><td>'+(puedeEditar?'<button class="btn btn-primary" onclick="editar('+p.id+')" style="padding:8px 16px;font-size:13px;margin-right:5px;">Editar</button><button class="btn btn-rojo" onclick="eliminar('+p.id+')" style="padding:8px 16px;font-size:13px;">X</button>':'')+'</td></tr>').join('')||'<tr><td colspan="9" style="text-align:center;padding:40px;color:#999;">Sin productos</td></tr>';
}
function abrirModal(){
editId = null;
document.getElementById('modalTitulo').textContent = 'Nuevo Producto';
document.getElementById('nombre').value = '';
document.getElementById('precio').value = '';
document.getElementById('cantidad').value = '';
document.getElementById('codigo').value = '';
document.getElementById('gramaje').value = '';
document.getElementById('categoria').value = '';
document.getElementById('stockMin').value = '';
document.getElementById('previewImg').style.display = 'none';
document.getElementById('imagenFile').value = '';
document.getElementById('modal').style.display = 'flex';
}
function cerrarModal(){
document.getElementById('modal').style.display = 'none';
}
function previewImagen(input){
if(input.files && input.files[0]){
const reader = new FileReader();
reader.onload = function(e){
document.getElementById('previewImg').src = e.target.result;
document.getElementById('previewImg').style.display = 'block';
}
reader.readAsDataURL(input.files[0]);
}
}
async function guardarProducto(){
    const btn = document.querySelector('#modal button.btn-primary');
    const originalText = btn.innerHTML;
    btn.classList.add('loading');
    btn.innerHTML = '<span class="spinner"></span>Guardando...';
    
    const nombre = document.getElementById('nombre').value.trim();
    const precio = parseFloat(document.getElementById('precio').value) || 0;
    const precio2 = parseFloat(document.getElementById('precio2').value) || 0;
    const cantidad = parseInt(document.getElementById('cantidad').value) || 0;
    const codigo_barra = document.getElementById('codigo').value.trim() || null;
    const gramaje = document.getElementById('gramaje').value.trim();
    const categoria = document.getElementById('categoria').value.trim() || 'General';
    const stock_minimo = parseInt(document.getElementById('stockMin').value) || 0;
    const unidad = document.getElementById('unidad').value || 'UN';
    const numero_lote = document.getElementById('numeroLote').value.trim() || '';
    const fecha_vencimiento_prod = document.getElementById('fechaVencimiento').value || null;
    const numero_serie = document.getElementById('numeroSerie').value.trim() || '';
    
    if(!nombre || precio <= 0 || cantidad < 0){ alert('Complete los campos requeridos'); btn.classList.remove('loading'); btn.innerHTML = originalText; return; }
    const data = {nombre, precio, precio2, cantidad, codigo_barra, gramaje, categoria, stock_minimo, unidad, numero_lote, fecha_vencimiento_prod, numero_serie};
    if(editId){
        data.id = editId;
        await fetch('/api/producto', {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    }else{
        await fetch('/api/producto', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    }
    const newProd = await fetch('/api/productos').then(r=>r.json());
    const lastProd = newProd[newProd.length-1];
    const imgFile = document.getElementById('imagenFile').files[0];
    if(imgFile && lastProd){
        const reader = new FileReader();
        reader.onload = async function(e){
            const base64 = e.target.result;
            await fetch('/api/upload-imagen', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({imagen:base64, producto_id:lastProd.id})});
            location.reload();
        };
        reader.readAsDataURL(imgFile);
    }else{
        location.reload();
    }
}
async function editar(id){
const p = productos.find(x=>x.id===id); if(!p)return;
editId = id;
document.getElementById('modalTitulo').textContent = 'Editar Producto';
document.getElementById('nombre').value = p.nombre || '';
document.getElementById('precio').value = p.precio || 0;
document.getElementById('precio2').value = p.precio2 || 0;
document.getElementById('cantidad').value = p.cantidad || 0;
document.getElementById('codigo').value = p.codigo_barra || '';
document.getElementById('gramaje').value = p.gramaje || '';
document.getElementById('categoria').value = p.categoria || '';
document.getElementById('stockMin').value = p.stock_minimo || 0;
document.getElementById('unidad').value = p.unidad || 'UN';
document.getElementById('numeroLote').value = p.numero_lote || '';
document.getElementById('fechaVencimiento').value = p.fecha_vencimiento_prod || '';
document.getElementById('numeroSerie').value = p.numero_serie || '';
document.getElementById('modal').style.display = 'flex';
}
async function eliminar(id){
if(!confirm('Eliminar este producto?')) return;
await fetch('/api/producto', {method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id})});
location.reload();
}
function exportarCatalogo(){
window.open('/api/catalogo-pdf', '_blank');
}
init();
</script></body></html>`,
    facturas: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Facturas - Priceless Imports</title>${css}</head>
<body>
<div class="header">
<div class="logo">
<div class="logo-icon">P</div>
<h1>FACTURAS Y TICKETS - PRICELESS</h1>
</div>
<div><a href="/dashboard" style="color:white;text-decoration:none;font-weight:500;">← Volver</a></div>
</div>
<div class="main" style="padding:24px;">
<h2 class="titulo-seccion">Historial de Transacciones</h2>
<div style="margin-bottom:15px;display:flex;gap:10px;">
<button class="btn btn-primary" onclick="exportarCSV()">${icons.export} Exportar a CSV</button>
</div>
<table><thead><tr><th>Número</th><th>Fecha</th><th>Total</th><th>Método</th><th>Tipo</th><th>Estado</th><th>Usuario</th><th id="colImprimir">Imprimir</th><th id="colAnular">Anular</th></tr></thead><tbody id="tabla"></tbody></table>
</div>
<script>
let puedeImprimir = false, esAdmin = false;
async function init(){
const u = JSON.parse(localStorage.getItem('usuario')||'{}');
puedeImprimir = u.permisos && u.permisos.imprimir;
esAdmin = u.rol === 'admin';
if(!puedeImprimir) document.getElementById('colImprimir').style.display='none';
if(!esAdmin) document.getElementById('colAnular').style.display='none';
const f = await fetch('/api/facturas').then(r=>r.json());
document.getElementById('tabla').innerHTML = f.map(t=>'<tr><td style="font-weight:600;color:var(--primary);">'+t.numero+'</td><td>'+new Date(t.fecha).toLocaleString()+'</td><td style="font-weight:700;color:var(--primary);">C$ '+t.total.toFixed(2)+'</td><td>'+t.metodo+'</td><td><span class="badge '+(t.tipo==='factura'?'badge-verde':'badge-primary')+'">'+t.tipo+'</span></td><td><span class="badge '+(t.estado==='anulada'?'badge-deshabilitado':'badge-verde')+'">'+(t.estado==='anulada'?'Anulada':'Activa')+'</span></td><td>'+t.usuario+'</td><td class="col-imp">'+(puedeImprimir?'<button class="btn btn-primary" onclick="window.open(\\'/api/imprimir/'+t.tipo+'/'+t.id+'\\', \\'_blank\\')" style="padding:8px 14px;font-size:13px;">${icons.imprimir}</button>':'')+'</td><td class="col-anular">'+(esAdmin && t.estado!=='anulada'?'<button class="btn btn-rojo" onclick="anular('+t.id+', \''+t.tipo+'\')" style="padding:8px 14px;font-size:13px;">Anular</button>':'')+'</td></tr>').join('')||'<tr><td colspan="9" style="text-align:center;padding:40px;color:#999;">Sin transacciones</td></tr>';
if(!puedeImprimir) document.querySelectorAll('.col-imp').forEach(el=>el.style.display='none');
if(!esAdmin) document.querySelectorAll('.col-anular').forEach(el=>el.style.display='none');
}
async function anular(id, tipo){
if(!confirm('¿Anular esta '+tipo+'? El stock será revertido.'))return;
await fetch('/api/anular/'+id+'/'+tipo, {method:'POST'});
location.reload();
}
function exportarCSV(){
fetch('/api/facturas').then(r=>r.json()).then(data=>{
const csv = 'Número,Fecha,Total,Método,Tipo,Estado,Usuario\n' + data.map(t=>t.numero+','+new Date(t.fecha).toLocaleString()+','+t.total.toFixed(2)+','+t.metodo+','+t.tipo+','+(t.estado||'activa')+','+t.usuario).join('\n');
const blob = new Blob([csv], {type:'text/csv'});
const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'facturas_'+new Date().toISOString().split('T')[0]+'.csv'; a.click();
});
}
init();
</script></body></html>`,
    reportes: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Reportes - Priceless Imports</title>${css}</head>
<body>
<div class="header">
<div class="logo">
<div class="logo-icon">P</div>
<h1>REPORTES - PRICELESS IMPORTS</h1>
</div>
<div><a href="/dashboard" style="color:white;text-decoration:none;font-weight:500;">← Volver</a></div>
</div>
<div class="container">
<div class="sidebar">
<a href="/dashboard">${icons.home} Inicio</a>
<a href="/reportes" class="active">Reportes</a>
</div>
<div class="main" style="padding:24px;">
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-bottom:24px;">
<div class="card" style="text-align:center;cursor:pointer;transition:all 0.3s;" onclick="reporteDiario()">
<div style="font-size:40px;margin-bottom:10px;">📅</div>
<h3 style="color:var(--primary);">Diario</h3>
<p style="color:var(--textoLight);font-size:13px;">Ventas del día con detalle por método y productos</p>
</div>
<div class="card" style="text-align:center;cursor:pointer;transition:all 0.3s;" onclick="reporteMensual()">
<div style="font-size:40px;margin-bottom:10px;">📆</div>
<h3 style="color:var(--primary);">Mensual</h3>
<p style="color:var(--textoLight);font-size:13px;">Resumen del mes con promedio diario</p>
</div>
<div class="card" style="text-align:center;cursor:pointer;transition:all 0.3s;" onclick="reporteProductos()">
<div style="font-size:40px;margin-bottom:10px;">${icons.inventario}</div>
<h3 style="color:var(--primary);">Productos</h3>
<p style="color:var(--textoLight);font-size:13px;">Top productos más vendidos</p>
</div>
<div class="card" style="text-align:center;cursor:pointer;transition:all 0.3s;" onclick="reporteUsuarios()">
<div style="font-size:40px;margin-bottom:10px;">${icons.clientes}</div>
<h3 style="color:var(--primary);">Vendedores</h3>
<p style="color:var(--textoLight);font-size:13px;">Rendimiento por usuario</p>
</div>
</div>
<div style="background:white;padding:20px;border-radius:12px;margin-bottom:20px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
<h3 style="color:var(--primary);min-width:150px;">Filtros</h3>
<input type="date" id="fechaInicio" style="padding:12px;border:2px solid var(--primary);border-radius:8px;">
<span style="color:var(--textoLight);">hasta</span>
<input type="date" id="fechaFin" style="padding:12px;border:2px solid var(--primary);border-radius:8px;">
<button class="btn btn-primary" onclick="generarReporte()">${icons.buscar} Consultar</button>
<button class="btn" onclick="exportarCSV()" style="background:var(--verde);color:white;">${icons.export} Exportar</button>
</div>
</div>
<div id="resultado" style="display:none;">
<div class="card" style="margin-bottom:20px;">
<h3 id="tituloReporte" style="color:var(--primary);margin-bottom:20px;"></h3>
<div id="statsReporte" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:20px;"></div>
<div id="tablaReporte" style="overflow-x:auto;"></div>
</div>
</div>
</div></div>
<script>
let datosExport = [];
document.getElementById('fechaInicio').value = new Date().toISOString().split('T')[0];
document.getElementById('fechaFin').value = new Date().toISOString().split('T')[0];

async function reporteDiario(){
    const fecha = document.getElementById('fechaInicio').value;
    const d = await fetch('/api/reporte-diario?fecha='+fecha).then(r=>r.json());
    mostrarReporte('Reporte Diario - '+fecha, [
        {label:'Total Ventas',valor:'C$ '+d.totalVentas.toFixed(2),color:'var(--primary)'},
        {label:'Transacciones',valor:d.cantidadVentas,color:'var(--verde)'},
        {label:'Efectivo',valor:'C$ '+d.porMetodo.efectivo.toFixed(2),color:'var(--accent)'},
        {label:'Transferencia',valor:'C$ '+d.porMetodo.transferencia.toFixed(2),color:'var(--primaryLight)'},
        {label:'Tarjeta',valor:'C$ '+d.porMetodo.tarjeta.toFixed(2),color:'var(--accentDark)'}
    ], d.ventas, ['Número','Hora','Total','Método','Usuario']);
    datosExport = d.ventas;
}
async function reporteMensual(){
    const a = document.getElementById('fechaInicio').value.substring(0,7);
    const d = await fetch('/api/reporte-mensual?fecha='+a).then(r=>r.json());
    const meses = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    mostrarReporte('Reporte Mensual - '+meses[d.mes]+' '+d.anio, [
        {label:'Total del Mes',valor:'C$ '+d.total.toFixed(2),color:'var(--primary)'},
        {label:'Ventas',valor:d.cantidad,color:'var(--verde)'},
        {label:'Promedio/Día',valor:'C$ '+d.promedio.toFixed(2),color:'var(--accent)'}
    ], Object.entries(d.ventasPorDia).map(([dia,v])=>({dia,total:v})), ['Día','Total']);
    datosExport = Object.entries(d.ventasPorDia).map(([dia,v])=>({dia,total:v}));
}
async function reporteProductos(){
    const fi = document.getElementById('fechaInicio').value;
    const ff = document.getElementById('fechaFin').value;
    const d = await fetch('/api/reporte-productos?fi='+fi+'&ff='+ff).then(r=>r.json());
    mostrarReporte('Top Productos ('+fi+' al '+ff+')', [
        {label:'Total General',valor:'C$ '+d.totalGeneral.toFixed(2),color:'var(--primary)'},
        {label:'Productos',valor:d.productos.length,color:'var(--verde)'}
    ], d.productos, ['Producto','Cantidad','Total']);
    datosExport = d.productos;
}
async function reporteUsuarios(){
    const fi = document.getElementById('fechaInicio').value;
    const ff = document.getElementById('fechaFin').value;
    const d = await fetch('/api/reporte-usuarios?fi='+fi+'&ff='+ff).then(r=>r.json());
    mostrarReporte('Rendimiento Vendedores ('+fi+' al '+ff+')', [
        {label:'Total General',valor:'C$ '+d.totalGeneral.toFixed(2),color:'var(--primary)'},
        {label:'Vendedores',valor:d.usuarios.length,color:'var(--verde)'}
    ], d.usuarios, ['Vendedor','Ventas','Total']);
    datosExport = d.usuarios;
}
function mostrarReporte(titulo, stats, datos, columns){
    document.getElementById('resultado').style.display = 'block';
    document.getElementById('tituloReporte').textContent = titulo;
    document.getElementById('statsReporte').innerHTML = stats.map(s=>'<div style="background:linear-gradient(135deg, '+s.color+' 0%, '+s.color+'99 100%);padding:20px;border-radius:12px;color:white;"><div style="font-size:24px;font-weight:700;">'+s.valor+'</div><div style="font-size:13px;opacity:0.9;">'+s.label+'</div></div>').join('');
    document.getElementById('tablaReporte').innerHTML = '<table style="width:100%;border-collapse:collapse;"><thead><tr style="background:var(--primary);color:white;">'+columns.map(c=>'<th style="padding:14px;text-align:left;">'+c+'</th>').join('')+'</thead><tbody>'+datos.map((row,i)=>'<tr style="border-bottom:1px solid #eee;'+(i%2===0?'background:#f8f9fa':'')+'">'+Object.values(row).map(v=>'<td style="padding:12px;">'+(typeof v==='number'?v.toFixed(2):v)+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
}
async function generarReporte(){ await reporteDiario(); }
function exportarCSV(){
    if(!datosExport.length){alert('Genera un reporte primero');return;}
    const keys = Object.keys(datosExport[0]);
    const csv = keys.join(',')+'\\n'+datosExport.map(row=>keys.map(k=>row[k]).join(',')).join('\\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download = 'reporte_'+new Date().toISOString().split('T')[0]+'.csv'; a.click();
}
</script></body></html>`,
    ordenes: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Órdenes - Priceless Imports</title>${css}</head>
<body>
<div class="header">
<div class="logo">
<div class="logo-icon">P</div>
<h1>ÓRDENES DE IMPORTACIÓN - PRICELESS</h1>
</div>
<div><a href="/dashboard" style="color:white;text-decoration:none;font-weight:500;">← Volver</a></div>
</div>
<div class="main" style="padding:24px;">
<h2 class="titulo-seccion">Órdenes de Importación</h2>
<table><thead><tr><th>Número</th><th>Fecha</th><th>Proveedor</th><th>Total</th><th>Estado</th><th>Usuario</th></tr></thead><tbody id="tabla"></tbody></table>
</div>
<script>
async function init(){
const o = await fetch('/api/ordenes').then(r=>r.json());
document.getElementById('tabla').innerHTML = o.map(t=>'<tr><td style="font-weight:600;color:var(--primary);">'+t.numero+'</td><td>'+new Date(t.fecha).toLocaleString()+'</td><td>'+(t.proveedor||'-')+'</td><td style="font-weight:700;">C$ '+(t.total||0).toFixed(2)+'</td><td><span class="badge '+(t.estado==='pendiente'?'badge-rojo':'badge-verde')+'">'+t.estado+'</span></td><td>'+t.usuario+'</td></tr>').join('')||'<tr><td colspan="6" style="text-align:center;padding:40px;color:#999;">Sin órdenes</td></tr>';
}
init();
</script></body></html>`,
    compras: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Compras - Priceless Imports</title>${css}</head>
<body>
<div class="header">
<div class="logo">
<div class="logo-icon">P</div>
<h1>COMPRAS - PRICELESS IMPORTS</h1>
</div>
<div><a href="/dashboard" style="color:white;text-decoration:none;font-weight:500;">← Volver</a></div>
</div>

<div class="main" style="padding:24px;">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
<h2 class="titulo-seccion">Órdenes de Compra</h2>
<button class="btn btn-primary" onclick="abrirModalNuevaCompra()">+ Nueva Orden</button>
</div>

<div class="card">
<h3 style="color:var(--primary);margin-bottom:15px;">Órdenes Recientes</h3>
<table><thead><tr><th>Número</th><th>Fecha</th><th>Proveedor</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="tablaCompras"></tbody></table>
</div>
</div>

<div id="modalNuevaCompra" class="modal" style="display:none;">
<div class="modal-content" style="max-width:700px;">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
<h3 style="color:var(--primary);">Nueva Orden de Compra</h3>
<span onclick="cerrarModal()" style="cursor:pointer;font-size:24px;">&times;</span>
</div>

<div style="margin-bottom:20px;">
<label style="display:block;margin-bottom:5px;font-weight:600;">Proveedor</label>
<select id="selectProveedor" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;">
<option value="">Seleccionar proveedor...</option>
</select>
</div>

<div class="card" style="margin-bottom:20px;">
<h4 style="margin-bottom:10px;">Agregar Productos</h4>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr auto;gap:10px;margin-bottom:10px;">
<input id="prodCodigo" placeholder="Código" style="padding:8px;">
<input id="prodNombre" placeholder="Nombre del producto" style="padding:8px;">
<input id="prodCantidad" type="number" placeholder="Cantidad" value="1" style="padding:8px;">
<input id="prodCosto" type="number" placeholder="Costo C$" step="0.01" style="padding:8px;">
<button class="btn btn-primary" onclick="agregarItem()">Agregar</button>
</div>
<table style="width:100%;margin-top:10px;"><thead><tr><th>Producto</th><th>Cantidad</th><th>Costo</th><th>Subtotal</th><th></th></tr></thead><tbody id="tablaItems"></tbody></table>
</div>

<div style="text-align:right;margin-bottom:20px;">
<strong style="font-size:18px;">Total: C$ <span id="totalOrden">0.00</span></strong>
</div>

<div style="display:flex;justify-content:flex-end;gap:10px;">
<button class="btn btn-secondary" onclick="cerrarModal()">Cancelar</button>
<button class="btn btn-primary" onclick="guardarOrden()">Crear Orden</button>
</div>
</div>
</div>

<div id="modalDetalleCompra" class="modal" style="display:none;">
<div class="modal-content" style="max-width:700px;">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
<h3 style="color:var(--primary);">Detalle de Orden</h3>
<span onclick="cerrarModalDetalle()" style="cursor:pointer;font-size:24px;">&times;</span>
</div>
<div id="detalleContenido"></div>
</div>
</div>

<script>
let compras = [];
let proveedores = [];
let itemsOrden = [];

async function init() {
    compras = await fetch('/api/compras').then(r=>r.json());
    proveedores = await fetch('/api/proveedores').then(r=>r.json());
    renderCompras();
    cargarProveedores();
}

function cargarProveedores() {
    const select = document.getElementById('selectProveedor');
    select.innerHTML = '<option value="">Seleccionar proveedor...</option>' + 
        proveedores.map(p => '<option value="'+p.id+'">'+p.nombre+'</option>').join('');
}

function renderCompras() {
    const tbody = document.getElementById('tablaCompras');
    if (compras.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#999;">Sin órdenes de compra</td></tr>';
        return;
    }
    tbody.innerHTML = compras.map(c => '<tr>' +
        '<td style="font-weight:600;color:var(--primary);">'+c.numero+'</td>' +
        '<td>'+new Date(c.fecha).toLocaleDateString()+'</td>' +
        '<td>'+(c.proveedor || '-')+'</td>' +
        '<td style="font-weight:700;">C$ '+(c.total||0).toFixed(2)+'</td>' +
        '<td><span class="badge '+(c.estado==='pendiente'?'badge-rojo':'badge-verde')+'">'+c.estado+'</span></td>' +
        '<td>'+(c.estado==='pendiente' ? 
            '<button class="btn btn-sm btn-success" onclick="recibirCompra('+c.id+')">Recibir</button> ' : '') +
        '<button class="btn btn-sm" onclick="verDetalle('+c.id+')">Ver</button></td>' +
    '</tr>').join('');
}

function abrirModalNuevaCompra() {
    itemsOrden = [];
    document.getElementById('selectProveedor').value = '';
    document.getElementById('prodCodigo').value = '';
    document.getElementById('prodNombre').value = '';
    document.getElementById('prodCantidad').value = '1';
    document.getElementById('prodCosto').value = '';
    renderItems();
    document.getElementById('modalNuevaCompra').style.display = 'flex';
}

function agregarItem() {
    const nombre = document.getElementById('prodNombre').value.trim();
    const cantidad = parseInt(document.getElementById('prodCantidad').value) || 0;
    const costo = parseFloat(document.getElementById('prodCosto').value) || 0;
    
    if (!nombre || cantidad <= 0 || costo <= 0) {
        alert('Complete todos los campos');
        return;
    }
    
    itemsOrden.push({
        codigo_barra: document.getElementById('prodCodigo').value.trim(),
        nombre: nombre,
        cantidad: cantidad,
        costo: costo
    });
    
    document.getElementById('prodNombre').value = '';
    document.getElementById('prodCantidad').value = '1';
    document.getElementById('prodCosto').value = '';
    document.getElementById('prodCodigo').value = '';
    renderItems();
}

function renderItems() {
    const tbody = document.getElementById('tablaItems');
    let total = 0;
    tbody.innerHTML = itemsOrden.map((item, idx) => {
        const subtotal = item.cantidad * item.costo;
        total += subtotal;
        return '<tr>' +
            '<td>'+item.nombre+'</td>' +
            '<td>'+item.cantidad+'</td>' +
            '<td>C$ '+item.costo.toFixed(2)+'</td>' +
            '<td>C$ '+subtotal.toFixed(2)+'</td>' +
            '<td><button onclick="eliminarItem('+idx+')" style="color:red;background:none;border:none;cursor:pointer;">✕</button></td>' +
        '</tr>';
    }).join('');
    document.getElementById('totalOrden').textContent = total.toFixed(2);
}

function eliminarItem(idx) {
    itemsOrden.splice(idx, 1);
    renderItems();
}

function cerrarModal() {
    document.getElementById('modalNuevaCompra').style.display = 'none';
}

async function guardarOrden() {
    const proveedor_id = document.getElementById('selectProveedor').value;
    const proveedor = proveedores.find(p => p.id == proveedor_id);
    
    if (!proveedor_id || itemsOrden.length === 0) {
        alert('Seleccione un proveedor y agregue productos');
        return;
    }
    
    const data = {
        proveedor_id: parseInt(proveedor_id),
        proveedor: proveedor ? proveedor.nombre : '',
        items: itemsOrden,
        usuario: 'admin'
    };
    
    await fetch('/api/compras', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    
    cerrarModal();
    compras = await fetch('/api/compras').then(r=>r.json());
    renderCompras();
}

function verDetalle(id) {
    const compra = compras.find(c => c.id === id);
    if (!compra) return;
    
    let html = '<p><strong>Proveedor:</strong> '+(compra.proveedor || '-')+'</p>';
    html += '<p><strong>Fecha:</strong> '+new Date(compra.fecha).toLocaleString()+'</p>';
    html += '<p><strong>Estado:</strong> '+compra.estado+'</p>';
    html += '<h4 style="margin-top:15px;">Productos</h4>';
    html += '<table style="width:100%;"><thead><tr><th>Producto</th><th>Cantidad</th><th>Costo</th><th>Subtotal</th></tr></thead><tbody>';
    html += (compra.items || []).map(item => '<tr>' +
        '<td>'+item.nombre+'</td>' +
        '<td>'+item.cantidad+'</td>' +
        '<td>C$ '+item.costo.toFixed(2)+'</td>' +
        '<td>C$ '+(item.cantidad * item.costo).toFixed(2)+'</td>' +
    '</tr>').join('');
    html += '</tbody></table>';
    html += '<p style="text-align:right;margin-top:15px;font-size:18px;font-weight:700;">Total: C$ '+(compra.total||0).toFixed(2)+'</p>';
    
    if (compra.estado === 'pendiente') {
        html += '<button class="btn btn-success" style="margin-top:15px;width:100%;" onclick="cerrarModalDetalle(); recibirCompra('+id+');">Recibir Mercadería</button>';
    }
    
    document.getElementById('detalleContenido').innerHTML = html;
    document.getElementById('modalDetalleCompra').style.display = 'flex';
}

function cerrarModalDetalle() {
    document.getElementById('modalDetalleCompra').style.display = 'none';
}

async function recibirCompra(id) {
    if (!confirm('¿Confirmar recepción de mercadería? Los productos se agregarán al inventario.')) return;
    
    const res = await fetch('/api/compras/'+id+'/recibir', {method: 'POST'});
    const data = await res.json();
    
    if (res.ok) {
        alert('Mercadería recibida correctamente');
        compras = await fetch('/api/compras').then(r=>r.json());
        renderCompras();
    } else {
        alert(data.error || 'Error al recibir');
    }
}
</script></body></html>`,
    admin: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Administración - Priceless Imports</title>${css}</head>
<body>
<div class="header">
<div class="logo">
<div class="logo-icon">P</div>
<h1>ADMINISTRACIÓN - PRICELESS IMPORTS</h1>
</div>
<div><a href="/dashboard" style="color:white;text-decoration:none;font-weight:500;">← Volver</a></div>
</div>
<div class="container">
<div class="main">
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;margin-bottom:32px;">
<div class="card">
<h3 style="color:var(--primary);margin-bottom:16px;">Base de Datos</h3>
<p style="color:var(--textoLight);margin-bottom:16px;">Ubicacion actual: <strong id="dbPath">${DEFAULT_DB_PATH}</strong></p>
<button class="btn btn-primary" onclick="cambiarDB()" style="width:100%;margin-bottom:8px;">Cambiar Ubicacion DB</button>
<button class="btn btn-verde" onclick="backupDB()" style="width:100%;margin-bottom:8px;">Crear Backup (.db)</button>
<button class="btn btn-primary" onclick="exportarDB()" style="width:100%;margin-bottom:8px;">${icons.export} Exportar Todo (.json)</button>
<label class="btn" style="width:100%;background:#667eea;color:white;cursor:pointer;display:inline-block;padding:12px;border-radius:8px;text-align:center;font-weight:500;">
    ${icons.import} Importar Backup
    <input type="file" id="importFile" accept=".json,.db" style="display:none;" onchange="importarDB(this)">
</label>
<p id="importStatus" style="margin-top:8px;color:var(--textoLight);font-size:13px;"></p>
</div>
<div class="card">
<h3 style="color:var(--primary);margin-bottom:16px;">Sistema</h3>
<p style="color:var(--textoLight);margin-bottom:16px;">Worker en segundo plano activo</p>
<button class="btn btn-primary" onclick="checkUpdates()" style="width:100%;">Verificar Actualizaciones</button>
</div>
<div class="card">
<h3 style="color:var(--primary);margin-bottom:16px;">Configuración de la Empresa</h3>
<div style="display:grid;gap:10px;">
<input id="empNombre" placeholder="Nombre de la empresa" style="padding:8px;border:1px solid #ddd;border-radius:6px;">
<input id="empRuc" placeholder="RUC" style="padding:8px;border:1px solid #ddd;border-radius:6px;">
<input id="empDireccion" placeholder="Dirección" style="padding:8px;border:1px solid #ddd;border-radius:6px;">
<input id="empTelefono" placeholder="Teléfono" style="padding:8px;border:1px solid #ddd;border-radius:6px;">
<input id="empSlogan" placeholder="Slogan" style="padding:8px;border:1px solid #ddd;border-radius:6px;">
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
<input id="empTipoCambio" type="number" step="0.0001" placeholder="Tipo cambio US$" style="padding:8px;border:1px solid #ddd;border-radius:6px;">
<input id="empImpuesto" type="number" step="0.01" placeholder="Impuesto %" style="padding:8px;border:1px solid #ddd;border-radius:6px;">
</div>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
<input id="empPrefijoFac" placeholder="Prefijo Factura" maxlength="3" style="padding:8px;border:1px solid #ddd;border-radius:6px;">
<input id="empPrefijoTic" placeholder="Prefijo Ticket" maxlength="3" style="padding:8px;border:1px solid #ddd;border-radius:6px;">
<input id="empDigitos" type="number" min="6" max="15" placeholder="Dígitos" style="padding:8px;border:1px solid #ddd;border-radius:6px;">
</div>
<input id="empDescDist" type="number" step="0.01" placeholder="Descuento distribuidor %" style="padding:8px;border:1px solid #ddd;border-radius:6px;">
<p id="previewNumero" style="font-size:12px;color:var(--textoLight);text-align:center;margin-top:8px;">Ejemplo: F0000000001</p>
<button id="btnGuardarConfig" class="btn btn-primary" onclick="guardarConfigEmpresa()" style="width:100%;margin-top:8px;">Guardar Configuración</button>
</div>
</div>
</div>

<h2 class="titulo-seccion">Gestión de Usuarios</h2>
<div style="background:white;padding:20px;display:flex;gap:12px;margin:20px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
<button class="btn btn-primary" onclick="agregarUsuario()">+ Nuevo Usuario</button>
</div>
<table><thead><tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
<tbody id="tablaUsuarios"></tbody>
</div></div>

<div id="modalPermisos" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center;">
<div style="background:white;padding:24px;border-radius:12px;max-width:800px;width:90%;max-height:80vh;overflow-y:auto;">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
<h3 style="color:var(--primary);">Permisos de Usuario: <span id="permisosUsuarioNombre"></span></h3>
<button onclick="cerrarModalPermisos()" style="background:none;border:none;font-size:24px;cursor:pointer;">&times;</button>
</div>
<div style="margin-bottom:16px;">
<button class="btn btn-primary" onclick="resetPermisos()" style="margin-right:8px;">Restablecer por Rol</button>
<button class="btn btn-verde" onclick="guardarPermisos()">Guardar Cambios</button>
</div>
<table style="width:100%;"><thead><tr><th>Módulo</th><th>Ver</th><th>Crear</th><th>Editar</th><th>Eliminar</th><th>Imprimir</th><th>Exportar</th></tr></thead>
<tbody id="tablaPermisos"></tbody></table>
</div>
</div>

<script>
let usuarios = [];
let permisosActuales = {};
let usuarioPermisosId = null;
async function init(){
usuarios = await fetch('/api/usuarios').then(r=>r.json());
renderUsuarios();
cargarConfigEmpresa();
}
function renderUsuarios(){
document.getElementById('tablaUsuarios').innerHTML = usuarios.map(u=>'<tr><td style="font-weight:600;">'+u.username+'</td><td>'+(u.nombre||'-')+'</td><td><span class="badge '+(u.rol==='admin'?'badge-verde':u.rol==='caja'?'badge-rojo':'badge-primary')+'">'+u.rol+'</span></td><td><span class="badge '+(u.activo?'badge-verde':'badge-deshabilitado')+'">'+(u.activo?'Activo':'Inactivo')+'</span></td><td><button class="btn btn-primary" onclick="editarUsuario('+u.id+')" style="padding:8px 12px;font-size:12px;margin-right:4px;">Editar</button><button class="btn" style="padding:8px 12px;font-size:12px;background:var(--accent);color:var(--primary);" onclick="abrirPermisos('+u.id+')">Permisos</button></td></tr>').join('')||'<tr><td colspan="5" style="text-align:center;padding:40px;color:#999;">Sin usuarios</td></tr>';
}
async function abrirPermisos(usuarioId){
usuarioPermisosId = usuarioId;
const u = usuarios.find(x=>x.id===usuarioId);
document.getElementById('permisosUsuarioNombre').textContent = u.username + ' (' + u.rol + ')';
const resp = await fetch('/api/permisos-usuario?usuario_id='+usuarioId);
permisosActuales = await resp.json();
renderPermisos();
document.getElementById('modalPermisos').style.display = 'flex';
}
function renderPermisos(){
const modulos = Object.keys(permisosActuales);
document.getElementById('tablaPermisos').innerHTML = modulos.map(m => {
const p = permisosActuales[m];
return '<tr><td style="font-weight:500;">'+p.icon+' '+p.nombre+'</td>'+
'<td style="text-align:center;"><input type="checkbox" '+(p.puede_ver?'checked':'')+' onchange="permisosActuales[\''+m+'\'].puede_ver=this.checked"></td>'+
'<td style="text-align:center;"><input type="checkbox" '+(p.puede_crear?'checked':'')+' onchange="permisosActuales[\''+m+'\'].puede_crear=this.checked"></td>'+
'<td style="text-align:center;"><input type="checkbox" '+(p.puede_editar?'checked':'')+' onchange="permisosActuales[\''+m+'\'].puede_editar=this.checked"></td>'+
'<td style="text-align:center;"><input type="checkbox" '+(p.puede_eliminar?'checked':'')+' onchange="permisosActuales[\''+m+'\'].puede_eliminar=this.checked"></td>'+
'<td style="text-align:center;"><input type="checkbox" '+(p.puede_imprimir?'checked':'')+' onchange="permisosActuales[\''+m+'\'].puede_imprimir=this.checked"></td>'+
'<td style="text-align:center;"><input type="checkbox" '+(p.puede_exportar?'checked':'')+' onchange="permisosActuales[\''+m+'\'].puede_exportar=this.checked"></td></tr>';
}).join('');
}
function cerrarModalPermisos(){
document.getElementById('modalPermisos').style.display = 'none';
}
async function guardarPermisos(){
let guardados = 0;
for (const [moduloId, permiso] of Object.entries(permisosActuales)) {
await fetch('/api/permisos-usuario', {
method: 'PUT',
headers: {'Content-Type': 'application/json'},
body: JSON.stringify({
usuario_id: usuarioPermisosId,
modulo_id: moduloId,
puede_ver: permiso.puede_ver,
puede_crear: permiso.puede_crear,
puede_editar: permiso.puede_editar,
puede_eliminar: permiso.puede_eliminar,
puede_imprimir: permiso.puede_imprimir,
puede_exportar: permiso.puede_exportar
})
});
guardados++;
}
alert('Permisos actualizados: ' + guardados + ' módulos');
init();
cerrarModalPermisos();
}
async function resetPermisos(){
if(!confirm('¿Restablecer permisos según el rol del usuario?')) return;
const resp = await fetch('/api/permisos-usuario/reset', {
method: 'POST',
headers: {'Content-Type': 'application/json'},
body: JSON.stringify({ usuario_id: usuarioPermisosId })
});
permisosActuales = await resp.json();
renderPermisos();
alert('Permisos restablecidos');
}
async function agregarUsuario(){
    const nom = prompt('Usuario:'); if(!nom)return;
    const nombre = prompt('Nombre completo:')||nom;
    const pass = prompt('Contraseña:');
    const rol = prompt('Rol (admin/caja/vendedor/bodega/distribuidor):')||'caja';
    await fetch('/api/usuario', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username:nom, nombre, password:pass, rol})});
    location.reload();
}
async function editarUsuario(id){
    const u = usuarios.find(x=>x.id===id); if(!u)return;
    const nombre = prompt('Nombre:', u.nombre);
    const pass = prompt('Nueva contraseña (dejar vacío para mantener):');
    const rol = prompt('Rol:', u.rol);
    const activo = confirm('¿Activo?');
    const data = { id, nombre, rol, activo };
    if(pass) data.password = pass;
    await fetch('/api/usuario', {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    location.reload();
}
async function cambiarDB(){
    const nuevaRuta = prompt('Nueva ruta de la base de datos:', DEFAULT_DB_PATH);
    if(nuevaRuta) {
        const response = await fetch('/api/cambiar-db', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({path: nuevaRuta})});
        const result = await response.json();
        if(result.ok) {
            alert('Base de datos cambiada exitosamente');
            location.reload();
        } else {
            alert('Error: ' + result.error);
        }
    }
}
async function backupDB(){
    const response = await fetch('/api/backup-db', {method:'POST'});
    const result = await response.json();
    if(result.ok) {
        alert('Backup creado exitosamente en: ' + result.backupPath);
    } else {
        alert('Error al crear backup: ' + result.error);
    }
}
async function exportarDB(){
    try {
        const response = await fetch('/api/exportar-db');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'priceless_export_' + new Date().toISOString().split('T')[0] + '.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        document.getElementById('importStatus').innerHTML = 'Exportacion completada: priceless_export_*.json';
    } catch(e) {
        alert('Error al exportar: ' + e.message);
    }
}
async function importarDB(input){
    const file = input.files[0];
    if(!file) return;
    const statusEl = document.getElementById('importStatus');
    statusEl.innerHTML = '⏳ Importando...';
    try {
        const text = await file.text();
        const data = JSON.parse(text);
        if(!data.data) {
            throw new Error('Archivo inválido');
        }
        const response = await fetch('/api/importar-db', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if(result.ok) {
            statusEl.innerHTML = 'Importacion exitosa!';
            alert('Base de datos importada correctamente. Recargando...');
            location.reload();
        } else {
            statusEl.innerHTML = 'Error: ' + result.error;
            alert('Error al importar: ' + result.error);
        }
    } catch(e) {
        statusEl.innerHTML = 'Error: ' + e.message;
        alert('Error al importar: ' + e.message);
    }
}
async function checkUpdates(){
    const response = await fetch('/api/actualizar');
    const update = await response.json();
    if(update.disponible) {
        alert('Nueva versión disponible: ' + update.version);
    } else {
        alert('Sistema actualizado a la última versión');
    }
}

async function cargarConfigEmpresa() {
    try {
        const resp = await fetch('/api/config-empresa');
        const config = await resp.json();
        document.getElementById('empNombre').value = config.nombre || '';
        document.getElementById('empRuc').value = config.ruc || '';
        document.getElementById('empDireccion').value = config.direccion || '';
        document.getElementById('empTelefono').value = config.telefono || '';
        document.getElementById('empSlogan').value = config.slogan || '';
        document.getElementById('empTipoCambio').value = config.tipo_cambio_usd || 36.7120;
        document.getElementById('empPrefijoFac').value = config.prefijo_factura || 'F';
        document.getElementById('empPrefijoTic').value = config.prefijo_ticket || 'T';
        document.getElementById('empDigitos').value = config.digitos_correlativo || 10;
        document.getElementById('empImpuesto').value = config.impuesto_defecto || 0;
        document.getElementById('empDescDist').value = config.descuento_distribuidor || 15;
        actualizarPreviewNumero();
    } catch(e) {
        console.error('Error cargando config:', e);
    }
}

async function guardarConfigEmpresa() {
    const btn = document.getElementById('btnGuardarConfig');
    btn.classList.add('loading');
    btn.innerHTML = '<span class="spinner"></span>Guardando...';
    
    const data = {
        nombre: document.getElementById('empNombre').value,
        ruc: document.getElementById('empRuc').value,
        direccion: document.getElementById('empDireccion').value,
        telefono: document.getElementById('empTelefono').value,
        slogan: document.getElementById('empSlogan').value,
        tipo_cambio_usd: parseFloat(document.getElementById('empTipoCambio').value) || 36.7120,
        prefijo_factura: document.getElementById('empPrefijoFac').value || 'F',
        prefijo_ticket: document.getElementById('empPrefijoTic').value || 'T',
        digitos_correlativo: parseInt(document.getElementById('empDigitos').value) || 10,
        impuesto_defecto: parseFloat(document.getElementById('empImpuesto').value) || 0,
        descuento_distribuidor: parseFloat(document.getElementById('empDescDist').value) || 15
    };
    
    try {
        await fetch('/api/config-empresa', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        alert('Configuración guardada');
        actualizarPreviewNumero();
    } catch(e) {
        alert('Error: ' + e.message);
    }
    
    btn.classList.remove('loading');
    btn.textContent = 'Guardar Configuración';
}

function actualizarPreviewNumero() {
    const prefijo = document.getElementById('empPrefijoFac').value || 'F';
    const digitos = parseInt(document.getElementById('empDigitos').value) || 10;
    const ejemplo = prefijo + '1'.padStart(digitos, '0');
    document.getElementById('previewNumero').textContent = 'Ejemplo: ' + ejemplo;
}

init();
cargarConfigEmpresa();
</script></body></html>`,
    clientes: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Clientes - Priceless Imports</title>${css}</head>
<body>
<div class="header">
<div class="logo">
<div class="logo-icon">P</div>
<h1>CLIENTES - PRICELESS IMPORTS</h1>
</div>
<div><a href="/dashboard" style="color:white;text-decoration:none;font-weight:500;">← Volver</a></div>
</div>
<div style="background:white;padding:20px;display:flex;gap:12px;margin:20px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
<input id="buscar" placeholder="Buscar cliente..." style="flex:1;max-width:400px;" onkeyup="render()">
<button class="btn btn-primary" onclick="mostrarForm()">+ Agregar Cliente</button>
</div>
<h2 class="titulo-seccion">Cartera de Clientes</h2>
<table><thead><tr><th>Código</th><th>Nombre</th><th>RUC/Cédula</th><th>Teléfono</th><th>Límite Crédito</th><th>Días Crédito</th><th>Estado</th><th>Acciones</th></tr></thead>
<tbody id="tabla"></tbody></table>

<div id="modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);justify-content:center;align-items:center;z-index:1000;">
<div style="background:white;padding:30px;border-radius:16px;width:500px;max-width:95%;">
<h3 id="modalTitulo" style="color:var(--primary);margin-bottom:20px;">Nuevo Cliente</h3>
<input id="nombre" placeholder="Nombre completo" style="width:100%;margin-bottom:12px;">
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
<input id="ruc" placeholder="RUC/Cédula">
<input id="telefono" placeholder="Teléfono">
</div>
<input id="direccion" placeholder="Dirección" style="width:100%;margin-bottom:12px;">
<input id="email" placeholder="Email" type="email" style="width:100%;margin-bottom:12px;">
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
<input id="limite" placeholder="Límite de Crédito" type="number">
<input id="dias" placeholder="Días de Crédito" type="number">
</div>
<div style="display:flex;gap:12px;justify-content:flex-end;">
<button class="btn" onclick="cerrarModal()">Cancelar</button>
<button class="btn btn-primary" onclick="guardar()">Guardar</button>
</div>
</div>
</div>

<script>
let clientes = [], editId = null;
async function init(){ clientes = await fetch('/api/clientes').then(r=>r.json()); render(); }
function render(){
    const f = document.getElementById('buscar').value.toLowerCase();
    document.getElementById('tabla').innerHTML = clientes.filter(c=>f===''||c.nombre.toLowerCase().includes(f)||c.ruc.includes(f)).map(c=>'<tr><td>'+c.codigo+'</td><td>'+c.nombre+'</td><td>'+c.ruc+'</td><td>'+c.telefono+'</td><td>C$ '+c.limite_credito.toFixed(2)+'</td><td>'+c.dias_credito+'</td><td><span class="badge '+(c.activo?'badge-verde':'badge-rojo')+'">'+(c.activo?'Activo':'Inactivo')+'</span></td><td><button class="btn" style="padding:6px 12px;font-size:12px;" onclick="editar('+c.id+')">✏️</button> <button class="btn btn-rojo" style="padding:6px 12px;font-size:12px;" onclick="eliminar('+c.id+')">🗑️</button></td></tr>').join('')||'<tr><td colspan="8" class="empty-state">No hay clientes</td></tr>';
}
function mostrarForm(){ editId = null; document.getElementById('modalTitulo').textContent = 'Nuevo Cliente'; document.getElementById('nombre').value = ''; document.getElementById('ruc').value = ''; document.getElementById('telefono').value = ''; document.getElementById('direccion').value = ''; document.getElementById('email').value = ''; document.getElementById('limite').value = '0'; document.getElementById('dias').value = '0'; document.getElementById('modal').style.display = 'flex'; }
function cerrarModal(){ document.getElementById('modal').style.display = 'none'; }
function editar(id){ const c = clientes.find(x=>x.id===id); if(!c)return; editId = id; document.getElementById('modalTitulo').textContent = 'Editar Cliente'; document.getElementById('nombre').value = c.nombre; document.getElementById('ruc').value = c.ruc; document.getElementById('telefono').value = c.telefono; document.getElementById('direccion').value = c.direccion || ''; document.getElementById('email').value = c.email || ''; document.getElementById('limite').value = c.limite_credito; document.getElementById('dias').value = c.dias_credito; document.getElementById('modal').style.display = 'flex'; }
async function guardar(){
    const data = { nombre: document.getElementById('nombre').value, ruc: document.getElementById('ruc').value, telefono: document.getElementById('telefono').value, direccion: document.getElementById('direccion').value, email: document.getElementById('email').value, limite_credito: parseFloat(document.getElementById('limite').value)||0, dias_credito: parseInt(document.getElementById('dias').value)||0 };
    if(!data.nombre){ alert('El nombre es obligatorio'); return; }
    const metodo = editId ? 'PUT' : 'POST';
    if(editId) data.id = editId;
    await fetch('/api/cliente', {method:metodo, headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    cerrarModal(); init();
}
async function eliminar(id){ if(!confirm('¿Inactivar este cliente?'))return; await fetch('/api/cliente', {method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id})}); init(); }
init();
</script></body></html>`,
    proveedores: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Proveedores - Priceless Imports</title>${css}</head>
<body>
<div class="header">
<div class="logo">
<div class="logo-icon">P</div>
<h1>PROVEEDORES - PRICELESS IMPORTS</h1>
</div>
<div><a href="/dashboard" style="color:white;text-decoration:none;font-weight:500;">← Volver</a></div>
</div>
<div style="background:white;padding:20px;display:flex;gap:12px;margin:20px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
<input id="buscar" placeholder="Buscar proveedor..." style="flex:1;max-width:400px;" onkeyup="render()">
<button class="btn btn-primary" onclick="mostrarForm()">+ Agregar Proveedor</button>
</div>
<h2 class="titulo-seccion">Catálogo de Proveedores</h2>
<table><thead><tr><th>Código</th><th>Nombre</th><th>RUC</th><th>Teléfono</th><th>Email</th><th>Contacto</th><th>Estado</th><th>Acciones</th></tr></thead>
<tbody id="tabla"></tbody></table>

<div id="modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);justify-content:center;align-items:center;z-index:1000;">
<div style="background:white;padding:30px;border-radius:16px;width:500px;max-width:95%;">
<h3 id="modalTitulo" style="color:var(--primary);margin-bottom:20px;">Nuevo Proveedor</h3>
<input id="nombre" placeholder="Nombre del proveedor" style="width:100%;margin-bottom:12px;">
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
<input id="ruc" placeholder="RUC">
<input id="telefono" placeholder="Teléfono">
</div>
<input id="direccion" placeholder="Dirección" style="width:100%;margin-bottom:12px;">
<input id="email" placeholder="Email" type="email" style="width:100%;margin-bottom:12px;">
<input id="contacto" placeholder="Persona de contacto" style="width:100%;margin-bottom:20px;">
<div style="display:flex;gap:12px;justify-content:flex-end;">
<button class="btn" onclick="cerrarModal()">Cancelar</button>
<button class="btn btn-primary" onclick="guardar()">Guardar</button>
</div>
</div>
</div>

<script>
let proveedores = [], editId = null;
async function init(){ proveedores = await fetch('/api/proveedores').then(r=>r.json()); render(); }
function render(){
    const f = document.getElementById('buscar').value.toLowerCase();
    document.getElementById('tabla').innerHTML = proveedores.filter(p=>f===''||p.nombre.toLowerCase().includes(f)||p.ruc.includes(f)).map(p=>'<tr><td>'+p.codigo+'</td><td>'+p.nombre+'</td><td>'+p.ruc+'</td><td>'+p.telefono+'</td><td>'+(p.email||'-')+'</td><td>'+(p.contacto||'-')+'</td><td><span class="badge '+(p.activo?'badge-verde':'badge-rojo')+'">'+(p.activo?'Activo':'Inactivo')+'</span></td><td><button class="btn" style="padding:6px 12px;font-size:12px;" onclick="editar('+p.id+')">✏️</button> <button class="btn btn-rojo" style="padding:6px 12px;font-size:12px;" onclick="eliminar('+p.id+')">🗑️</button></td></tr>').join('')||'<tr><td colspan="8" class="empty-state">No hay proveedores</td></tr>';
}
function mostrarForm(){ editId = null; document.getElementById('modalTitulo').textContent = 'Nuevo Proveedor'; document.getElementById('nombre').value = ''; document.getElementById('ruc').value = ''; document.getElementById('telefono').value = ''; document.getElementById('direccion').value = ''; document.getElementById('email').value = ''; document.getElementById('contacto').value = ''; document.getElementById('modal').style.display = 'flex'; }
function cerrarModal(){ document.getElementById('modal').style.display = 'none'; }
function editar(id){ const p = proveedores.find(x=>x.id===id); if(!p)return; editId = id; document.getElementById('modalTitulo').textContent = 'Editar Proveedor'; document.getElementById('nombre').value = p.nombre; document.getElementById('ruc').value = p.ruc; document.getElementById('telefono').value = p.telefono; document.getElementById('direccion').value = p.direccion || ''; document.getElementById('email').value = p.email || ''; document.getElementById('contacto').value = p.contacto || ''; document.getElementById('modal').style.display = 'flex'; }
async function guardar(){
    const data = { nombre: document.getElementById('nombre').value, ruc: document.getElementById('ruc').value, telefono: document.getElementById('telefono').value, direccion: document.getElementById('direccion').value, email: document.getElementById('email').value, contacto: document.getElementById('contacto').value };
    if(!data.nombre){ alert('El nombre es obligatorio'); return; }
    const metodo = editId ? 'PUT' : 'POST';
    if(editId) data.id = editId;
    await fetch('/api/proveedor', {method:metodo, headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    cerrarModal(); init();
}
async function eliminar(id){ if(!confirm('¿Inactivar este proveedor?'))return; await fetch('/api/proveedor', {method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id})}); init(); }
init();
</script></body></html>`,
    cartera: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Cartera - Priceless Imports</title>${css}</head>
<body>
<div class="header">
<div class="logo">
<div class="logo-icon">P</div>
<h1>CARTERA - PRICELESS IMPORTS</h1>
</div>
<div><a href="/dashboard" style="color:white;text-decoration:none;font-weight:500;">← Volver</a></div>
</div>
<div class="main" style="padding:20px;">
<div class="stats" id="stats"></div>
<div style="display:flex;gap:20px;margin-top:20px;">
<div style="flex:1;">
<h2 class="titulo-seccion">Cuentas por Cobrar</h2>
<table><thead><tr><th>Cliente</th><th>Documento</th><th>Monto</th><th>Vencimiento</th><th>Estado</th><th>Acción</th></tr></thead>
<tbody id="cobrar"></tbody></table>
</div>
<div style="flex:1;">
<h2 class="titulo-seccion">Cuentas por Pagar</h2>
<table><thead><tr><th>Proveedor</th><th>Documento</th><th>Monto</th><th>Vencimiento</th><th>Estado</th><th>Acción</th></tr></thead>
<tbody id="pagar"></tbody></table>
</div>
</div>
</div>

<div id="pagoModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);justify-content:center;align-items:center;z-index:1000;">
<div style="background:white;padding:30px;border-radius:16px;width:400px;max-width:95%;">
<h3 style="color:var(--primary);margin-bottom:20px;">Registrar Pago</h3>
<p id="pagoInfo" style="margin-bottom:20px;color:var(--textoLight);"></p>
<input id="montoPago" placeholder="Monto a pagar" type="number" style="width:100%;margin-bottom:12px;">
<select id="metodoPago" style="width:100%;margin-bottom:20px;">
<option value="efectivo">Efectivo</option>
<option value="transferencia">Transferencia</option>
<option value="tarjeta">Tarjeta</option>
</select>
<div style="display:flex;gap:12px;justify-content:flex-end;">
<button class="btn" onclick="cerrarPago()">Cancelar</button>
<button class="btn btn-primary" onclick="confirmarPago()">Confirmar Pago</button>
</div>
</div>
</div>

<script>
let cuentasCobrar = [], cuentasPagar = [], pagoData = { tipo: '', id: null };
async function init(){
    const [cartera, cobrar, pagar] = await Promise.all([
        fetch('/api/dashboard-cartera').then(r=>r.json()),
        fetch('/api/cuentas-cobrar').then(r=>r.json()),
        fetch('/api/cuentas-pagar').then(r=>r.json())
    ]);
    cuentasCobrar = cobrar;
    cuentasPagar = pagar;
    document.getElementById('stats').innerHTML = 
        '<div class="stat" style="background:linear-gradient(135deg, var(--verde), #4caf50);"><h3>C$ '+cartera.totalCobrar.toFixed(2)+'</h3><p>Por Cobrar</p></div>' +
        '<div class="stat" style="background:linear-gradient(135deg, var(--rojo), #f44336);"><h3>C$ '+cartera.totalPagar.toFixed(2)+'</h3><p>Por Pagar</p></div>' +
        '<div class="stat"><h3>C$ '+cartera.vencidoCobrar.toFixed(2)+'</h3><p>Vencido Cobrar</p></div>' +
        '<div class="stat"><h3>C$ '+cartera.vencidoPagar.toFixed(2)+'</h3><p>Vencido Pagar</p></div>';
    renderCuentas();
}
function estaVencido(fecha){ return new Date(fecha) < new Date(); }
function renderCobrar(){
    document.getElementById('cobrar').innerHTML = cuentasCobrar.map(c=>'<tr><td>'+c.cliente_nombre+'</td><td>'+c.documento+'</td><td>C$ '+c.monto_actual.toFixed(2)+'</td><td style="color:'+(estaVencido(c.fecha_vencimiento)?'var(--rojo)':'inherit')+';">'+new Date(c.fecha_vencimiento).toLocaleDateString()+'</td><td><span class="badge '+(c.estado==='pagada'?'badge-verde':'badge-rojo')+'">'+c.estado+'</span></td><td>'+(c.estado==='pendiente'?'<button class="btn btn-verde" style="padding:6px 12px;font-size:12px;" onclick="mostrarPago('+c.id+',\'cobrar\')">Pagar</button>':'--')+'</td></tr>').join('')||'<tr><td colspan="6" class="empty-state">No hay cuentas por cobrar</td></tr>';
}
function renderPagar(){
    document.getElementById('pagar').innerHTML = cuentasPagar.map(c=>'<tr><td>'+c.proveedor_nombre+'</td><td>'+c.documento+'</td><td>C$ '+c.monto_actual.toFixed(2)+'</td><td style="color:'+(estaVencido(c.fecha_vencimiento)?'var(--rojo)':'inherit')+';">'+new Date(c.fecha_vencimiento).toLocaleDateString()+'</td><td><span class="badge '+(c.estado==='pagada'?'badge-verde':'badge-rojo')+'">'+c.estado+'</span></td><td>'+(c.estado==='pendiente'?'<button class="btn btn-verde" style="padding:6px 12px;font-size:12px;" onclick="mostrarPago('+c.id+',\'pagar\')">Pagar</button>':'--')+'</td></tr>').join('')||'<tr><td colspan="6" class="empty-state">No hay cuentas por pagar</td></tr>';
}
function renderCuentas(){ renderCobrar(); renderPagar(); }
function mostrarPago(id, tipo){
    const cuentas = tipo === 'cobrar' ? cuentasCobrar : cuentasPagar;
    const cuenta = cuentas.find(c=>c.id === id);
    if(!cuenta) return;
    pagoData = { tipo, id };
    const nombre = tipo === 'cobrar' ? cuenta.cliente_nombre : cuenta.proveedor_nombre;
    document.getElementById('pagoInfo').textContent = nombre + ' - Saldo: C$ ' + cuenta.monto_actual.toFixed(2);
    document.getElementById('montoPago').value = cuenta.monto_actual.toFixed(2);
    document.getElementById('pagoModal').style.display = 'flex';
}
function cerrarPago(){ document.getElementById('pagoModal').style.display = 'none'; }
async function confirmarPago(){
    const monto = parseFloat(document.getElementById('montoPago').value);
    const metodo = document.getElementById('metodoPago').value;
    if(!monto || monto <= 0){ alert('Monto inválido'); return; }
    const url = pagoData.tipo === 'cobrar' ? '/api/pago-cobrar' : '/api/pago-pagar';
    await fetch(url, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id: pagoData.id, monto, metodo})});
    cerrarPago(); init();
}
init();
</script></body></html>`,
    contabilidad: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Contabilidad - Priceless Imports</title>${css}</head>
<body>
<div class="header">
<div class="logo">
<div class="logo-icon">P</div>
<h1>CONTABILIDAD - PRICELESS IMPORTS</h1>
</div>
<div><a href="/dashboard" style="color:white;text-decoration:none;font-weight:500;">← Volver</a></div>
</div>
<div style="background:white;padding:20px;display:flex;gap:12px;margin:20px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
<button class="btn btn-primary" onclick="mostrarFormCuenta()">+ Nueva Cuenta</button>
<button class="btn" onclick="cargarPlanCuentas()">Plan de Cuentas</button>
<button class="btn" onclick="location.href='/asientos'">Ver Asientos</button>
<button class="btn" onclick="location.href='/balance'">Balance de Comprobación</button>
</div>

<h2 class="titulo-seccion">Plan de Cuentas Contables</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;margin-top:20px;" id="cuentasGrid"></div>

<div id="cuentaModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);justify-content:center;align-items:center;z-index:1000;">
<div style="background:white;padding:30px;border-radius:16px;width:450px;max-width:95%;">
<h3 id="cuentaModalTitulo" style="color:var(--primary);margin-bottom:20px;">Nueva Cuenta Contable</h3>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
<input id="codigo" placeholder="Código (ej: 1101-01)">
<select id="naturaleza" style="padding:12px;">
<option value="deudora">Naturaleza Deudora</option>
<option value="acreedora">Naturaleza Acreedora</option>
</select>
</div>
<input id="nombreCuenta" placeholder="Nombre de la cuenta" style="width:100%;margin-bottom:12px;">
<select id="tipoCuenta" style="width:100%;margin-bottom:20px;padding:12px;">
<option value="auxiliar">Cuenta Auxiliar</option>
<option value="grupo">Grupo</option>
<option value="mayor">Cuenta de Mayor</option>
</select>
<div style="display:flex;gap:12px;justify-content:flex-end;">
<button class="btn" onclick="cerrarModal()">Cancelar</button>
<button class="btn btn-primary" onclick="guardarCuenta()">Guardar</button>
</div>
</div>
</div>

<script>
let cuentas = [], editCuentaId = null;
async function init(){ await cargarPlanCuentas(); }
async function cargarPlanCuentas(){
    cuentas = await fetch('/api/cuentas-contables').then(r=>r.json());
    render();
}
function render(){
    document.getElementById('cuentasGrid').innerHTML = cuentas.filter(c=>c.activo).map(c=>'<div style="background:white;padding:16px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.05);border-left:4px solid '+(c.naturaleza==='deudora'?'var(--primary)':'var(--rojo)')+'"><div style="font-weight:600;color:var(--primary);">'+c.codigo+'</div><div style="font-size:14px;margin:8px 0;">'+c.nombre+'</div><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--textoLight);"><span>'+(c.naturaleza==='deudora'?'Deudora':'Acreedora')+'</span><span>'+c.tipo+'</span></div></div>').join('')||'<div class="empty-state"><p>No hay cuentas contables. Cree el plan de cuentas.</p></div>';
}
function mostrarFormCuenta(){ editCuentaId = null; document.getElementById('cuentaModalTitulo').textContent = 'Nueva Cuenta Contable'; document.getElementById('codigo').value = ''; document.getElementById('nombreCuenta').value = ''; document.getElementById('naturaleza').value = 'deudora'; document.getElementById('tipoCuenta').value = 'auxiliar'; document.getElementById('cuentaModal').style.display = 'flex'; }
function cerrarModal(){ document.getElementById('cuentaModal').style.display = 'none'; }
async function guardarCuenta(){
    const data = { codigo: document.getElementById('codigo').value, nombre: document.getElementById('nombreCuenta').value, naturaleza: document.getElementById('naturaleza').value, tipo: document.getElementById('tipoCuenta').value };
    if(!data.codigo || !data.nombre){ alert('Código y nombre son obligatorios'); return; }
    const metodo = editCuentaId ? 'PUT' : 'POST';
    if(editCuentaId) data.id = editCuentaId;
    await fetch('/api/cuenta-contable', {method:metodo, headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    cerrarModal(); cargarPlanCuentas();
}
init();
</script></body></html>`,
    asientos: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Asientos Contables - Priceless Imports</title>${css}</head>
<body>
<div class="header">
<div class="logo">
<div class="logo-icon">P</div>
<h1>ASIENTOS CONTABLES - PRICELESS IMPORTS</h1>
</div>
<div><a href="/dashboard" style="color:white;text-decoration:none;font-weight:500;">← Volver</a></div>
</div>
<div style="background:white;padding:20px;display:flex;gap:12px;margin:20px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
<input type="date" id="fechaIni" style="padding:10px;border:2px solid #ddd;border-radius:8px;">
<input type="date" id="fechaFin" style="padding:10px;border:2px solid #ddd;border-radius:8px;">
<button class="btn btn-primary" onclick="buscarAsientos()">Buscar</button>
<button class="btn btn-verde" onclick="mostrarFormAsiento()">+ Nuevo Asiento</button>
</div>

<h2 class="titulo-seccion">Libro Diario - Asientos Contables</h2>
<table><thead><tr><th>No.</th><th>Fecha</th><th>Concepto</th><th>Referencia</th><th>Total</th><th>Estado</th><th>Acción</th></tr></thead>
<tbody id="tabla"></tbody></table>

<div id="asientoModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);justify-content:center;align-items:center;z-index:1000;overflow-y:auto;">
<div style="background:white;padding:30px;border-radius:16px;width:700px;max-width:95%;margin:50px auto;">
<h3 style="color:var(--primary);margin-bottom:20px;">Nuevo Asiento (Partida Doble)</h3>
<input id="fechaAsiento" type="date" style="width:100%;margin-bottom:12px;padding:12px;">
<input id="concepto" placeholder="Concepto del asiento" style="width:100%;margin-bottom:12px;padding:12px;">
<input id="referencia" placeholder="Referencia (factura, etc.)" style="width:100%;margin-bottom:20px;padding:12px;">
<h4 style="color:var(--primary);margin-bottom:10px;">Movimientos</h4>
<div id="movimientosContainer" style="max-height:300px;overflow-y:auto;margin-bottom:20px;"></div>
<button class="btn" onclick="agregarMovimiento()" style="margin-bottom:20px;">+ Agregar Movimiento</button>
<div style="display:flex;justify-content:space-between;align-items:center;padding:15px;background:var(--fondo);border-radius:8px;margin-bottom:20px;">
<span style="font-weight:600;">Total Débito: <span id="totalDebito" style="color:var(--primary);">C$ 0.00</span></span>
<span style="font-weight:600;">Total Crédito: <span id="totalCredito" style="color:var(--rojo);">C$ 0.00</span></span>
</div>
<div style="display:flex;gap:12px;justify-content:flex-end;">
<button class="btn" onclick="cerrarAsiento()">Cancelar</button>
<button class="btn btn-primary" onclick="guardarAsiento()">Guardar Asiento</button>
</div>
</div>
</div>

<script>
let asientos = [], cuentas = [], movimientos = [], usuario = JSON.parse(localStorage.getItem('usuario')||'{}');
async function init(){ 
    const urlParams = new URLSearchParams(window.location.search);
    const fi = urlParams.get('fi') || new Date().toISOString().split('T')[0];
    const ff = urlParams.get('ff') || fi;
    document.getElementById('fechaIni').value = fi;
    document.getElementById('fechaFin').value = ff;
    await buscarAsientos(); 
    cuentas = await fetch('/api/cuentas-contables').then(r=>r.json());
    document.getElementById('fechaAsiento').value = new Date().toISOString().split('T')[0];
    agregarMovimiento(); agregarMovimiento();
}
async function buscarAsientos(){
    const fi = document.getElementById('fechaIni').value;
    const ff = document.getElementById('fechaFin').value;
    asientos = await fetch('/api/asientos?fi='+fi+'&ff='+ff).then(r=>r.json());
    render();
}
function render(){
    document.getElementById('tabla').innerHTML = asientos.map(a=>'<tr><td>'+a.numero+'</td><td>'+a.fecha+'</td><td>'+a.concepto+'</td><td>'+(a.referencia||'-')+'</td><td>C$ '+a.total.toFixed(2)+'</td><td><span class="badge '+(a.estado==='activo'?'badge-verde':'badge-rojo')+'">'+a.estado+'</span></td><td>'+(a.estado==='activo'?'<button class="btn btn-rojo" style="padding:6px 10px;font-size:12px;" onclick="anular('+a.id+')">Anular</button>':'--')+'</td></tr>').join('')||'<tr><td colspan="7" class="empty-state">No hay asientos en este período</td></tr>';
}
function mostrarFormAsiento(){ movimientos = []; document.getElementById('movimientosContainer').innerHTML = ''; agregarMovimiento(); agregarMovimiento(); document.getElementById('asientoModal').style.display = 'flex'; }
function cerrarAsiento(){ document.getElementById('asientoModal').style.display = 'none'; }
function agregarMovimiento(){
    const id = movimientos.length;
    movimientos.push({ cuenta_id: null, tipo: 'debito', monto: 0 });
    const opts = cuentas.filter(c=>c.activo).map(c=>'<option value="'+c.id+'">'+c.codigo+' - '+c.nombre+'</option>').join('');
    const div = document.createElement('div');
    div.id = 'mov-' + id;
    div.style.cssText = 'display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px;margin-bottom:10px;padding:10px;background:#f8f9fa;border-radius:8px;';
    div.innerHTML = '<select onchange="actualizarMov('+id+',\'cuenta_id\',this.value)"><option value="">-- Cuenta --</option>'+opts+'</select><select onchange="actualizarMov('+id+',\'tipo\',this.value)"><option value="debito">Débito</option><option value="credito">Crédito</option></select><input type="number" placeholder="Monto" onchange="actualizarMov('+id+',\'monto\',this.value)">';
    document.getElementById('movimientosContainer').appendChild(div);
}
function actualizarMov(idx, campo, valor){ if(campo === 'monto') movimientos[idx][campo] = parseFloat(valor) || 0; else movimientos[idx][campo] = campo === 'cuenta_id' ? parseInt(valor) : valor; actualizarTotales(); }
function actualizarTotales(){ const deb = movimientos.filter(m=>m.tipo==='debito').reduce((s,m)=>s+m.monto,0); const cred = movimientos.filter(m=>m.tipo==='credito').reduce((s,m)=>s+m.monto,0); document.getElementById('totalDebito').textContent = 'C$ '+deb.toFixed(2); document.getElementById('totalCredito').textContent = 'C$ '+cred.toFixed(2); document.getElementById('totalDebito').style.color = Math.abs(deb-cred)<0.01 ? 'var(--verde)' : 'var(--rojo)'; document.getElementById('totalCredito').style.color = Math.abs(deb-cred)<0.01 ? 'var(--verde)' : 'var(--rojo)'; }
async function guardarAsiento(){
    const data = { fecha: document.getElementById('fechaAsiento').value, concepto: document.getElementById('concepto').value, referencia: document.getElementById('referencia').value, usuario: usuario.nombre, movimientos: movimientos.filter(m=>m.cuenta_id && m.monto > 0) };
    if(!data.concepto || data.movimientos.length < 2){ alert('Concepto y al menos 2 movimientos son requeridos'); return; }
    const r = await fetch('/api/asiento', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    const d = await r.json();
    if(d.error){ alert(d.error); return; }
    cerrarAsiento(); buscarAsientos();
}
async function anular(id){ if(!confirm('¿Anular este asiento?'))return; await fetch('/api/asiento/'+id, {method:'DELETE'}); buscarAsientos(); }
init();
</script></body></html>`,
    balance: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Balance de Comprobación - Priceless Imports</title>${css}</head>
<body>
<div class="header">
<div class="logo">
<div class="logo-icon">P</div>
<h1>BALANCE DE COMPROBACIÓN - PRICELESS IMPORTS</h1>
</div>
<div><a href="/dashboard" style="color:white;text-decoration:none;font-weight:500;">← Volver</a></div>
</div>
<div style="background:white;padding:20px;display:flex;gap:12px;margin:20px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
<input type="date" id="fechaBalance" style="padding:10px;border:2px solid #ddd;border-radius:8px;">
<button class="btn btn-primary" onclick="cargarBalance()">Generar Balance</button>
<button class="btn" onclick="imprimirBalance()">Imprimir</button>
</div>

<div id="balancePrint" style="padding:20px;">
<h2 class="titulo-seccion">Balance de Comprobación</h2>
<p id="fechaReporte" style="color:var(--textoLight);margin-bottom:20px;"></p>
<table><thead><tr><th>Código</th><th>Cuenta</th><th>Naturaleza</th><th style="text-align:right;">Débitos</th><th style="text-align:right;">Créditos</th><th style="text-align:right;">Saldo</th></tr></thead>
<tbody id="tabla"></tbody>
<tfoot id="totales"></tfoot>
</table>
</div>

<script>
async function init(){
    document.getElementById('fechaBalance').value = new Date().toISOString().split('T')[0];
    await cargarBalance();
}
async function cargarBalance(){
    const fecha = document.getElementById('fechaBalance').value;
    const d = await fetch('/api/balance-comprobacion?fecha='+fecha).then(r=>r.json());
    document.getElementById('fechaReporte').textContent = 'Fecha: ' + d.fecha;
    document.getElementById('tabla').innerHTML = d.cuentas.map(c=>'<tr><td>'+c.codigo+'</td><td>'+c.nombre+'</td><td><span class="badge '+(c.naturaleza==='deudora'?'badge-primary':'badge-rojo')+'">'+c.naturaleza+'</span></td><td style="text-align:right;">'+(c.debitos>0?'C$ '+c.debitos.toFixed(2):'-')+'</td><td style="text-align:right;">'+(c.creditos>0?'C$ '+c.creditos.toFixed(2):'-')+'</td><td style="text-align:right;font-weight:600;color:'+(c.saldo>=0?'var(--primary)':'var(--rojo)')+'">'+(c.saldo>=0?'':'(')+'C$ '+Math.abs(c.saldo).toFixed(2)+(c.saldo>=0?'':')')+'</td></tr>').join('');
    document.getElementById('totales').innerHTML = '<tr style="font-weight:700;background:var(--fondo);"><td colspan="3">TOTALES</td><td style="text-align:right;">C$ '+d.totalDebitos.toFixed(2)+'</td><td style="text-align:right;">C$ '+d.totalCreditos.toFixed(2)+'</td><td style="text-align:right;">C$ '+d.totalSaldo.toFixed(2)+'</td></tr>';
}
function imprimirBalance(){ window.print(); }
init();
</script></body></html>`,
    kardex: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Kárdex - Priceless Imports</title>${css}</head>
<body>
<div class="header">
<div class="logo">
<div class="logo-icon">P</div>
<h1>KÁRDEX - CONTROL DE INVENTARIO</h1>
</div>
<div><a href="/dashboard" style="color:white;text-decoration:none;font-weight:500;">← Volver</a></div>
</div>
<div style="background:white;padding:20px;display:flex;gap:12px;margin:20px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);flex-wrap:wrap;">
<select id="productoSelect" onchange="cargarKardex()" style="min-width:250px;padding:10px;">
<option value="">-- Seleccionar Producto --</option>
</select>
<input type="date" id="fechaIni" style="padding:10px;">
<input type="date" id="fechaFin" style="padding:10px;">
<button class="btn btn-primary" onclick="cargarKardex()">Buscar</button>
<button class="btn btn-verde" onclick="mostrarMovimiento()">+ Nuevo Movimiento</button>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:20px;">
<div class="card">
<h3 style="color:var(--primary);margin-bottom:15px;">Resumen del Producto</h3>
<div id="resumenProducto"></div>
</div>
<div class="card">
<h3 style="color:var(--primary);margin-bottom:15px;">Estadísticas</h3>
<div id="estadisticas"></div>
</div>
</div>

<h2 class="titulo-seccion">Movimientos de Inventario</h2>
<table><thead><tr><th>Fecha</th><th>Tipo</th><th>Cantidad</th><th>Costo Unit.</th><th>Costo Total</th><th>Referencia</th><th>Usuario</th></tr></thead>
<tbody id="tabla"></tbody></table>

<div id="movimientoModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);justify-content:center;align-items:center;z-index:1000;">
<div style="background:white;padding:30px;border-radius:16px;width:450px;max-width:95%;">
<h3 style="color:var(--primary);margin-bottom:20px;">Nuevo Movimiento</h3>
<select id="tipoMovimiento" style="width:100%;margin-bottom:12px;padding:12px;">
<option value="entrada">Entrada (Compra/Ajuste +)</option>
<option value="salida">Salida (Venta/Ajuste -)</option>
<option value="ajuste">Ajuste de Inventario</option>
</select>
<select id="productoMov" style="width:100%;margin-bottom:12px;padding:12px;">
<option value="">-- Seleccionar Producto --</option>
</select>
<input id="cantidad" type="number" placeholder="Cantidad" style="width:100%;margin-bottom:12px;">
<input id="costo" type="number" placeholder="Costo Unitario" style="width:100%;margin-bottom:12px;">
<input id="referencia" placeholder="Referencia (No. Factura/Orden)" style="width:100%;margin-bottom:12px;">
<input id="observaciones" placeholder="Observaciones" style="width:100%;margin-bottom:20px;">
<div style="display:flex;gap:12px;justify-content:flex-end;">
<button class="btn" onclick="cerrarModal()">Cancelar</button>
<button class="btn btn-primary" onclick="guardarMovimiento()">Guardar</button>
</div>
</div>
</div>

<script>
let productos = [], movimientos = [];
async function init(){
    productos = await fetch('/api/productos').then(r=>r.json());
    const opts = productos.map(p=>'<option value="'+p.id+'">'+p.codigo_barra+' - '+p.nombre+'</option>').join('');
    document.getElementById('productoSelect').innerHTML = '<option value="">-- Seleccionar Producto --</option>' + opts;
    document.getElementById('productoMov').innerHTML = '<option value="">-- Seleccionar Producto --</option>' + opts;
    document.getElementById('fechaIni').value = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
    document.getElementById('fechaFin').value = new Date().toISOString().split('T')[0];
}
async function cargarKardex(){
    const pid = document.getElementById('productoSelect').value;
    if(!pid){ document.getElementById('tabla').innerHTML = '<tr><td colspan="7" class="empty-state">Seleccione un producto</td></tr>'; return; }
    const fi = document.getElementById('fechaIni').value;
    const ff = document.getElementById('fechaFin').value;
    movimientos = await fetch('/api/kardex?productoId='+pid+'&fi='+fi+'&ff='+ff).then(r=>r.json());
    const producto = productos.find(p=>p.id == pid);
    document.getElementById('resumenProducto').innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;"><div><strong>Stock Actual:</strong></div><div style="color:var(--primary);font-weight:700;">'+producto.cantidad+'</div><div><strong>Costo Promedio:</strong></div><div>C$ '+(producto.costo_promedio||0).toFixed(2)+'</div><div><strong>Stock Mínimo:</strong></div><div>'+producto.stock_minimo+'</div></div>';
    const entradas = movimientos.filter(m=>m.tipo==='entrada').reduce((s,m)=>s+m.cantidad,0);
    const salidas = movimientos.filter(m=>m.tipo==='salida').reduce((s,m)=>s+m.cantidad,0);
    document.getElementById('estadisticas').innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;"><div>Total Entradas:</div><div style="color:var(--verde);font-weight:600;">'+entradas+'</div><div>Total Salidas:</div><div style="color:var(--rojo);font-weight:600;">'+salidas+'</div></div>';
    document.getElementById('tabla').innerHTML = movimientos.map(m=>'<tr><td>'+m.fecha+'</td><td><span class="badge '+(m.tipo==='entrada'?'badge-verde':m.tipo==='salida'?'badge-rojo':'badge-primary')+'">'+m.tipo.toUpperCase()+'</span></td><td>'+m.cantidad+'</td><td>C$ '+m.costo_unitario.toFixed(2)+'</td><td>C$ '+m.costo_total.toFixed(2)+'</td><td>'+(m.referencia||'-')+'</td><td>'+m.usuario+'</td></tr>').join('')||'<tr><td colspan="7" class="empty-state">Sin movimientos</td></tr>';
}
function mostrarMovimiento(){ document.getElementById('movimientoModal').style.display = 'flex'; }
function cerrarModal(){ document.getElementById('movimientoModal').style.display = 'none'; }
async function guardarMovimiento(){
    const data = { producto_id: parseInt(document.getElementById('productoMov').value), tipo: document.getElementById('tipoMovimiento').value, cantidad: parseFloat(document.getElementById('cantidad').value), costo_unitario: parseFloat(document.getElementById('costo').value)||0, referencia: document.getElementById('referencia').value, observaciones: document.getElementById('observaciones').value };
    if(!data.producto_id || !data.cantidad){ alert('Producto y cantidad son requeridos'); return; }
    const producto = productos.find(p=>p.id === data.producto_id);
    data.producto_nombre = producto.nombre;
    data.cantidad_nueva = data.tipo === 'entrada' ? producto.cantidad + data.cantidad : Math.max(0, producto.cantidad - data.cantidad);
    await fetch('/api/kardex', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    cerrarModal(); cargarKardex();
}
init();
</script></body></html>`,
    bancario: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Cuentas Corrientes - Priceless Imports</title>${css}</head>
<body>
<div class="header">
<div class="logo">
<div class="logo-icon">P</div>
<h1>CUENTAS CORRIENTES - BANCARIO</h1>
</div>
<div><a href="/dashboard" style="color:white;text-decoration:none;font-weight:500;">← Volver</a></div>
</div>
<div style="background:white;padding:20px;display:flex;gap:12px;margin:20px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
<button class="btn btn-primary" onclick="mostrarCuenta()">+ Nueva Cuenta</button>
<button class="btn" onclick="mostrarMovimiento()">+ Registrar Movimiento</button>
<button class="btn" onclick="location.href='/conciliacion'">Conciliación</button>
</div>

<h2 class="titulo-seccion">Cuentas Bancarias</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin:20px;" id="cuentasGrid"></div>

<h2 class="titulo-seccion">Movimientos Recientes</h2>
<div style="background:white;padding:20px;margin:20px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
<div style="display:flex;gap:12px;margin-bottom:20px;">
<select id="cuentaFiltro" onchange="cargarMovimientos()" style="min-width:200px;">
<option value="">Todas las cuentas</option>
</select>
<input type="date" id="fechaIni" onchange="cargarMovimientos()">
<input type="date" id="fechaFin" onchange="cargarMovimientos()">
</div>
<table><thead><tr><th>Fecha</th><th>Cuenta</th><th>Tipo</th><th>Beneficiario</th><th>Concepto</th><th style="text-align:right;">Monto</th><th>Estado</th></tr></thead>
<tbody id="tabla"></tbody></table>
</div>

<div id="cuentaModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);justify-content:center;align-items:center;z-index:1000;">
<div style="background:white;padding:30px;border-radius:16px;width:450px;max-width:95%;">
<h3 style="color:var(--primary);margin-bottom:20px;">Nueva Cuenta Bancaria</h3>
<input id="nombreCuenta" placeholder="Nombre de la cuenta" style="width:100%;margin-bottom:12px;">
<input id="banco" placeholder="Banco" style="width:100%;margin-bottom:12px;">
<input id="numeroCuenta" placeholder="Número de cuenta" style="width:100%;margin-bottom:12px;">
<select id="tipoCuenta" style="width:100%;margin-bottom:12px;padding:12px;">
<option value="corriente">Cuenta Corriente</option>
<option value="ahorro">Cuenta de Ahorro</option>
</select>
<input id="saldoInicial" type="number" placeholder="Saldo inicial" style="width:100%;margin-bottom:20px;">
<div style="display:flex;gap:12px;justify-content:flex-end;">
<button class="btn" onclick="cerrarModal()">Cancelar</button>
<button class="btn btn-primary" onclick="guardarCuenta()">Guardar</button>
</div>
</div>
</div>

<div id="movimientoModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);justify-content:center;align-items:center;z-index:1000;">
<div style="background:white;padding:30px;border-radius:16px;width:500px;max-width:95%;">
<h3 style="color:var(--primary);margin-bottom:20px;">Registrar Movimiento</h3>
<select id="cuentaMov" style="width:100%;margin-bottom:12px;padding:12px;">
<option value="">-- Seleccionar Cuenta --</option>
</select>
<select id="tipoMov" style="width:100%;margin-bottom:12px;padding:12px;">
<option value="deposito">Depósito</option>
<option value="cheque">Cheque</option>
<option value="transferencia">Transferencia</option>
<option value="gasto">Gasto/Retiro</option>
</select>
<input id="beneficiario" placeholder="Beneficiario" style="width:100%;margin-bottom:12px;">
<input id="concepto" placeholder="Concepto" style="width:100%;margin-bottom:12px;">
<input id="monto" type="number" placeholder="Monto" style="width:100%;margin-bottom:12px;">
<input id="referencia" placeholder="Referencia (No. cheque/transferencia)" style="width:100%;margin-bottom:12px;">
<input id="fechaMov" type="date" style="width:100%;margin-bottom:20px;">
<div style="display:flex;gap:12px;justify-content:flex-end;">
<button class="btn" onclick="cerrarModal()">Cancelar</button>
<button class="btn btn-primary" onclick="guardarMovimiento()">Guardar</button>
</div>
</div>
</div>

<script>
let cuentas = [], movimientos = [];
async function init(){
    cuentas = await fetch('/api/cuentas-corrientes').then(r=>r.json());
    renderCuentas();
    const opts = cuentas.map(c=>'<option value="'+c.id+'">'+c.nombre+' - '+c.banco+'</option>').join('');
    document.getElementById('cuentaFiltro').innerHTML = '<option value="">Todas las cuentas</option>' + opts;
    document.getElementById('cuentaMov').innerHTML = '<option value="">-- Seleccionar Cuenta --</option>' + opts;
    document.getElementById('fechaIni').value = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
    document.getElementById('fechaFin').value = new Date().toISOString().split('T')[0];
    document.getElementById('fechaMov').value = new Date().toISOString().split('T')[0];
    await cargarMovimientos();
}
function renderCuentas(){
    document.getElementById('cuentasGrid').innerHTML = cuentas.map(c=>'<div style="background:white;padding:20px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);border-left:4px solid var(--primary);"><div style="font-size:18px;font-weight:700;color:var(--primary);">'+c.nombre+'</div><div style="color:var(--textoLight);margin:8px 0;">'+c.banco+' - '+c.numero_cuenta+'</div><div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:14px;">Saldo:</span><span style="font-size:24px;font-weight:700;color:var(--verde);">C$ '+c.saldo_actual.toFixed(2)+'</span></div><div style="margin-top:10px;"><span class="badge badge-primary">'+c.tipo_cuenta+'</span></div></div>').join('')||'<div class="empty-state">No hay cuentas bancarias</div>';
}
async function cargarMovimientos(){
    const cid = document.getElementById('cuentaFiltro').value;
    const fi = document.getElementById('fechaIni').value;
    const ff = document.getElementById('fechaFin').value;
    let url = '/api/movimientos-bancarios?';
    if(cid) url += 'cuentaId='+cid+'&';
    if(fi) url += 'fi='+fi+'&';
    if(ff) url += 'ff='+ff;
    movimientos = await fetch(url).then(r=>r.json());
    document.getElementById('tabla').innerHTML = movimientos.map(m=>'<tr><td>'+m.fecha+'</td><td>'+m.cuenta_nombre+'</td><td><span class="badge '+(m.tipo==='deposito'||m.tipo==='transferencia'?'badge-verde':'badge-rojo')+'">'+m.tipo+'</span></td><td>'+(m.beneficiario||'-')+'</td><td>'+m.concepto+'</td><td style="text-align:right;font-weight:600;color:'+(m.tipo==='deposito'||m.tipo==='transferencia'?'var(--verde)':'var(--rojo)')+'">'+(m.tipo==='deposito'||m.tipo==='transferencia'?'+':'-')+'C$ '+m.monto.toFixed(2)+'</td><td><span class="badge badge-primary">'+m.estado+'</span></td></tr>').join('')||'<tr><td colspan="7" class="empty-state">Sin movimientos</td></tr>';
}
function mostrarCuenta(){ document.getElementById('cuentaModal').style.display = 'flex'; }
function mostrarMovimiento(){ document.getElementById('movimientoModal').style.display = 'flex'; }
function cerrarModal(){ document.querySelectorAll('#cuentaModal,#movimientoModal').forEach(m=>m.style.display='none'); }
async function guardarCuenta(){
    const data = { nombre: document.getElementById('nombreCuenta').value, banco: document.getElementById('banco').value, numero_cuenta: document.getElementById('numeroCuenta').value, tipo_cuenta: document.getElementById('tipoCuenta').value, saldo_inicial: parseFloat(document.getElementById('saldoInicial').value)||0 };
    if(!data.nombre || !data.banco){ alert('Nombre y banco son requeridos'); return; }
    await fetch('/api/cuenta-corriente', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    cerrarModal(); cuentas = await fetch('/api/cuentas-corrientes').then(r=>r.json()); renderCuentas();
}
async function guardarMovimiento(){
    const data = { cuenta_id: parseInt(document.getElementById('cuentaMov').value), tipo: document.getElementById('tipoMov').value, beneficiario: document.getElementById('beneficiario').value, concepto: document.getElementById('concepto').value, monto: parseFloat(document.getElementById('monto').value), referencia: document.getElementById('referencia').value, fecha: document.getElementById('fechaMov').value };
    if(!data.cuenta_id || !data.monto){ alert('Cuenta y monto son requeridos'); return; }
    await fetch('/api/movimiento-bancario', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    cerrarModal(); cuentas = await fetch('/api/cuentas-corrientes').then(r=>r.json()); renderCuentas(); cargarMovimientos();
}
init();
</script></body></html>`,
    facturalote: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Facturación por Lotes - Priceless Imports</title>${css}</head>
<body>
<div class="header">
<div class="logo">
<div class="logo-icon">P</div>
<h1>FACTURACIÓN POR LOTES</h1>
</div>
<div><a href="/dashboard" style="color:white;text-decoration:none;font-weight:500;">← Volver</a></div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:20px;">
<div class="card">
<h3 style="color:var(--primary);margin-bottom:20px;">1. Seleccionar Productos</h3>
<div style="display:flex;gap:10px;margin-bottom:15px;">
<input id="buscarProducto" placeholder="Buscar producto..." style="flex:1;" onkeyup="renderProductos()">
</div>
<div id="listaProductos" style="max-height:300px;overflow-y:auto;border:1px solid #eee;border-radius:8px;padding:10px;"></div>
</div>

<div class="card">
<h3 style="color:var(--primary);margin-bottom:20px;">2. Productos Seleccionados</h3>
<div id="productosSeleccionados" style="min-height:200px;max-height:300px;overflow-y:auto;border:1px solid #eee;border-radius:8px;padding:10px;"></div>
<div style="margin-top:15px;padding:15px;background:var(--fondo);border-radius:8px;">
<div style="display:flex;justify-content:space-between;margin-bottom:10px;"><span>Subtotal:</span><span id="subtotal" style="font-weight:600;">C$ 0.00</span></div>
<div style="display:flex;justify-content:space-between;font-weight:700;font-size:18px;color:var(--primary);"><span>Total:</span><span id="total">C$ 0.00</span></div>
</div>
</div>
</div>

<div class="card" style="margin:20px;">
<h3 style="color:var(--primary);margin-bottom:20px;">3. Seleccionar Clientes</h3>
<div style="display:flex;gap:12px;margin-bottom:15px;">
<select id="clienteSelect" style="flex:1;padding:12px;">
<option value="">-- Seleccionar Cliente --</option>
</select>
<button class="btn btn-verde" onclick="agregarCliente()">+ Agregar a Lote</button>
</div>
<div style="display:flex;gap:12px;margin-bottom:15px;">
<input id="nuevoNombre" placeholder="Nombre del cliente" style="flex:2;">
<input id="nuevoRuc" placeholder="RUC" style="flex:1;">
<input id="nuevaDireccion" placeholder="Dirección" style="flex:2;">
</div>
<div id="clientesLote" style="max-height:200px;overflow-y:auto;border:1px solid #eee;border-radius:8px;padding:10px;"></div>
</div>

<div style="margin:20px;display:flex;justify-content:center;gap:20px;">
<button class="btn btn-primary" style="padding:15px 40px;font-size:18px;" onclick="generarFacturas()">GENERAR FACTURAS</button>
<button class="btn" style="padding:15px 40px;font-size:18px;" onclick="limpiarTodo()">LIMPIAR</button>
</div>

<div id="resultado" style="margin:20px;"></div>

<script>
let productos = [], clientes = [], productosSel = [], clientesLote = [];
async function init(){
    productos = await fetch('/api/productos').then(r=>r.json());
    clientes = await fetch('/api/clientes').then(r=>r.json());
    const opts = clientes.map(c=>'<option value="'+c.id+'">'+c.nombre+'</option>').join('');
    document.getElementById('clienteSelect').innerHTML = '<option value="">-- Seleccionar Cliente --</option>' + opts;
    renderProductos();
}
function renderProductos(){
    const f = document.getElementById('buscarProducto').value.toLowerCase();
    document.getElementById('listaProductos').innerHTML = productos.filter(p=>f===''||p.nombre.toLowerCase().includes(f)||p.codigo_barra.includes(f)).slice(0,20).map(p=>'<div style="display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid #eee;"><div><strong>'+p.nombre+'</strong><br><small>'+p.codigo_barra+'</small></div><div style="text-align:right;"><div style="color:var(--primary);font-weight:700;">C$ '+p.precio.toFixed(2)+'</div><div style="color:var(--textoLight);font-size:12px;">Stock: '+p.cantidad+'</div><button class="btn btn-primary" style="padding:4px 10px;font-size:12px;" onclick="agregarProducto('+p.id+')">+</button></div></div>').join('')||'<div class="empty-state">No hay productos</div>';
}
function agregarProducto(id){
    const p = productos.find(x=>x.id===id);
    if(productosSel.find(x=>x.id===id)) return;
    productosSel.push({...p, cantidad: 1});
    renderSeleccionados();
}
function renderSeleccionados(){
    document.getElementById('productosSeleccionados').innerHTML = productosSel.map((p,i)=>'<div style="display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid #eee;align-items:center;"><div><strong>'+p.nombre+'</strong></div><div style="display:flex;align-items:center;gap:10px;"><input type="number" value="'+p.cantidad+'" min="1" style="width:60px;padding:5px;" onchange="actualizarCant('+i+',this.value)"> <span>C$ '+(p.cantidad*p.precio).toFixed(2)+'</span> <button class="btn btn-rojo" style="padding:4px 8px;font-size:12px;" onclick="quitarProducto('+i+')">X</button></div></div>').join('')||'<div class="empty-state">Ningún producto seleccionado</div>';
    const subtotal = productosSel.reduce((s,p)=>s+(p.cantidad*p.precio),0);
    document.getElementById('subtotal').textContent = 'C$ '+subtotal.toFixed(2);
    document.getElementById('total').textContent = 'C$ '+subtotal.toFixed(2);
}
function actualizarCant(i,val){ productosSel[i].cantidad = parseInt(val)||1; renderSeleccionados(); }
function quitarProducto(i){ productosSel.splice(i,1); renderSeleccionados(); }
function agregarCliente(){
    const sel = document.getElementById('clienteSelect');
    if(sel.value){
        const c = clientes.find(x=>x.id==sel.value);
        if(!clientesLote.find(x=>x.id===c.id)) clientesLote.push(c);
    }else if(document.getElementById('nuevoNombre').value){
        clientesLote.push({ nombre: document.getElementById('nuevoNombre').value, ruc: document.getElementById('nuevoRuc').value, direccion: document.getElementById('nuevaDireccion').value });
    }else{ alert('Seleccione o ingrese un cliente'); return; }
    renderClientesLote();
}
function renderClientesLote(){
    document.getElementById('clientesLote').innerHTML = clientesLote.map((c,i)=>'<div style="display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid #eee;"><div><strong>'+c.nombre+'</strong><br><small>'+(c.ruc||'Sin RUC')+'</small></div><button class="btn btn-rojo" style="padding:4px 8px;font-size:12px;" onclick="quitarCliente('+i+')">X</button></div>').join('')||'<div class="empty-state">Ningún cliente agregado</div>';
}
function quitarCliente(i){ clientesLote.splice(i,1); renderClientesLote(); }
async function generarFacturas(){
    if(productosSel.length===0){ alert('Seleccione productos'); return; }
    if(clientesLote.length===0){ alert('Agregue al menos un cliente'); return; }
    const data = { items: productosSel.map(p=>({id:p.id,nombre:p.nombre,cantidad:p.cantidad,precio:p.precio})), clientes: clientesLote, usuario: JSON.parse(localStorage.getItem('usuario')||'{}').nombre||'sistema' };
    const r = await fetch('/api/factura-lote', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    const d = await r.json();
    document.getElementById('resultado').innerHTML = '<div style="background:white;padding:20px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05);border-left:4px solid var(--verde);"><h3 style="color:var(--verde);">✓ Facturas Generadas</h3><p>Grupo: '+d.grupo+'</p><p>Cantidad: '+d.cantidad+' facturas creadas</p></div>';
    productosSel=[]; clientesLote=[]; renderSeleccionados(); renderClientesLote();
}
function limpiarTodo(){ productosSel=[]; clientesLote=[]; renderSeleccionados(); renderClientesLote(); document.getElementById('resultado').innerHTML=''; }
init();
</script></body></html>`,
    proformas: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Proformas - FactuLite</title>${css}</head>
<body>
<div class="header">
<div class="logo"><div class="logo-icon">P</div><h1>PROFORMAS / COTIZACIONES</h1></div>
<div><a href="/dashboard" style="color:white;text-decoration:none;font-weight:500;">← Volver</a></div>
</div>
<div class="container">
<div class="main">
<div style="display:flex;justify-content:space-between;margin-bottom:20px;">
<button class="btn btn-primary" onclick="nuevaProforma()">+ Nueva Proforma</button>
</div>
<table><thead><tr><th>Número</th><th>Cliente</th><th>Fecha</th><th>Vence</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>
<tbody id="tablaProformas"></tbody></table>
</div>
</div>
<div id="modal" class="modal"><div class="modal-content" style="max-width:900px;">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
<h2 id="modalTitulo">Nueva Proforma</h2>
<button class="btn btn-rojo" onclick="cerrarModal()" style="padding:4px 12px;">X</button>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
<input type="text" id="clienteNombre" placeholder="Nombre del cliente" class="input">
<input type="text" id="clienteRuc" placeholder="RUC" class="input">
</div>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
<input type="number" id="validez" placeholder="Validez (días)" class="input" value="30">
<input type="text" id="observaciones" placeholder="Observaciones" class="input">
</div>
<h4 style="margin:16px 0 8px;">Productos</h4>
<div style="display:flex;gap:8px;margin-bottom:12px;">
<input type="text" id="buscarProd" placeholder="Buscar producto..." class="input" onkeyup="buscarProducto()" style="flex:1;">
<button class="btn btn-verde" onclick="agregarProducto()">Agregar</button>
</div>
<table style="margin-bottom:16px;"><thead><tr><th>Código</th><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th><th></th></tr></thead>
<tbody id="tablaItems"></tbody></table>
<div style="display:flex;justify-content:flex-end;gap:12px;font-size:18px;font-weight:bold;">
<span>Subtotal: C$ <span id="subtotal">0.00</span></span>
<span>Total: C$ <span id="total">0.00</span></span>
</div>
<div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px;">
<button class="btn" onclick="cerrarModal()">Cancelar</button>
<button class="btn btn-verde" onclick="guardarProforma()">Guardar Proforma</button>
</div>
</div></div>
<script>
let proformas = [];
let items = [];
let editandoId = null;
async function init(){ proformas = await fetch('/api/proformas').then(r=>r.json()); render(); }
function render(){
document.getElementById('tablaProformas').innerHTML = proformas.map(p => '<tr>'+
'<td style="font-weight:600;">'+p.numero+'</td>'+
'<td>'+p.cliente_nombre+'</td>'+
'<td>'+new Date(p.fecha).toLocaleDateString()+'</td>'+
'<td>'+new Date(p.fecha_vencimiento).toLocaleDateString()+'</td>'+
'<td style="font-weight:bold;color:var(--primary);">C$ '+p.total.toFixed(2)+'</td>'+
'<td><span class="badge '+(p.estado==='pendiente'?'badge-primary':p.estado==='convertida'?'badge-verde':'badge-rojo')+'">'+p.estado+'</span></td>'+
'<td>'+
(p.estado==='pendiente'?'<button class="btn btn-verde" style="padding:4px 8px;font-size:12px;margin-right:4px;" onclick="convertir('+p.id+')">→ Factura</button>':'')+
'<button class="btn btn-primary" style="padding:4px 8px;font-size:12px;margin-right:4px;" onclick="verProforma('+p.id+')">Ver</button>'+
'<button class="btn btn-rojo" style="padding:4px 8px;font-size:12px;" onclick="eliminar('+p.id+')">X</button>'+
'</td></tr>').join('')||'<tr><td colspan="7" style="text-align:center;padding:40px;color:#999;">Sin proformas</td></tr>';
}
function nuevaProforma(){ editandoId=null; items=[]; document.getElementById('clienteNombre').value=''; document.getElementById('clienteRuc').value=''; document.getElementById('validez').value='30'; document.getElementById('observaciones').value=''; document.getElementById('subtotal').textContent='0.00'; document.getElementById('total').textContent='0.00'; renderItems(); document.getElementById('modal').style.display='flex'; }
async function verProforma(id){
const p = await fetch('/api/proforma/'+id).then(r=>r.json());
editandoId=id;
items=p.items||[];
document.getElementById('clienteNombre').value=p.cliente_nombre;
document.getElementById('clienteRuc').value=p.cliente_ruc||'';
document.getElementById('validez').value=p.validez||30;
document.getElementById('observaciones').value=p.observaciones||'';
renderItems();
document.getElementById('modal').style.display='flex';
}
function buscarProducto(){
const q = document.getElementById('buscarProd').value.toLowerCase();
if(q.length<2) return;
fetch('/api/buscar-productos?q='+q).then(r=>r.json()).then(prods => {
if(prods.length>0){
const p = prods[0];
if(!items.find(i=>i.producto_id===p.id)){
items.push({producto_id:p.id,codigo:p.codigo_barra,nombre:p.nombre,cantidad:1,precio:p.precio});
renderItems();
}
}
});
}
function agregarProducto(){
const codigo = prompt('Código del producto:');
if(!codigo) return;
fetch('/api/producto/'+codigo).then(r=>r.json()).then(p => {
if(p.id && !items.find(i=>i.producto_id===p.id)){
items.push({producto_id:p.id,codigo:p.codigo_barra,nombre:p.nombre,cantidad:1,precio:p.precio});
renderItems();
}
});
}
function renderItems(){
document.getElementById('tablaItems').innerHTML = items.map((item,i) => '<tr>'+
'<td>'+(item.codigo||'-')+'</td>'+
'<td>'+item.nombre+'</td>'+
'<td><input type="number" value="'+item.cantidad+'" style="width:60px;" onchange="items['+i+'].cantidad=parseInt(this.value);renderItems();"></td>'+
'<td><input type="number" step="0.01" value="'+item.precio+'" style="width:80px;" onchange="items['+i+'].precio=parseFloat(this.value);renderItems();"></td>'+
'<td style="font-weight:bold;">C$ '+(item.cantidad*item.precio).toFixed(2)+'</td>'+
'<td><button class="btn btn-rojo" style="padding:2px 8px;" onclick="items.splice('+i+',1);renderItems();">X</button></td></tr>').join('');
const subtotal = items.reduce((s,i)=>s+(i.cantidad*i.precio),0);
document.getElementById('subtotal').textContent=subtotal.toFixed(2);
document.getElementById('total').textContent=subtotal.toFixed(2);
}
async function guardarProforma(){
if(!document.getElementById('clienteNombre').value){ alert('Ingrese nombre del cliente'); return; }
if(items.length===0){ alert('Agregue productos'); return; }
const subtotal = items.reduce((s,i)=>s+(i.cantidad*i.precio),0);
const data = {
cliente_nombre: document.getElementById('clienteNombre').value,
cliente_ruc: document.getElementById('clienteRuc').value,
validez: parseInt(document.getElementById('validez').value)||30,
observaciones: document.getElementById('observaciones').value,
items: items,
subtotal: subtotal,
total: subtotal
};
if(editandoId){
await fetch('/api/proforma', {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...data,id:editandoId})});
}else{
await fetch('/api/proforma', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
}
cerrarModal(); init();
}
async function convertir(id){
if(!confirm('¿Convertir a factura?')) return;
const r = await fetch('/api/proforma/'+id+'/convertir', {method:'POST'});
const d = await r.json();
if(d.ok){ alert('Factura creada: '+d.numero); init(); }
}
async function eliminar(id){
if(!confirm('¿Eliminar proforma?')) return;
await fetch('/api/proforma/'+id, {method:'DELETE'});
init();
}
function cerrarModal(){ document.getElementById('modal').style.display='none'; }
init();
</script></body></html>`
};