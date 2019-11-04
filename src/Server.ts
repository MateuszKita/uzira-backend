import express from 'express';
import path from 'path';
import BaseRouter from './routes';
import {connectToMongo} from './db/mongoose';
import cors from 'cors';

const app = express();

app.options('*', cors());

app.use(cors());

app.use('', BaseRouter);

connectToMongo().then(() => {
    console.log('SUCCESS: Connected to MongoDB');
});

const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));
