// Firebase Eventos Initialization Script
// Este script importa eventos desde eventos.json a Firestore

import {
    db
} from './firebase-config.js';
import { collection, getDocs, writeBatch, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const EVENTOS_COLLECTION = 'eventos';
const EVENTOS_FILE = './data/eventos.json';

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
 * Limpiar colección de eventos
 */
async function clearEventosCollection() {
    try {
        console.log('🗑️ Limpiando colección de eventos...');
        const collectionRef = collection(db, EVENTOS_COLLECTION);
        const querySnapshot = await getDocs(collectionRef);

        const batch = writeBatch(db);
        querySnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log('✅ Colección de eventos limpiada');
        return true;
    } catch (error) {
        console.error('❌ Error limpiando colección:', error);
        throw error;
    }
}

/**
 * Importar eventos a Firestore
 */
async function importEventosToFirestore(eventosData) {
    try {
        if (!eventosData || !eventosData.eventos) {
            throw new Error('Estructura de datos inválida');
        }

        const eventos = eventosData.eventos;
        console.log(`📥 Importando ${eventos.length} eventos...`);

        const batch = writeBatch(db);
        let count = 0;

        eventos.forEach((evento) => {
            if (!evento.id) {
                console.warn('⚠️ Evento sin ID saltado:', evento);
                return;
            }

            const docRef = doc(db, EVENTOS_COLLECTION, evento.id);
            batch.set(docRef, {
                ...evento,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            count++;
        });

        await batch.commit();
        console.log(`✅ ${count} eventos importados exitosamente`);
        return count;
    } catch (error) {
        console.error('❌ Error importando eventos:', error);
        throw error;
    }
}

/**
 * Verificar estado de la colección
 */
async function checkEventosStatus() {
    try {
        const collectionRef = collection(db, EVENTOS_COLLECTION);
        const querySnapshot = await getDocs(collectionRef);

        console.log('\n📊 Estado de la colección "eventos":');
        console.log(`📌 Total de eventos: ${querySnapshot.size}`);

        if (querySnapshot.size > 0) {
            console.log('\n📋 Eventos importados:');
            querySnapshot.docs.forEach((doc) => {
                const data = doc.data();
                console.log(`  • ${data.title} (${data.sport}) - ${data.location}`);
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
export async function initializeFirebaseEventos(clearExisting = false) {
    try {
        console.log('\n🚀 Iniciando importación de eventos a Firebase...');

        // Limpiar si se requiere
        if (clearExisting) {
            await clearEventosCollection();
        }

        // Cargar datos
        const eventosData = await loadJsonFile(EVENTOS_FILE);
        if (!eventosData) {
            throw new Error('No se pudo cargar el archivo de eventos');
        }

        // Importar
        const imported = await importEventosToFirestore(eventosData);

        // Verificar
        await checkEventosStatus();

        console.log('\n✅ Inicialización de eventos completada');
        return imported;

    } catch (error) {
        console.error('\n❌ Error en la inicialización:', error);
        throw error;
    }
}

/**
 * Exportar funciones para uso en consola
 */
export { checkEventosStatus, clearEventosCollection };
