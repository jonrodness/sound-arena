require('dotenv').config();

const express= require('express');
const db = require('./db/mysql');
const routes = require('./routes/api');
const jobRoutes = require('./routes/job');
const staticRoutes = require('./routes/static');
const { 
    verifyAuthToken,
    addUserToReq, 
    verifyAdmin
} = require('./auth');
const admin = require('firebase-admin');
const { 
    genericErrorHandler,
    validationErrorHandler
} = require('./utils/errorResponse');

const app = express();

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

db.connect();

app.use(express.json());

app.use('/award', staticRoutes);

app.use('/api/auth', verifyAuthToken, addUserToReq);
app.use('/api', routes);

app.use('/job', verifyAdmin, jobRoutes);

app.use(validationErrorHandler);
app.use(genericErrorHandler);

module.exports = app;