// Firebase Data Initialization Script
// Este script importa datos desde los archivos JSON locales a Firestore

import {
    db,
    addNews, getAllNews
} from './firebase-config.js';
import { collection, getDocs, writeBatch, doc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const collectionMap = {
    'all-news': 'noticias',
    'latest-news': 'noticias_ultimas',
    'breaking-news': 'noticias_urgentes',
    'regional-news': 'noticias_regionales',
    'analisis-opinion': 'analisis_opinion'
};

const dataFiles = {
    'all-news': './data/all-news.json',
    'latest-news': './data/latest-news.json',
    'breaking-news': './data/breaking-news.json',
    'regional-news': './data/regional-news.json',
    'analisis-opinion': './data/analisis-opinion.json'
};

// Función para cargar un archivo JSON
async function loadJsonFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
        return null;
    }
}

// Función para limpiar una colección
async function clearCollection(collectionName) {
    try {
        const collectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(collectionRef);

        const batch = writeBatch(db);
        querySnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log(`✓ Colección "${collectionName}" limpiada`);
        return true;
    } catch (error) {
        console.error(`Error clearing collection ${collectionName}:`, error);
        return false;
    }
}

// Función para importar datos a una colección
async function importDataToCollection(dataType, clearFirst = false) {
    try {
        console.log(`\n📥 Importando ${dataType}...`);

        // Cargar archivo JSON
        const jsonData = await loadJsonFile(dataFiles[dataType]);
        if (!jsonData) {
            console.error(`❌ No se pudo cargar ${dataType}`);
            return 0;
        }

        const collectionName = collectionMap[dataType];
        const newsArray = jsonData.news || [];

        // Limpiar colección si se solicita
        if (clearFirst) {
            await clearCollection(collectionName);
        }

        // Importar documentos
        let count = 0;
        for (const newsItem of newsArray) {
            try {
                // Crear documento con generatedId manteniendo el ID original
                const docData = {
                    ...newsItem,
                    title: newsItem.title || 'Sin título',
                    excerpt: newsItem.excerpt || '',
                    image: newsItem.image || '',
                    category: newsItem.category || '',
                    categoryColor: newsItem.categoryColor || '#000000',
                    featured: newsItem.featured || false,
                    content: newsItem.content || '',
                    meta: {
                        author: newsItem.meta?.author || 'Anónimo',
                        date: newsItem.meta?.date || new Date().toISOString().split('T')[0]
                    },
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                // Usar el ID original si existe, si no generar uno
                const docRef = doc(db, collectionName, newsItem.id?.toString() || `doc_${Date.now()}_${Math.random()}`);
                await writeBatch(db).set(docRef, docData).commit();
                count++;
                console.log(`  ✓ ${newsItem.title || 'Documento'}`);
            } catch (error) {
                console.error(`  ❌ Error importando item:`, error);
            }
        }

        console.log(`✓ ${count} documentos importados a "${collectionName}"`);
        return count;
    } catch (error) {
        console.error(`Error importing ${dataType}:`, error);
        return 0;
    }
}

// Función principal para inicializar todo
export async function initializeFirebaseData(clearExisting = false) {
    console.log('═══════════════════════════════════════════');
    console.log('🔥 Iniciando importación de datos a Firebase');
    console.log('═══════════════════════════════════════════');

    let totalImported = 0;
    const dataTypes = Object.keys(dataFiles);

    for (const dataType of dataTypes) {
        const imported = await importDataToCollection(dataType, clearExisting);
        totalImported += imported;
    }

    console.log('═══════════════════════════════════════════');
    console.log(`✓ Inicialización completada: ${totalImported} documentos importados`);
    console.log('═══════════════════════════════════════════');

    return totalImported;
}

// Función para verificar estado de colecciones
export async function checkCollectionsStatus() {
    console.log('\n📊 Estado de colecciones:');
    console.log('─────────────────────────');

    for (const [dataType, collectionName] of Object.entries(collectionMap)) {
        try {
            const collectionRef = collection(db, collectionName);
            const querySnapshot = await getDocs(collectionRef);
            console.log(`${collectionName}: ${querySnapshot.size} documentos`);
        } catch (error) {
            console.error(`Error checking ${collectionName}:`, error);
        }
    }
}

// Si se ejecuta directamente desde consola o como módulo
if (typeof window !== 'undefined') {
    window.initializeFirebaseData = initializeFirebaseData;
    window.checkCollectionsStatus = checkCollectionsStatus;

    console.log('✓ Funciones disponibles:');
    console.log('  - initializeFirebaseData(clearExisting)');
    console.log('  - checkCollectionsStatus()');
    console.log('\nEjemplo: initializeFirebaseData(false)');
}
