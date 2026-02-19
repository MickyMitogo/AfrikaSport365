// Init Multimedia Data - Import from JSON to Firestore
import {
    db
} from './firebase-config.js';
import { collection, getDocs, deleteDoc, query, where, writeBatch, doc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const MULTIMEDIA_COLLECTION = 'multimedia';

// Fetch multimedia data from JSON
async function fetchMultimediaJSON() {
    try {
        const response = await fetch('data/multimedia.json');
        if (!response.ok) throw new Error('Error al cargar multimedia.json');
        return await response.json();
    } catch (error) {
        console.error('Error fetching multimedia JSON:', error);
        throw error;
    }
}

// Initialize Multimedia Data
export async function initializeMultimediaData() {
    try {
        const multimediaItems = await fetchMultimediaJSON();

        if (!Array.isArray(multimediaItems) || multimediaItems.length === 0) {
            throw new Error('No hay datos de multimedia en el JSON');
        }

        let importedCount = 0;

        for (const item of multimediaItems) {
            try {
                // Check if already exists by ID
                const docRef = doc(db, MULTIMEDIA_COLLECTION, item.id.toString());
                const docSnap = await getDocs(query(collection(db, MULTIMEDIA_COLLECTION), where('id', '==', item.id)));

                if (docSnap.empty) {
                    const multimediaData = {
                        id: item.id,
                        type: item.type || 'image',
                        title: item.title,
                        src: item.src,
                        thumbnail: item.thumbnail || null,
                        alt: item.alt,
                        date: item.date,
                        category: item.category,
                        featured: item.featured || false,
                        description: item.description || '',
                        fecha_registro: new Date(),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };

                    // Use id as document ID for consistency
                    const docID = doc(db, MULTIMEDIA_COLLECTION, item.id.toString());
                    const batch = writeBatch(db);
                    batch.set(docID, multimediaData);
                    await batch.commit();
                    importedCount++;
                    console.log(`✓ Importado: ${item.title}`);
                } else {
                    console.log(`⊘ Multimedia ya existe: ${item.title}`);
                }
            } catch (error) {
                console.error(`Error importando ${item.title}:`, error);
            }
        }

        return `✅ ${importedCount} elementos importados exitosamente de ${multimediaItems.length} disponibles.`;

    } catch (error) {
        console.error('Error initializing multimedia:', error);
        throw error;
    }
}

// Check Multimedia Status
export async function checkMultimediaStatus() {
    try {
        const snapshot = await getDocs(collection(db, MULTIMEDIA_COLLECTION));
        const count = snapshot.size;

        if (count === 0) {
            return '📭 No hay multimedia en Firestore. Haz clic en "Importar Multimedia".';
        }

        // Count by type and category
        const types = {};
        const categories = {};
        const featured = [];

        snapshot.forEach(doc => {
            const data = doc.data();

            // Count by type
            const type = data.type || 'desconocido';
            types[type] = (types[type] || 0) + 1;

            // Count by category
            const category = data.category || 'Desconocida';
            categories[category] = (categories[category] || 0) + 1;

            // Track featured
            if (data.featured) {
                featured.push(data.title);
            }
        });

        const typeBreakdown = Object.entries(types)
            .map(([type, count]) => `${type}: ${count}`)
            .join(', ');

        const categoryBreakdown = Object.entries(categories)
            .map(([cat, count]) => `${cat}: ${count}`)
            .join(', ');

        let status = `📊 Total: ${count} elementos<br>`;
        status += `📷 Por tipo: ${typeBreakdown}<br>`;
        status += `🏷️ Por categoría: ${categoryBreakdown}<br>`;
        status += `⭐ Destacados: ${featured.length}`;

        if (featured.length > 0) {
            status += ` (${featured.slice(0, 3).join(', ')}${featured.length > 3 ? '...' : ''})`;
        }

        return status;

    } catch (error) {
        console.error('Error checking status:', error);
        throw error;
    }
}

// Clear and Import Multimedia
export async function clearAndImportMultimedia() {
    try {
        // Get all documents
        const snapshot = await getDocs(collection(db, MULTIMEDIA_COLLECTION));

        // Delete all documents using batch
        if (snapshot.docs.length > 0) {
            const batch = writeBatch(db);
            snapshot.docs.forEach((document) => {
                batch.delete(document.ref);
            });
            await batch.commit();
            console.log(`🗑️ Eliminados ${snapshot.docs.length} elementos`);
        }

        // Now import fresh
        const result = await initializeMultimediaData();
        return `🔄 Eliminados ${snapshot.docs.length} elementos anteriores.<br>${result}`;

    } catch (error) {
        console.error('Error clearing and importing:', error);
        throw error;
    }
}
