# 📋 AFRIKASPORT365 CMS - GUÍA DE PRUEBAS Y DESPLIEGUE

## 🎯 Resumen del Proyecto

Se ha creado un **Sistema CMS Completo** que permite gestionar TODOS los elementos de la página principal desde el panel de administración.

### ✅ Archivos Creados/Actualizados

**Nuevos Archivos (8):**
1. `/data/content.json` - Estructura unificada con todas las secciones
2. `/admin/dashboard-v2.php` - Panel con 12 pestañas organizadas
3. `/admin/js/dashboard-enhanced.js` - Lógica completa del dashboard (~1500 líneas)
4. `/admin/api/save-content.php` - Endpoint para guardar cambios
5. `/js/homepage-bindings-complete.js` - Bindings completos para la homepage (~900 líneas)
6. `/admin/migrate-to-content.php` - Herramienta de migración de datos
7. `/data/backups/` - Directorio para backups automáticos (crear en servidor)
8. Este archivo de documentación

**Archivos Actualizados (2):**
1. `/js/content-loader.js` - Ahora carga content.json y config.json
2. `/index.html` - Referencia al nuevo script de bindings

---

## 🚀 PROCESO DE DESPLIEGUE

### Paso 1: Preparar el Servidor

```bash
# Crear directorio de backups
mkdir -p /data/backups
chmod 755 /data/backups
```

### Paso 2: Subir Archivos al Servidor

**Archivos NUEVOS a subir:**
```
/data/content.json
/admin/dashboard-v2.php
/admin/js/dashboard-enhanced.js
/admin/api/save-content.php
/admin/migrate-to-content.php
/js/homepage-bindings-complete.js
```

**Archivos ACTUALIZADOS a subir:**
```
/js/content-loader.js
/index.html
```

### Paso 3: Verificar Permisos

```bash
# En el servidor
chmod 644 /data/content.json
chmod 644 /admin/dashboard-v2.php
chmod 644 /admin/js/dashboard-enhanced.js
chmod 644 /admin/api/save-content.php
chmod 644 /admin/migrate-to-content.php
chmod 644 /js/homepage-bindings-complete.js
chmod 755 /data/backups
```

---

## 🧪 PLAN DE PRUEBAS

### ✅ Prueba 1: Acceso al Nuevo Dashboard

**Objetivo:** Verificar que el dashboard carga correctamente

1. Abrir: `https://tudominio.com/admin/dashboard-v2.php`
2. Verificar que aparece la barra lateral con 3 secciones:
   - **Contenido Principal** (9 pestañas)
   - **Estructura del Sitio** (3 pestañas)
   - **Sistema Anterior** (2 pestañas heredadas)
3. Hacer clic en cada pestaña y verificar que cambia el contenido
4. Abrir consola del navegador (F12) y verificar que no hay errores

**Resultado Esperado:**
- ✅ Dashboard carga sin errores
- ✅ Todas las pestañas son navegables
- ✅ Los formularios se ven correctamente

---

### ✅ Prueba 2: Carga de Datos desde content.json

**Objetivo:** Verificar que los datos se cargan en los formularios

1. En el dashboard, ir a la pestaña **"Hero Section"**
2. Verificar que los campos se llenan automáticamente con datos de content.json:
   - Título, descripción, imagen, etc.
3. Abrir consola del navegador y buscar:
   ```
   [Dashboard Enhanced] Content loaded successfully
   [Dashboard Enhanced] Populating Hero Section...
   ```
4. Probar con otras pestañas: Breaking News, Latest News, Athletes

**Resultado Esperado:**
- ✅ Todos los campos se llenan automáticamente
- ✅ Imágenes se cargan correctamente
- ✅ No hay campos vacíos o undefined

---

### ✅ Prueba 3: Agregar/Eliminar Items Dinámicos

**Objetivo:** Probar la funcionalidad de listas dinámicas

1. Ir a la pestaña **"Breaking News"**
2. Hacer clic en el botón **"+ Agregar Breaking News"**
3. Verificar que aparece un nuevo campo de texto
4. Escribir un texto de prueba: "Nueva noticia de última hora"
5. Hacer clic en el botón **"Eliminar"** junto a ese campo
6. Verificar que el campo desaparece

**Repetir con:**
- Latest News (Grid Articles)
- Categories
- Athletes
- Multimedia

**Resultado Esperado:**
- ✅ Los items se agregan correctamente
- ✅ Los items se eliminan correctamente
- ✅ No hay errores en la consola

---

### ✅ Prueba 4: Guardar Cambios

**Objetivo:** Verificar que los cambios se guardan en content.json

1. En la pestaña **"Hero Section"**, cambiar el título a:
   ```
   "PRUEBA: Este es un título modificado desde el dashboard"
   ```
2. Hacer clic en el botón **"💾 Guardar Cambios"**
3. Esperar la notificación de éxito:
   ```
   ✅ Contenido guardado correctamente
   ```
4. Recargar la página del dashboard (F5)
5. Verificar que el título modificado aún está presente

**Resultado Esperado:**
- ✅ Aparece notificación de éxito
- ✅ Los cambios persisten después de recargar
- ✅ Se crea un backup en `/data/backups/`

---

### ✅ Prueba 5: Verificar Backup Automático

**Objetivo:** Confirmar que se crean backups antes de guardar

1. Después de guardar cambios (Prueba 4), ir al servidor
2. Navegar a `/data/backups/`
3. Verificar que existe un archivo con formato:
   ```
   content_backup_2024-12-17_14-30-45.json
   ```
4. Descargar y abrir el archivo
5. Verificar que contiene los datos ANTES del cambio

**Resultado Esperado:**
- ✅ Se crea un backup con timestamp
- ✅ El backup contiene los datos anteriores
- ✅ El archivo es un JSON válido

---

### ✅ Prueba 6: Frontend - Carga de content.json

**Objetivo:** Verificar que la homepage carga los datos del CMS

1. Abrir la homepage: `https://tudominio.com/index.html`
2. Abrir la consola del navegador (F12)
3. Buscar los siguientes mensajes:
   ```
   [ContentLoader] Module initialized
   [ContentLoader] Loading: content.json
   [Homepage Bindings] Initializing...
   [Homepage Bindings] Using content.json (new system)
   [Homepage Bindings] ✓ Site Info
   [Homepage Bindings] ✓ Hero Section
   [Homepage Bindings] ✓ Breaking News Ticker
   ... (todas las secciones)
   [Homepage Bindings] ✅ All content loaded successfully
   ```
4. Verificar que NO hay errores en rojo

**Resultado Esperado:**
- ✅ content.json se carga correctamente
- ✅ Aparecen todos los mensajes de binding
- ✅ No hay errores 404 o de sintaxis

---

### ✅ Prueba 7: Frontend - Visualización del Contenido

**Objetivo:** Verificar que el contenido del CMS se muestra en la página

1. En la homepage, buscar la sección **Hero**
2. Verificar que el título es el que modificaste en el dashboard:
   ```
   "PRUEBA: Este es un título modificado desde el dashboard"
   ```
3. Verificar otras secciones:
   - Breaking News ticker (debe mostrar las noticias de content.json)
   - Latest News (artículos destacados)
   - Sports Categories (6 tarjetas)
   - Athletes (4 perfiles)
4. Hacer scroll por toda la página y confirmar que todo se ve bien

**Resultado Esperado:**
- ✅ El título modificado aparece en el Hero
- ✅ Todas las secciones muestran contenido de content.json
- ✅ Imágenes se cargan correctamente
- ✅ No hay elementos con "undefined" o vacíos

---

### ✅ Prueba 8: Ciclo Completo Admin → Frontend

**Objetivo:** Probar el flujo completo de edición

1. En el dashboard, ir a **"Athletes"**
2. Cambiar el nombre del primer atleta a: **"ATLETA DE PRUEBA"**
3. Guardar cambios
4. Ir a la homepage
5. Hacer scroll hasta la sección de Athletes
6. Refrescar la página (F5)
7. Verificar que el nombre cambió a **"ATLETA DE PRUEBA"**

**Resultado Esperado:**
- ✅ Los cambios en el dashboard se reflejan en la homepage
- ✅ No es necesario limpiar caché (auto-actualización)
- ✅ El ciclo completo funciona sin errores

---

### ✅ Prueba 9: Herramienta de Migración (Opcional)

**Objetivo:** Migrar datos de config.json a content.json

1. Abrir: `https://tudominio.com/admin/migrate-to-content.php`
2. Verificar el estado de los archivos:
   - ✅ config.json encontrado
   - ✅ content.json encontrado
3. Hacer clic en **"🚀 Iniciar Migración"**
4. Confirmar la ventana de diálogo
5. Esperar mensaje de éxito con detalles de la migración
6. Hacer clic en **"Ir al Dashboard V2"**
7. Verificar que los datos de config.json ahora están en las pestañas

**Resultado Esperado:**
- ✅ Migración se completa sin errores
- ✅ Se crean backups de ambos archivos
- ✅ Los datos de config.json se fusionan en content.json
- ✅ Los datos nuevos en content.json se preservan

---

### ✅ Prueba 10: Compatibilidad con Sistema Anterior

**Objetivo:** Verificar que config.json sigue funcionando

1. Renombrar temporalmente: `content.json` → `content.json.bak`
2. Refrescar la homepage
3. Abrir consola y buscar:
   ```
   [Homepage Bindings] content.json not found, falling back to config.json
   ```
4. Verificar que las secciones básicas (Hero, About) siguen funcionando
5. Restaurar: `content.json.bak` → `content.json`

**Resultado Esperado:**
- ✅ Fallback a config.json funciona automáticamente
- ✅ No se rompe la página
- ✅ Sistema es retrocompatible

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema: Dashboard no carga datos

**Síntomas:**
- Formularios vacíos
- Error en consola: "Failed to load content.json"

**Soluciones:**
1. Verificar que `content.json` existe en `/data/`
2. Verificar permisos: `chmod 644 /data/content.json`
3. Verificar sintaxis JSON con: https://jsonlint.com/
4. Verificar ruta en dashboard-enhanced.js (línea ~100)

---

### Problema: Cambios no se guardan

**Síntomas:**
- Al guardar no aparece notificación
- Error en consola: "Failed to save"

**Soluciones:**
1. Verificar que `save-content.php` existe en `/admin/api/`
2. Verificar permisos de escritura: `chmod 666 /data/content.json`
3. Verificar permisos en `/data/backups/`: `chmod 755`
4. Verificar que el servidor tiene PHP 7.4+
5. Revisar logs del servidor PHP

---

### Problema: Homepage no muestra contenido del CMS

**Síntomas:**
- Página se ve pero con contenido antiguo hardcoded
- Console muestra: "ContentLoader is not defined"

**Soluciones:**
1. Verificar que `content-loader.js` carga ANTES de `homepage-bindings-complete.js`
2. Verificar orden de scripts en index.html:
   ```html
   <script src="js/content-loader.js"></script>
   <script src="js/homepage-bindings-complete.js"></script>
   <script src="js/main.js"></script>
   ```
3. Limpiar caché del navegador (Ctrl+Shift+Delete)
4. Verificar que content.json es accesible: `https://tudominio.com/data/content.json`

---

### Problema: Error 403 en archivos JSON

**Síntomas:**
- Console muestra: "403 Forbidden" al cargar JSON
- Dashboard no carga datos

**Soluciones:**
1. Verificar `.htaccess` en `/data/`:
   ```apache
   <Files "*.json">
     Require all granted
   </Files>
   ```
2. Verificar que el archivo existe y es legible
3. Contactar al hosting si persiste

---

## 📊 CHECKLIST DE DESPLIEGUE

Antes de marcar como completo, verificar:

### Servidor
- [ ] `/data/backups/` existe con permisos 755
- [ ] `content.json` tiene permisos 644
- [ ] Todos los archivos nuevos están subidos
- [ ] PHP versión 7.4 o superior
- [ ] Apache con mod_rewrite habilitado

### Dashboard (Admin)
- [ ] `dashboard-v2.php` carga sin errores
- [ ] Las 12 pestañas son navegables
- [ ] Los datos se cargan desde content.json
- [ ] Agregar/eliminar items funciona
- [ ] Guardar cambios funciona
- [ ] Se crean backups automáticos

### Frontend (Homepage)
- [ ] content.json se carga correctamente
- [ ] Todas las secciones muestran contenido del CMS
- [ ] No hay errores en consola del navegador
- [ ] Imágenes se cargan correctamente
- [ ] El contenido es editable desde el dashboard

### Integración
- [ ] Cambios en dashboard → se reflejan en homepage
- [ ] Fallback a config.json funciona
- [ ] Migración de datos funciona (si se usa)
- [ ] Sistema es estable y no tiene errores

---

## 🎓 CAPACITACIÓN DEL ADMINISTRADOR

### Flujo de Trabajo Básico

1. **Abrir el Dashboard V2:**
   - Ir a: `https://tudominio.com/admin/dashboard-v2.php`
   - Iniciar sesión si es necesario

2. **Seleccionar Sección a Editar:**
   - Usar la barra lateral izquierda
   - Hacer clic en la pestaña deseada (ej: "Hero Section")

3. **Editar Contenido:**
   - Modificar textos, imágenes, enlaces
   - Para listas: usar botones "+ Agregar" y "Eliminar"

4. **Guardar Cambios:**
   - Hacer clic en "💾 Guardar Cambios"
   - Esperar notificación de éxito
   - Los cambios se aplican inmediatamente en la página

5. **Verificar en Homepage:**
   - Abrir la homepage en nueva pestaña
   - Refrescar (F5) para ver los cambios
   - Si no se ven, esperar 5 minutos (caché)

### Consejos
- Siempre guardar cambios antes de cambiar de pestaña
- Los backups se crean automáticamente en cada guardado
- Si algo sale mal, contactar al desarrollador con el timestamp del error

---

## 📞 SOPORTE

**Desarrollador:** GitHub Copilot
**Fecha:** 17 de Diciembre, 2024
**Versión:** 1.0

**Contacto para Soporte Técnico:**
- Revisar este documento primero
- Verificar logs del servidor PHP
- Verificar consola del navegador (F12)
- Documentar el error con capturas de pantalla

---

## 🎉 CONCLUSIÓN

Has desplegado exitosamente un **Sistema CMS Completo** para AfrikaSport365 que incluye:

✅ 12 secciones completamente editables  
✅ Dashboard intuitivo con navegación por pestañas  
✅ Backups automáticos antes de cada guardado  
✅ Sistema de fallback para compatibilidad  
✅ Herramienta de migración de datos  
✅ Frontend dinámico con carga automática  

**¡El sitio web ahora es 100% administrable desde el panel!** 🚀
