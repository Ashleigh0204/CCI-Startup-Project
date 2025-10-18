    const express = require('express');
    const index = require('./endpoints/index');

    //create app
    const app = express();

    //set up host and port
    const hostname = '127.0.0.1';
    const port = 8080;

    //set up routes
    app.use('/', index);

    //start app
    app.listen(port, hostname, ()=>{
            console.log('Server is running on port', port);
        });