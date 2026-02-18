// Firebase Breaking News Initialization Script
// Este script importa las frases de breaking-news.json a Firestore

import { db } from './firebase-config.js';
import { collection, getDocs, writeBatch, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const BREAKING_NEWS_COLLECTION = 'noticias_urgentes';
const BREAKING_NEWS_FILE = './data/breaking-news.json';

/**
 * Cargar archivo JSON
 */
async function loadJsonFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error cargando ${filePath}:`, error);
        return null;
    }
}

/**
 * Limpiar colección
 */
async function clearCollectionBreakingNews() {
    try {
        console.log('🗑️ Limpiando colección de breaking news...');
        const collectionRef = collection(db, BREAKING_NEWS_COLLECTION);
        const querySnapshot = await getDocs(collectionRef);

        const batch = writeBatch(db);
        querySnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log('✅ Colección limpiada');
        return true;
    } catch (error) {
        console.error('❌ Error limpiando colección:', error);
        throw error;
    }
}

/**
 * Importar breaking news a Firestore
 */
async function importBreakingNewsToFirestore(newsArray) {
    try {
        if (!Array.isArray(newsArray)) {
            throw new Error('Los datos deben ser un array de strings');
        }

        console.log(`📥 Importando ${newsArray.length} noticias de última hora...`);

        const batch = writeBatch(db);
        let count = 0;

        newsArray.forEach((newsText, index) => {
            // Usar índice como ID para mantener orden
            const docId = String(index + 1).padStart(2, '0');

            const docRef = doc(db, BREAKING_NEWS_COLLECTION, docId);
            batch.set(docRef, {
                id: docId,
                title: newsText,
                excerpt: newsText,
                content: newsText,
                image: '',
                category: 'ÚLTIMA HORA',
                categoryColor: '#ef4444',
                featured: false,
                meta: {
                    author: 'Sistema',
                    date: new Date().toISOString().split('T')[0]
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            count++;
        });

        await batch.commit();
        console.log(`✅ ${count} noticias de última hora importadas exitosamente`);
        return count;
    } catch (error) {
        console.error('❌ Error importando breaking news:', error);
        throw error;
    }
}

/**
 * Verificar estado de la colección
 */
async function checkBreakingNewsStatus() {
    try {
        const collectionRef = collection(db, BREAKING_NEWS_COLLECTION);
        const querySnapshot = await getDocs(collectionRef);

        console.log('\n📊 Estado de la colección "noticias_urgentes":');
        console.log(`📌 Total de noticias: ${querySnapshot.size}`);

        if (querySnapshot.size > 0) {
            console.log('\n📋 Noticias de última hora:');
            querySnapshot.docs.forEach((doc) => {
                const data = doc.data();
                console.log(`  • ${data.title}`);
            });
        }

        return querySnapshot.size;
    } catch (error) {
        console.error('❌ Error verificando estado:', error);
        throw error;
    }
}

/**
 * Función principal de inicialización
 * @param {boolean} clearExisting - Si true, limpia colección antes de importar
 */
export async function initializeBreakingNews(clearExisting = false) {
    try {
        console.log('\n🚀 Iniciando importación de breaking news a Firebase...');

        // Limpiar si se requiere
        if (clearExisting) {
            await clearCollectionBreakingNews();
        }

        // Cargar datos
        const breakingNewsArray = await loadJsonFile(BREAKING_NEWS_FILE);
        if (!breakingNewsArray) {
            throw new Error('No se pudo cargar el archivo de breaking news');
        }

        // Importar
        const imported = await importBreakingNewsToFirestore(breakingNewsArray);

        // Verificar
        await checkBreakingNewsStatus();

        console.log('\n✅ Inicialización de breaking news completada');
        return imported;

    } catch (error) {
        console.error('\n❌ Error en la inicialización:', error);
        throw error;
    }
}

/**
 * Exportar funciones para uso en consola
 */
export { checkBreakingNewsStatus, clearCollectionBreakingNews };
