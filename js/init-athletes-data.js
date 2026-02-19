// Init Athletes Data - Import from JSON to Firestore
import {
    db
} from './firebase-config.js';
import { collection, getDocs, deleteDoc, query, where, writeBatch, doc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const ATHLETES_COLLECTION = 'athletes';

// Fetch athletes data from JSON
async function fetchAthletesJSON() {
    try {
        const response = await fetch('data/athletes.json');
        if (!response.ok) throw new Error('Error al cargar athletes.json');
        return await response.json();
    } catch (error) {
        console.error('Error fetching athletes JSON:', error);
        throw error;
    }
}

// Initialize Athletes Data
export async function initializeAthletesData() {
    try {
        const athletes = await fetchAthletesJSON();

        if (!Array.isArray(athletes) || athletes.length === 0) {
            throw new Error('No hay datos de atletas en el JSON');
        }

        let importedCount = 0;

        for (const athlete of athletes) {
            try {
                // Check if already exists
                const q = query(collection(db, ATHLETES_COLLECTION), where('slug', '==', athlete.slug));
                const existingDocs = await getDocs(q);

                if (existingDocs.empty) {
                    const athleteData = {
                        slug: athlete.slug,
                        nombre: athlete.nombre,
                        titulo: athlete.titulo,
                        localidad: athlete.localidad,
                        edad: athlete.edad,
                        altura: athlete.altura,
                        posicion: athlete.posicion || athlete.especialidad || '',
                        dorsal: athlete.dorsal || athlete.dorsalWJF || '',
                        imagen: athlete.imagen,
                        badge: athlete.badge,
                        badgeColor: athlete.badgeColor,
                        featured: athlete.featured || false,
                        category: athlete.category,
                        description: athlete.description,
                        bio: athlete.bio,
                        stats: athlete.stats || [],
                        logros: athlete.logros || [],
                        fecha_registro: new Date(),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };

                    // Use slug as document ID for consistency
                    const docRef = doc(db, ATHLETES_COLLECTION, athlete.slug);
                    const batch = writeBatch(db);
                    batch.set(docRef, athleteData);
                    await batch.commit();
                    importedCount++;
                    console.log(`✓ Importado atleta: ${athlete.nombre}`);
                } else {
                    console.log(`⊘ Atleta ya existe: ${athlete.nombre}`);
                }
            } catch (error) {
                console.error(`Error importando atleta ${athlete.nombre}:`, error);
            }
        }

        return `${importedCount} atletas importados exitosamente de ${athletes.length} disponibles.`;

    } catch (error) {
        console.error('Error initializing athletes:', error);
        throw error;
    }
}

// Check Athletes Status
export async function checkAthletesStatus() {
    try {
        const snapshot = await getDocs(collection(db, ATHLETES_COLLECTION));
        const count = snapshot.size;

        if (count === 0) {
            return 'No hay atletas en Firestore. Haz clic en "Importar Atletas".';
        }

        // Count by category
        const categories = {};
        snapshot.forEach(doc => {
            const category = doc.data().category || 'Desconocida';
            categories[category] = (categories[category] || 0) + 1;
        });

        const categoryBreakdown = Object.entries(categories)
            .map(([category, count]) => `${category}: ${count}`)
            .join(', ');

        return `Total: ${count} atletas en Firestore. Por categoría: ${categoryBreakdown}`;

    } catch (error) {
        console.error('Error checking status:', error);
        throw error;
    }
}

// Clear and Import Athletes
export async function clearAndImportAthletes() {
    try {
        // Get all documents
        const snapshot = await getDocs(collection(db, ATHLETES_COLLECTION));

        // Delete all documents using batch
        if (snapshot.docs.length > 0) {
            const batch = writeBatch(db);
            snapshot.docs.forEach((document) => {
                batch.delete(document.ref);
            });
            await batch.commit();
            console.log(`🗑️ Eliminados ${snapshot.docs.length} atletas`);
        }

        // Now import fresh
        const result = await initializeAthletesData();
        return `Eliminados ${snapshot.docs.length} atletas anteriores. ${result}`;

    } catch (error) {
        console.error('Error clearing and importing:', error);
        throw error;
    }
}
