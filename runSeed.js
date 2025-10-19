const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { seedDatabase } = require('./seed');

// Load environment variables
dotenv.config();

async function runSeed() {
    try {
        console.log('Connecting to MongoDB...');
        
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cci-startup-project';
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

if (require.main === module) {
    runSeed();
}
