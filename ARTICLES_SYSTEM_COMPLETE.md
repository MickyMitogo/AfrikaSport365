# Articles Management System

## Overview
Sistema completo de gestión de artículos integrado en el dashboard de administración de AfrikaSport365.

## Características

### ✅ Sin Duplicados
- Validación de IDs únicos en el cliente y servidor
- Validación de slugs únicos en el cliente y servidor
- Mensajes de error claros cuando se detectan duplicados

### 📝 Editor Completo
- Formulario intuitivo para editar artículos
- Campos principales:
  - ID (único)
  - Slug (único, URL-friendly)
  - Título y subtítulo
  - Categoría y color de categoría
  - Autor e imagen del autor
  - Imagen destacada (hero image)
  - Extracto
  - Fecha (ISO format) y fecha de visualización
  - Contenido (bloques de contenido)

### 🎨 Interfaz Visual
- Vista en cuadrícula (grid) de todos los artículos
- Tarjetas con vista previa de imagen
- Información rápida: categoría, fecha, título, extracto
- Botones de edición y eliminación por artículo
- Contador de artículos total

### 🔒 Seguridad
- Autenticación requerida
- Protección CSRF en todas las operaciones
- Validación de datos en cliente y servidor

## Archivos Creados

### API Endpoints
1. **`admin/api/get-articles.php`**
   - Lee articles.json
   - Requiere autenticación y CSRF
   - Retorna todos los artículos

2. **`admin/api/save-articles.php`**
   - Guarda cambios en articles.json
   - Valida campos requeridos
   - Valida duplicados de ID y slug
   - Requiere autenticación y CSRF

### Frontend
1. **`admin/assets/articles-admin.js`**
   - Lógica completa de gestión de artículos
   - CRUD operations (Create, Read, Update, Delete)
   - Editor modal para cada artículo
   - Validación de duplicados en tiempo real
   - Generación automática de IDs únicos

2. **Estilos en `admin/assets/admin.css`**
   - Grid responsivo de artículos
   - Tarjetas de artículo con imagen
   - Modal de edición
   - Diseño consistente con el resto del dashboard

### Dashboard
- **`admin/dashboard.php`** actualizado
  - Tab "Articles" ahora activo
  - Interfaz de gestión integrada

## Uso

### Acceso
1. Ingresar al dashboard: `/admin/`
2. Click en el tab "Articles"

### Agregar Artículo
1. Click en "Add New Article"
2. Se crea un artículo con ID único automático
3. Se abre el editor automáticamente
4. Completar los campos
5. Click en "Save Changes"
6. Click en "Save All Articles" para guardar en el servidor

### Editar Artículo
1. Click en "Edit" en la tarjeta del artículo
2. Modificar los campos necesarios
3. Click en "Save Changes"
4. Click en "Save All Articles" para guardar en el servidor

### Eliminar Artículo
1. Click en el botón "×" (rojo) en la esquina superior derecha de la tarjeta
2. Confirmar la eliminación
3. Click en "Save All Articles" para guardar en el servidor

### Vista Previa JSON
- Click en "Preview JSON" para ver la estructura completa de datos
- Útil para debugging o exportación

## Estructura de Datos

```json
{
  "articles": [
    {
      "id": "unique-id",
      "slug": "url-friendly-slug",
      "title": "Título del Artículo",
      "subtitle": "Subtítulo opcional",
      "category": "Fútbol",
      "categoryColor": "#ef4444",
      "author": "Nombre del Autor",
      "authorImage": "images/author.jpg",
      "date": "2025-12-19T12:00:00.000Z",
      "dateDisplay": "19 de diciembre, 2025",
      "heroImage": "images/hero.jpg",
      "excerpt": "Extracto del artículo...",
      "content": [
        {
          "type": "paragraph",
          "text": "Contenido..."
        }
      ]
    }
  ]
}
```

## Validaciones

### Cliente (JavaScript)
- IDs únicos antes de guardar
- Slugs únicos antes de guardar
- Campos requeridos completos
- Alerta visual si hay problemas

### Servidor (PHP)
- Validación de campos requeridos (id, slug, title)
- Validación de duplicados en ID
- Validación de duplicados en slug
- Respuestas de error descriptivas

## Integración con la Página Principal

Los artículos guardados en el dashboard se pueden utilizar en:

1. **`js/content-loader.js`** - Carga dinámica de artículos
2. **`js/article-loader.js`** - Carga artículos individuales
3. **`js/homepage-bindings.js`** - Vincula artículos a la homepage

## Troubleshooting

### No se cargan los artículos
- Verificar que `data/articles.json` existe
- Verificar permisos de lectura del archivo
- Revisar consola del navegador para errores

### No se guardan los cambios
- Verificar autenticación (sesión activa)
- Verificar token CSRF en el meta tag
- Revisar permisos de escritura en `data/articles.json`
- Revisar consola del navegador para errores

### Error de duplicados
- Cada artículo debe tener un ID único
- Cada artículo debe tener un slug único
- Revisar manualmente `data/articles.json` si es necesario

## Próximas Mejoras Posibles

- [ ] Editor visual de contenido (bloques)
- [ ] Upload de imágenes desde el dashboard
- [ ] Búsqueda y filtrado de artículos
- [ ] Paginación para muchos artículos
- [ ] Categorías predefinidas con selector
- [ ] Gestión de tags
- [ ] Programación de publicación futura
- [ ] Borradores y estados de artículo
