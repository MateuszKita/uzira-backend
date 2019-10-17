import {ObjectId} from 'mongodb';

export interface IUser {
    _id: ObjectId | any;
    name: string;
    email: string;
    password: string;
}
