# 🎯 SISTEMA CMS - ARQUITECTURA ACTUAL

## 📊 Estado del Sistema (17 Diciembre 2024)

### ✅ SISTEMA ACTIVO (Dashboard V2)

**Dashboard Principal:** `admin/dashboard-v2.php`  
**Archivo de Datos:** `data/content.json`  
**JavaScript:** `admin/js/dashboard-enhanced.js`  
**API Guardado:** `admin/api/save-content.php`  
**Frontend Bindings:** `js/homepage-bindings-complete.js`

**Control Total de la Homepage:**
- ✅ 12 secciones completamente editables
- ✅ Hero Section (historia destacada)
- ✅ Breaking News (noticias de última hora)
- ✅ Latest News (noticias recientes con featured + grid)
- ✅ Sports Categories (6 categorías deportivas)
- ✅ AFCON Spotlight (tabla, próximo partido, goleador)
- ✅ Analysis Articles (artículos de opinión)
- ✅ Athletes (perfiles de atletas con estadísticas)
- ✅ Multimedia (galería de videos/imágenes)
- ✅ About Section (misión y estadísticas)
- ✅ Navigation (menú principal y dropdowns)
- ✅ Footer (enlaces y redes sociales)
- ✅ Ads (banners publicitarios)

**Funcionalidades:**
- Backups automáticos en cada guardado
- Listas dinámicas (agregar/eliminar items)
- Interfaz organizada con navegación lateral
- Manejo de imágenes, enlaces, metadata
- Sistema de pestañas agrupadas

---

### 🔄 SISTEMA LEGACY (Dashboard V1)

**Dashboard Legacy:** `admin/dashboard.php`  
**Archivo de Datos:** `data/config.json`  
**JavaScript:** `admin/assets/admin.js`  
**API Guardado:** `admin/api/save-config.php`

**⚠️ ESTADO: LEGACY / DEPRECADO**

Este dashboard solo gestiona 3 secciones básicas:
- Site Config (branding básico)
- Breaking News (ticker)
- AFCON Data (datos de torneo)

**Nota Importante:** Este dashboard ahora muestra un aviso prominente indicando que los usuarios deben usar Dashboard V2 para control completo.

---

## 🔄 FLUJO DE DATOS

### Sistema Nuevo (V2 - RECOMENDADO)

```
Admin edita en dashboard-v2.php
         ↓
dashboard-enhanced.js recoge datos
         ↓
POST a save-content.php
         ↓
Guarda en content.json (+ backup automático)
         ↓
Homepage carga content.json vía content-loader.js
         ↓
homepage-bindings-complete.js aplica datos al DOM
         ↓
Usuario ve contenido actualizado
```

### Sistema Legacy (V1 - COMPATIBILIDAD)

```
Admin edita en dashboard.php
         ↓
admin.js recoge datos
         ↓
POST a save-config.php
         ↓
Guarda en config.json
         ↓
Homepage puede cargar config.json como fallback
         ↓
homepage-bindings-complete.js usa config.json si content.json no existe
```

---

## 🎯 PRIORIDAD DE CARGA

El sistema de bindings de la homepage funciona con esta lógica:

```javascript
// 1. Intenta cargar content.json (sistema nuevo)
try {
  contentData = await ContentLoader.load('content');
  console.log('Using content.json (new system)');
} 
// 2. Si falla, carga config.json (sistema legacy)
catch (error) {
  console.warn('Falling back to config.json');
  contentData = await ContentLoader.load('config');
}
```

**Resultado:** 
- Si `content.json` existe → se usa Dashboard V2
- Si `content.json` NO existe → fallback a `config.json` (Dashboard V1)

---

## 📁 ARCHIVOS DEL SISTEMA

### Dashboard V2 (Sistema Nuevo)
```
/admin/
  ├── dashboard-v2.php          ← Panel principal con 12 pestañas
  ├── migrate-to-content.php    ← Herramienta de migración
  ├── js/
  │   └── dashboard-enhanced.js ← Lógica del dashboard (~1500 líneas)
  └── api/
      └── save-content.php      ← API para guardar content.json

/data/
  ├── content.json              ← Estructura unificada PRINCIPAL
  └── backups/                  ← Backups automáticos con timestamp

/js/
  ├── content-loader.js         ← Cargador universal con cache
  └── homepage-bindings-complete.js ← Bindings completos (~900 líneas)

/index.html                     ← Homepage (referencia a bindings-complete.js)
```

### Dashboard V1 (Sistema Legacy)
```
/admin/
  ├── dashboard.php             ← Panel legacy (ahora con aviso de upgrade)
  ├── assets/
  │   └── admin.js              ← Lógica legacy
  └── api/
      └── save-config.php       ← API para guardar config.json

/data/
  └── config.json               ← Datos legacy (solo 3 secciones)
```

---

## 🚀 RECOMENDACIONES

### Para Administradores
1. **Usar siempre Dashboard V2** (`dashboard-v2.php`)
2. Si tienes datos en config.json, ejecutar la migración una vez
3. Dashboard V1 solo para compatibilidad/emergencias

### Para Desarrolladores
1. content.json es el source of truth
2. config.json se mantiene por compatibilidad pero no es necesario editarlo
3. Futuras funciones deben agregarse a Dashboard V2

### Migración de Datos
Si ya tienes contenido en `config.json`:
1. Ir a `admin/migrate-to-content.php`
2. Hacer clic en "Iniciar Migración"
3. Verificar que los datos aparecen en Dashboard V2
4. A partir de ahí, usar solo Dashboard V2

---

## 🔐 SEGURIDAD

Ambos sistemas requieren:
- Autenticación vía `require_login()`
- Validación CSRF en guardados
- Backups automáticos antes de sobrescribir
- Escritura atómica (temp file + rename)

---

## 📊 COMPARACIÓN

| Característica | Dashboard V1 (Legacy) | Dashboard V2 (Nuevo) |
|---|---|---|
| Secciones editables | 3 | 12 |
| Archivo de datos | config.json | content.json |
| Backups automáticos | ❌ | ✅ |
| Listas dinámicas | Limitado | Completo |
| Interfaz | Pestañas simples | Navegación lateral |
| Control de homepage | Parcial (30%) | Total (100%) |
| Estado | Legacy/Deprecado | Activo/Recomendado |

---

## ✅ VERIFICACIÓN RÁPIDA

Para confirmar que el sistema V2 está funcionando:

1. **Abrir:** `admin/dashboard-v2.php`
2. **Editar:** Cambiar el título del Hero Section
3. **Guardar:** Click en "Guardar Cambios"
4. **Verificar:** Abrir `index.html` y verificar el cambio
5. **Console:** Debería mostrar `[Homepage Bindings] Using content.json (new system)`

Si aparece "Falling back to config.json", significa que content.json no existe o no es accesible.

---

## 🎉 RESUMEN

- **Dashboard V2 es el sistema PRINCIPAL** ✅
- **Dashboard V1 es LEGACY** (mantener por compatibilidad)
- **Homepage prioriza content.json** sobre config.json
- **Sistema es retrocompatible** (fallback automático)
- **Aviso visible** en Dashboard V1 para migrar a V2

**Estado: SISTEMA V2 COMPLETAMENTE FUNCIONAL Y ACTIVO** 🚀
