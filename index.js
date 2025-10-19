import { frontendPath } from './config.js';
import express from 'express';
import cors from 'cors';
import index from './endpoints/index.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {seedDatabase} from './seed.js';

dotenv.config();

//create app
const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8080', 'http://127.0.0.1:8080'], 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const mongoUri = process.env.MONGO_URI;
console.log(mongoUri);
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    console.log('Connected to MongoDB successfully');
    
    // Seed database 
    try {
        await seedDatabase();
    } catch (error) {
        console.error('Failed to seed database:', error);
        process.exit(1);
    }
})
.catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.error('Full error:', err);
});

//set up host and port
const hostname = '127.0.0.1';
const port = 8080;

//set up frontend
app.use(express.static(frontendPath));

//set up routes
app.use('/', index);

//start app
app.listen(port, hostname, ()=>{
        console.log('Server is running on port', port);
    });