// Init Regional News Data - Import from JSON to Firestore
import {
    db
} from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, query, where, writeBatch, doc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const REGIONAL_NEWS_COLLECTION = 'regional_news';

// Fetch regional news data from JSON
async function fetchRegionalNewsJSON() {
    try {
        const response = await fetch('data/regional-news.json');
        if (!response.ok) throw new Error('Error al cargar regional-news.json');
        return await response.json();
    } catch (error) {
        console.error('Error fetching regional news JSON:', error);
        throw error;
    }
}

// Initialize Regional News Data
export async function initializeRegionalNewsData() {
    try {
        const regionalNews = await fetchRegionalNewsJSON();

        if (!Array.isArray(regionalNews) || regionalNews.length === 0) {
            throw new Error('No hay datos de noticias regionales en el JSON');
        }

        let importedCount = 0;

        for (const news of regionalNews) {
            try {
                // Check if already exists
                const q = query(collection(db, REGIONAL_NEWS_COLLECTION), where('slug', '==', news.slug));
                const existingDocs = await getDocs(q);

                if (existingDocs.empty) {
                    const newsData = {
                        titulo: news.titulo,
                        slug: news.slug || news.titulo.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
                        resumen: news.resumen,
                        contenido: news.contenido,
                        imagen: news.imagen,
                        autor: news.autor,
                        region: news.region,
                        regionName: news.regionName,
                        categoria: news.categoria || 'General',
                        fecha: news.fecha ? new Date(news.fecha) : new Date(),
                        fechaMostrada: news.fechaMostrada,
                        featured: false,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        meta: {
                            author: news.autor,
                            date: news.fecha ? new Date(news.fecha) : new Date()
                        }
                    };

                    await addDoc(collection(db, REGIONAL_NEWS_COLLECTION), newsData);
                    importedCount++;
                    console.log(`✓ Importada noticia: ${news.titulo}`);
                } else {
                    console.log(`⊘ Noticia ya existe: ${news.titulo}`);
                }
            } catch (error) {
                console.error(`Error importando noticia ${news.titulo}:`, error);
            }
        }

        return `${importedCount} noticias regionales importadas exitosamente de ${regionalNews.length} disponibles.`;

    } catch (error) {
        console.error('Error initializing regional news:', error);
        throw error;
    }
}

// Check Regional News Status
export async function checkRegionalNewsStatus() {
    try {
        const snapshot = await getDocs(collection(db, REGIONAL_NEWS_COLLECTION));
        const count = snapshot.size;

        if (count === 0) {
            return 'No hay noticias regionales en Firestore. Haz clic en "Importar Noticias Regionales".';
        }

        // Count by region
        const regions = {};
        snapshot.forEach(doc => {
            const region = doc.data().region || 'Desconocida';
            regions[region] = (regions[region] || 0) + 1;
        });

        const regionBreakdown = Object.entries(regions)
            .map(([region, count]) => `${region}: ${count}`)
            .join(', ');

        return `Total: ${count} noticias regionales en Firestore. Por región: ${regionBreakdown}`;

    } catch (error) {
        console.error('Error checking status:', error);
        throw error;
    }
}

// Clear and Import Regional News
export async function clearAndImportRegionalNews() {
    try {
        // Get all documents
        const snapshot = await getDocs(collection(db, REGIONAL_NEWS_COLLECTION));

        // Delete all documents using batch
        if (snapshot.docs.length > 0) {
            const batch = writeBatch(db);
            snapshot.docs.forEach((document) => {
                batch.delete(document.ref);
            });
            await batch.commit();
            console.log(`🗑️ Eliminadas ${snapshot.docs.length} noticias regionales`);
        }

        // Now import fresh
        const result = await initializeRegionalNewsData();
        return `Eliminadas ${snapshot.docs.length} noticias anteriores. ${result}`;

    } catch (error) {
        console.error('Error clearing and importing:', error);
        throw error;
    }
}
