# FactuLite - Sistema de Diseño

## Estado Actual

### Iconos
- **Tipo**: SVG inline (Heroicons/Feather style)
- **Ubicación**: `server/src/views/index.js` - objeto `icons`
- **Estilo**: Stroke-based, consistentes, profesionales

### Colores (CSS Variables)
```css
--primary: #183e6d;      /* Azul corporativo */
--primaryLight: #2a5290;
--primaryDark: #0f2544;
--accent: #f7ac0f;       /* Amarillo/dorado */
--verde: #56a805;        /* Éxito */
--rojo: #ed0707;         /* Error */
--fondo: #f0f4f8;        /* Background */
```

### Layout
```
┌────────────────────────────────────────────┐
│                  HEADER                     │
├──────────┬─────────────────────────────────┤
│          │                                 │
│ SIDEBAR  │           MAIN                  │
│  240px   │         (flex: 1)               │
│          │                                 │
│          │                                 │
└──────────┴─────────────────────────────────┘
```

### Tipografía
- **Fuente**: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif
- **Títulos**: 18-24px, font-weight: 700
- **Body**: 14-16px, line-height: 1.6

---

## Evaluación Profesional

| Aspecto | Puntuación | Comentario |
|---------|------------|------------|
| **Iconos** | ⭐⭐⭐⭐⭐ | SVG profesionales, consistentes |
| **Colores** | ⭐⭐⭐⭐ | Buena paleta, necesita pulir contrastes |
| **Layout** | ⭐⭐⭐⭐ | Funcional, responsive |
| **Tipografía** | ⭐⭐⭐ | Básica, podría mejorar |
| **Componentes** | ⭐⭐⭐ | Funcionales, sin sistema de componentes |
| **Animaciones** | ⭐⭐⭐ | Solo spinner, faltan micro-interacciones |
| **Accesibilidad** | ⭐⭐⭐ | Básica, necesita mejoras |

**Puntuación General: 3.5/5 - Funcional y usable**

---

## Escalabilidad

### Arquitectura Actual
```
server/
├── src/
│   ├── index.js       # Entry point
│   ├── db.js          # SQLite
│   ├── routes/        # 12 módulos API
│   └── views/         # Vistas HTML inline
```

### ¿Se puede escalar?

| Aspecto | Sí/No | Explicación |
|---------|-------|-------------|
| **Nuevos módulos** | ✅ Sí | Agregar archivo en `routes/` |
| **Nuevas vistas** | ✅ Sí | Agregar en `views/index.js` |
| **API REST** | ✅ Sí | Arquitectura modular |
| **Multi-idioma** | ⚠️ Parcial | No implementado |
| **Temas** | ⚠️ Parcial | Variables CSS, sin switch |
| **PWA** | ❌ No | No es PWA |
| **Componentes reutilizables** | ❌ No | Sin sistema de componentes |

### Límites estimados
- **Usuarios simultáneos**: ~50 (SQLite + HTTP simple)
- **Productos**: ~10,000 (SQLite maneja más, pero UI puede ser lenta)
- **Transacciones/día**: ~1,000
- **Tamaño DB**: ~500MB máximo práctico

---

## Mejoras Recomendadas

### Prioridad ALTA
1. **Separar CSS** a archivo externo
2. **Sistema de componentes** reutilizables
3. **Mejorar tipografía** (Google Fonts)
4. **Animaciones** de transición

### Prioridad MEDIA
5. **Temas claro/oscuro**
6. **PWA** (offline, instalación)
7. **Optimizar rendimiento** (lazy loading)
8. **Tests automatizados**

### Prioridad BAJA
9. **Multi-idioma** (i18n)
10. **Framework frontend** (React/Vue) - solo si escala mucho

---

## Comparación con Competencia

| Feature | FactuLite | Monica 11 | Treinta |
|---------|-----------|-----------|---------|
| Iconos profesionales | ✅ SVG | ⚠️ Básicos | ✅ SVG |
| Diseño moderno | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Responsive | ✅ | ❌ | ✅ |
| Temas | ❌ | ❌ | ✅ |
| PWA | ❌ | ❌ | ✅ |
| App móvil | ❌ | ❌ | ✅ |

---

## Conclusión

**¿Es profesional?** Sí, es funcional y visualmente aceptable.

**¿Se puede escalar?** Sí, la arquitectura modular lo permite. Límite práctico: ~50 usuarios simultáneos.

**¿Qué falta para ser "PRO"?**
1. Separar CSS/JS a archivos externos
2. Agregar animaciones y transiciones
3. Implementar PWA
4. Mejorar tipografía
5. Agregar tema oscuro

---

**Próximos pasos recomendados:**
1. Mantener arquitectura actual (funciona)
2. Agregar mejoras incrementales
3. Documentar patrones de diseño
