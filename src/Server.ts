import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import BaseRouter from './routes';
import mongodb from 'mongodb';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', BaseRouter);

const MongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGODB_URI;

if (mongoUrl) {
    MongoClient.connect(mongoUrl, (err, db) => {
        if (err) {
            console.error('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connected to MongoDB');
            db.close();
        }
    });
} else {
    console.error('Could not read MongoDB URL');
}

const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

export default app;
