    const express = require('express');
    const index = require('./endpoints/index');
    const dotenv = require('dotenv');
    dotenv.config();
    const mongoose = require('mongoose');

    //create app
    const app = express();


    const mongoUri = process.env.MONGO_URI;
    console.log(mongoUri);
    mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        console.error('Full error:', err);
    });


    //set up host and port
    const hostname = '127.0.0.1';
    const port = 8080;

    //set up routes
    app.use('/', index);

    //start app
    app.listen(port, hostname, ()=>{
            console.log('Server is running on port', port);
        });