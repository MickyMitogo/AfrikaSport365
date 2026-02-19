// Firebase Opinions Data Initialization Script
// Importa datos desde analisis-opinion.json a Firestore

import {
    db,
    addNews,
    getAllNews
} from './firebase-config.js';
import { collection, getDocs, writeBatch, doc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const OPINIONS_COLLECTION = 'analisis_opinion';
const OPINIONS_DATA_FILE = './data/analisis-opinion.json';

/**
 * Load JSON file
 */
async function loadJsonFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
        throw error;
    }
}

/**
 * Clear opinions collection
 */
async function clearCollection() {
    try {
        console.log(`Limpiando colección "${OPINIONS_COLLECTION}"...`);
        const collectionRef = collection(db, OPINIONS_COLLECTION);
        const querySnapshot = await getDocs(collectionRef);

        if (querySnapshot.docs.length === 0) {
            console.log('Colección ya está vacía');
            return true;
        }

        const batch = writeBatch(db);
        querySnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log(`✓ Colección "${OPINIONS_COLLECTION}" limpiada`);
        return true;
    } catch (error) {
        console.error(`Error clearing collection ${OPINIONS_COLLECTION}:`, error);
        throw error;
    }
}

/**
 * Generate slug from title
 */
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
}

/**
 * Import opinions from JSON to Firebase
 */
export async function initializeOpinionsData(clearFirst = false) {
    try {
        console.log('\n📥 Importando opiniones...');

        // Load JSON data
        const jsonData = await loadJsonFile(OPINIONS_DATA_FILE);
        if (!jsonData || !Array.isArray(jsonData)) {
            throw new Error('Datos de opiniones inválidos');
        }

        const opinionsArray = jsonData;

        // Clear collection if requested
        if (clearFirst) {
            await clearCollection();
        }

        // Import opinions
        let count = 0;
        for (const opinion of opinionsArray) {
            try {
                const opinionData = {
                    // Campos principales
                    titulo: opinion.titulo || 'Sin título',
                    slug: opinion.slug || generateSlug(opinion.titulo || ''),
                    resumen: opinion.resumen || '',
                    contenido: opinion.contenido || '',

                    // Imágenes
                    imagen: opinion.imagen || '',
                    autorImagen: opinion.autorImagen || '',

                    // Información del autor
                    autor: opinion.autor || 'Anónimo',

                    // Clasificación
                    badge: opinion.badge || 'OPINIÓN',
                    badgeColor: opinion.badgeColor || '#8b5cf6',
                    tipo: opinion.tipo || 'opinion',

                    // Metadatos
                    featured: opinion.featured || false,
                    meta: {
                        author: opinion.autor || opinion.meta?.author || 'Anónimo',
                        date: opinion.fecha || opinion.meta?.date || new Date().toISOString().split('T')[0]
                    },

                    // Timestamps
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                // Add to Firebase
                await addNews(opinionData, OPINIONS_COLLECTION);
                count++;
                console.log(`✓ Opinión importada: ${opinionData.titulo}`);

            } catch (error) {
                console.error(`Error importing opinion: ${error.message}`);
            }
        }

        console.log(`\n✓ Importación completada: ${count} opiniones cargadas`);
        return count;

    } catch (error) {
        console.error('Error in initializeOpinionsData:', error);
        throw new Error(`Error importing opinions: ${error.message}`);
    }
}

/**
 * Check opinions collection status
 */
export async function checkOpinionsStatus() {
    try {
        const opinions = await getAllNews(OPINIONS_COLLECTION);
        console.log(`Opiniones en Firebase: ${opinions.length}`);

        return {
            count: opinions.length,
            opinions: opinions.map(op => ({
                id: op.id,
                titulo: op.titulo,
                slug: op.slug,
                featured: op.featured
            }))
        };
    } catch (error) {
        console.error('Error checking opinions status:', error);
        throw new Error(`Error checking status: ${error.message}`);
    }
}
