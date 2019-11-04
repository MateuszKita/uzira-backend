import express from 'express';
import BaseRouter from './routes';
import {connectToMongo} from './db/mongoose';
import cors from 'cors';
import cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

app.use('', BaseRouter);

connectToMongo().then(() => {
    console.log('SUCCESS: Connected to MongoDB');
});

export default app;
