// Firebase Admin SDK setup
const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin SDK
const serviceAccount = require('./path/to/your-service-account-key.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Function to migrate JSON data to Firestore
async function migrateData() {
    try {
        const filePath = './data/all-news.json'; // Path to your JSON file
        const rawData = fs.readFileSync(filePath);
        const jsonData = JSON.parse(rawData);

        if (!jsonData.news || !Array.isArray(jsonData.news)) {
            console.error('Invalid JSON structure: Expected an array under "news"');
            return;
        }

        const batch = db.batch();
        const collectionRef = db.collection('all-news');

        jsonData.news.forEach((newsItem) => {
            const docRef = collectionRef.doc(newsItem.id.toString()); // Use ID as document ID
            batch.set(docRef, newsItem);
        });

        await batch.commit();
        console.log('Data migration to Firestore completed successfully.');
    } catch (error) {
        console.error('Error migrating data to Firestore:', error);
    }
}

// Run the migration
migrateData();