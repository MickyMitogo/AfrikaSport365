# AfrikaSport365 - Dynamic Article System Guide

## Overview
This document explains the production-grade dynamic article system implemented for AfrikaSport365. The system allows news articles to be dynamically loaded from a centralized JSON data source without requiring code changes.

---

## System Architecture

### Components

1. **Data Source**: `data/articles.json`
   - Centralized JSON file containing all article content
   - Single source of truth for all articles

2. **Article Loader**: `js/article-loader.js`
   - Production-ready JavaScript module (Vanilla JS, no frameworks)
   - Handles URL parsing, data loading, template injection, error handling, and SEO

3. **Article Template**: `article.html`
   - Semantic HTML template with clear injection points
   - Dynamically populated based on URL slug parameter

4. **News Cards**: `index.html`
   - Updated with `data-article-slug` attributes
   - Links include slug parameter (`article.html?slug=article-slug`)

---

## How It Works

### User Flow
1. User clicks on any news card in `index.html`
2. Browser navigates to `article.html?slug=article-slug`
3. `article-loader.js` automatically executes:
   - Extracts slug from URL
   - Loads `articles.json`
   - Finds matching article by slug
   - Injects content into template
   - Updates page title and meta tags for SEO
   - Displays article or shows error state if not found

### URL Structure
```
article.html?slug=nzalang-eliminatorias-afcon-2025
article.html?slug=record-nacional-100-metros-femeninos
article.html?slug=medalla-plata-judo-campeonato-africano
```

---

## Adding a New Article

### Step 1: Add Article Data to JSON

Edit `data/articles.json` and add a new article object to the `articles` array:

```json
{
  "id": "unique-article-id",
  "slug": "seo-friendly-url-slug",
  "title": "Article Title",
  "subtitle": "Brief subtitle or lead",
  "category": "Category Name",
  "categoryColor": "#hexcolor",
  "author": "Author Name",
  "authorImage": "images/author.jpg",
  "date": "2025-12-14T12:00:00",
  "dateDisplay": "14 de diciembre, 2025 • 12:00",
  "heroImage": "images/hero-image.jpg",
  "excerpt": "Short excerpt for card preview",
  "content": [
    {
      "type": "lead",
      "text": "Opening paragraph with <strong>bold text</strong> support"
    },
    {
      "type": "paragraph",
      "text": "Regular paragraph text"
    },
    {
      "type": "heading",
      "text": "Section Heading"
    },
    {
      "type": "image",
      "src": "images/article-image.jpg",
      "caption": "Image caption"
    },
    {
      "type": "quote",
      "text": "Quote text",
      "author": "Person Name",
      "authorRole": "Title or role",
      "authorImage": "images/person.jpg"
    }
  ],
  "tags": ["Tag1", "Tag2", "Tag3"],
  "readTime": "5 min"
}
```

### Step 2: Add News Card to Homepage

Edit `index.html` and add a new news card in the `news-grid` section:

```html
<article class="news-card" data-article-slug="your-article-slug">
    <div class="news-image">
        <img src="images/your-image.jpg" alt="Alt text">
        <span class="news-category-badge" style="background: #hexcolor;">CATEGORY</span>
    </div>
    <div class="news-content">
        <h3 class="news-title">
            <a href="article.html?slug=your-article-slug">Article Title</a>
        </h3>
        <p class="news-excerpt">
            Short excerpt text
        </p>
        <div class="news-meta">
            <span>📅 Date</span>
            <span>✍️ Author</span>
        </div>
    </div>
</article>
```

### Step 3: Test

1. Open `index.html` in browser
2. Click on your new news card
3. Verify article loads correctly with all content
4. Check page title updates
5. Test error handling by using invalid slug

---

## Content Block Types

### Lead Paragraph
```json
{
  "type": "lead",
  "text": "Opening paragraph with <strong>HTML support</strong>"
}
```

### Regular Paragraph
```json
{
  "type": "paragraph",
  "text": "Regular text content"
}
```

### Heading (H2)
```json
{
  "type": "heading",
  "text": "Section Title"
}
```

### Image with Caption
```json
{
  "type": "image",
  "src": "images/image.jpg",
  "caption": "Image description"
}
```

### Blockquote with Author
```json
{
  "type": "quote",
  "text": "Quote text",
  "author": "Person Name",
  "authorRole": "Title",
  "authorImage": "images/avatar.jpg"
}
```

### Gallery (Optional)
Add to article root (not in content array):
```json
"gallery": [
  {
    "src": "images/img1.jpg",
    "caption": "Image 1 caption"
  },
  {
    "src": "images/img2.jpg",
    "caption": "Image 2 caption"
  }
]
```

### Timeline (Optional)
Add to article root (not in content array):
```json
"timeline": [
  {
    "round": "R1",
    "title": "Event Title",
    "description": "Event description"
  }
]
```

---

## SEO Features

The system automatically handles:

- **Page Title**: Updates to `{Article Title} - AfrikaSport365`
- **Meta Description**: Uses article excerpt
- **Open Graph Tags**: For social media sharing
- **Twitter Card**: For Twitter sharing
- **Canonical URL**: Based on slug

---

## Error Handling

### Article Not Found
- System displays branded 404-style error page
- Shows user-friendly message
- Provides "Return to Homepage" button
- Auto-redirects after 5 seconds

### Network Errors
- Catches JSON loading failures
- Shows error state
- Logs errors to console for debugging

---

## Current Articles

1. **Nzalang Nacional AFCON** (`nzalang-eliminatorias-afcon-2025`)
   - Category: Fútbol
   - Hero image: OIP (1).webp

2. **Record 100 Metros** (`record-nacional-100-metros-femeninos`)
   - Category: Atletismo
   - Hero image: atletismo.jpg

3. **Medalla Plata Judo** (`medalla-plata-judo-campeonato-africano`)
   - Category: Judo
   - Hero image: judo.jpg

4. **Liga Baloncesto** (`liga-baloncesto-record-inscripciones`)
   - Category: Baloncesto
   - Hero image: baloncesto.jpg

5. **Promesa Tenis** (`joven-promesa-tenis-academia-europea`)
   - Category: Tenis
   - Hero image: tenis.jpg

6. **Yann Mike Alogo** (`yann-mike-alogo-victoria-addis-abeba`)
   - Category: Boxeo
   - Hero image: IMG_5896-1.jpg
   - Includes gallery and timeline

---

## Best Practices

### Slugs
- Use lowercase
- Separate words with hyphens
- Use Spanish characters without accents (e.g., "eliminatorias" not "élīmīnātōrīās")
- Keep concise but descriptive
- Must be unique across all articles

### Images
- Store in `images/` directory
- Use descriptive filenames
- Optimize for web (compressed, appropriate size)
- Use WebP format when possible

### Content
- Write HTML in "text" fields for formatting (`<strong>`, `<em>`, etc.)
- Break long articles into multiple content blocks
- Use headings to structure content
- Add images between sections for visual breaks

### Categories
- Be consistent with category names
- Use consistent colors for same category
- Common categories: Fútbol, Atletismo, Judo, Baloncesto, Tenis, Boxeo

---

## Maintenance

### Adding New Articles
- Only requires editing `articles.json` and `index.html`
- No JavaScript code changes needed
- No CSS changes required

### Updating Existing Articles
- Edit the article object in `articles.json`
- Changes reflect immediately on page reload
- No cache clearing needed (development)

### Removing Articles
- Remove from `articles.json`
- Remove corresponding news card from `index.html`
- Archive or delete associated images if no longer needed

---

## Technical Details

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6+ support (Vanilla JS)
- No polyfills needed for target audience

### Performance
- JSON loads once per page view
- Images lazy-loaded where supported
- Minimal JavaScript execution
- No external dependencies

### Accessibility
- Semantic HTML structure
- Alt text on all images
- Proper heading hierarchy
- Keyboard navigation supported

---

## Troubleshooting

### Article Not Loading
1. Check browser console for errors
2. Verify slug in URL matches slug in JSON
3. Verify `articles.json` is valid JSON (use JSON validator)
4. Check file paths for images

### Images Not Displaying
1. Verify image paths relative to `article.html`
2. Check image files exist in `images/` directory
3. Check browser console for 404 errors

### Styling Issues
1. Verify `css/article.css` is loaded
2. Check for CSS conflicts
3. Clear browser cache

---

## Future Enhancements

Possible improvements:
- Search functionality across articles
- Article filtering by category
- Related articles algorithm
- Comments system
- Social sharing analytics
- Reading progress indicator
- Print-friendly version

---

## Support

For issues or questions, check:
1. Browser console for JavaScript errors
2. Network tab for loading failures
3. This guide for implementation details

---

**Last Updated**: December 2025  
**Version**: 1.0.0  
**Maintainer**: AfrikaSport365 Development Team
