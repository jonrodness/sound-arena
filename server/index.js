const app = require('./app');
const express= require('express');
const path = require('path');
const port = process.env.PORT || 8080;

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'development') {
    app.use(express.static(path.join(__dirname, '../client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', (_, res) => {
        const indexPath = path.join(__dirname, '../client/build', 'index.html');
        res.sendFile(indexPath);
    });
}

app.listen(port, () => console.log(`Listening on port ${port}`));