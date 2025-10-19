import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedDatabase } from './seed.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

async function runSeed() {
    try {
        console.log('Connecting to MongoDB...');
        
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI not found in environment variables');
        }
        
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('Connected to MongoDB');
        
        await seedDatabase();
        
        console.log('Seed completed successfully!');
        
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Check if this module is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
    runSeed();
}
