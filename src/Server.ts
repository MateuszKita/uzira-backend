import express from 'express';
import path from 'path';
import BaseRouter from './routes';
import {connectToMongo} from './db/mongoose';
import cors from 'cors';
import {NO_CONTENT} from 'http-status-codes';

const app = express();

app.options('*', cors());

app.use(cors({
    origin: '*',
    methods: 'OPTIONS, GET, HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue: true,
    credentials: true,
    optionsSuccessStatus: NO_CONTENT,
    allowedHeaders: 'X-Requested-With,content-type'
}));

app.use('', BaseRouter);

connectToMongo().then(() => {
    console.log('SUCCESS: Connected to MongoDB');
});

const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

export default app;
