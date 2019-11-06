import express from 'express';
import BaseRouter from './routes';
import {connectToMongo} from './db/mongoose';
import cors from 'cors';
import cookieParser = require('cookie-parser');
import bodyParser from 'body-parser';
import http from 'http';

const app = express();

const allowedOrigins = ['https://uzira.netlify.com', 'http://localhost:4200'];

app.use(cors({
    origin: (origin, callback) => {
        console.log(111111111111111111, origin, allowedOrigins.findIndex((allowedOrigin) => origin === allowedOrigin));
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.findIndex((allowedOrigin) => origin === allowedOrigin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar', 'Access-Control-Allow-Origin'],
    credentials: true,
    methods: 'GET, PUT, POST, DELETE, PATCH, OPTIONS, HEAD',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('', BaseRouter);

connectToMongo().then(() => {
    console.log('SUCCESS: Connected to MongoDB');
});

const fiveMinutesMilliseconds = 300000;

setInterval(() => {
    const hour = new Date().getHours();
    const appUrl = 'https://uzira-backend-nodejs.herokuapp.com/';
    if (hour > 6 && hour < 23) {
        http.get(appUrl);
    }
}, fiveMinutesMilliseconds);

export default app;
