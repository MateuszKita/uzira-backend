import {connect} from 'mongoose';

export const connectToMongo = async () => {
    const mongoUrl = process.env.MONGODB_URI;

    if (mongoUrl) {
        try {
            await connect(mongoUrl, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false
            });
        } catch (e) {
            console.log('Could not connect to MongoDB', e);
        }
    } else {
        console.error('Could not read MongoDB URL');
    }
};
