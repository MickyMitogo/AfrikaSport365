// Init Historia Destacada Data - Import from JSON to Firestore
import { db } from './firebase-config.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const HERO_COLLECTION = 'hero';
const HERO_DOC_ID = 'main';

// Fetch hero data from JSON
async function fetchHeroJSON() {
    try {
        const response = await fetch('data/hero-about.json');
        if (!response.ok) throw new Error('Error al cargar hero-about.json');
        const data = await response.json();
        return data.hero;
    } catch (error) {
        console.error('Error fetching hero JSON:', error);
        throw error;
    }
}

// Initialize Historia Destacada Data
export async function initializeHistoriaData() {
    try {
        const heroData = await fetchHeroJSON();

        if (!heroData) {
            throw new Error('No hay datos de Historia Destacada en el JSON');
        }

        // Parse the data and map fields
        const historiaData = {
            badge: heroData.badge || 'HISTORIA DESTACADA',
            title: heroData.title || '',
            excerpt: heroData.excerpt || '',
            author: heroData.meta?.author?.replace('✍️ ', '').trim() || 'AfrikaSport365',
            date: parseDate(heroData.meta?.date),
            readTime: parseInt(heroData.meta?.readTime?.match(/\d+/)?.[0]) || 8,
            slug: heroData.ctaLink?.split('slug=')[1] || 'historia-destacada',
            backgroundImage: heroData.backgroundImage || '',
            backgroundCssImage: '', // Will be empty initially
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Save to Firestore
        const docRef = doc(db, HERO_COLLECTION, HERO_DOC_ID);
        await setDoc(docRef, historiaData, { merge: true });

        console.log('✓ Historia Destacada inicializada:', historiaData);
        return `Historia Destacada importada exitosamente.`;

    } catch (error) {
        console.error('Error initializing Historia:', error);
        throw error;
    }
}

// Helper function to parse date strings
function parseDate(dateString) {
    try {
        if (!dateString) return new Date().toISOString().split('T')[0];

        // Remove emoji and trim
        const cleanDate = dateString.replace(/[📅✍️⏱️]/g, '').trim();

        // Try to parse the date - use today's date as fallback
        const parsedDate = new Date(cleanDate);

        if (isNaN(parsedDate.getTime())) {
            // If parsing fails, extract day and year from Spanish format
            // Format: "15 de Enero, 2025"
            const match = cleanDate.match(/(\d+)\s+de\s+(\w+),?\s+(\d{4})/);
            if (match) {
                const monthMap = {
                    'Enero': '01', 'Febrero': '02', 'Marzo': '03', 'Abril': '04',
                    'Mayo': '05', 'Junio': '06', 'Julio': '07', 'Agosto': '08',
                    'Septiembre': '09', 'Octubre': '10', 'Noviembre': '11', 'Diciembre': '12'
                };
                const day = match[1].padStart(2, '0');
                const month = monthMap[match[2]] || '01';
                const year = match[3];
                return `${year}-${month}-${day}`;
            }
            return new Date().toISOString().split('T')[0];
        }

        return parsedDate.toISOString().split('T')[0];
    } catch (e) {
        console.warn('Date parsing failed:', dateString, e);
        return new Date().toISOString().split('T')[0];
    }
}

// Check Historia Status
export async function checkHistoriaStatus() {
    try {
        const { getDoc } = await import("https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js");
        const docRef = doc(db, HERO_COLLECTION, HERO_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return `✓ Historia Destacada existe en Firebase. Documento: ${JSON.stringify(docSnap.data(), null, 2)}`;
        } else {
            return `⊘ Historia Destacada no existe en Firebase. Necesita inicialización.`;
        }
    } catch (error) {
        console.error('Error checking status:', error);
        throw error;
    }
}

// Clear and Re-import
export async function clearAndImportHistoria() {
    try {
        const { deleteDoc } = await import("https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js");
        const docRef = doc(db, HERO_COLLECTION, HERO_DOC_ID);

        // Delete existing document
        await deleteDoc(docRef);
        console.log('⊘ Documento anterior eliminado');

        // Re-import fresh data
        return await initializeHistoriaData();
    } catch (error) {
        console.error('Error clearing and importing:', error);
        throw error;
    }
}
