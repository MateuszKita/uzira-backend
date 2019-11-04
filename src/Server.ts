import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import BaseRouter from './routes';
import {connectToMongo} from './db/mongoose';
import cors from 'cors';
import {OK} from 'http-status-codes';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('', BaseRouter);

app.use(cors({
    origin: 'https://uzira.netlify.com/',
    methods: 'OPTIONS, GET, HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
    credentials: true,
    optionsSuccessStatus: OK,
    allowedHeaders: 'X-Requested-With,content-type'
}));

connectToMongo().then(() => {
    console.log('SUCCESS: Connected to MongoDB');
});

const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

export default app;
