import {ObjectId} from 'mongodb';
import {Document} from 'mongoose';

export interface IUser {
    _id: string | any;
    name: string;
    email: string;
    password: string;
    tokens: IUserToken[];
}

export interface ISimpleUser {
    email: string;
    name: string;
    _id: string;
}

export interface IUserDTO extends IUser, Document {
    generateAuthToken(): () => string;
}

export interface IAuthorizedRequest extends Request {
    token: string;
    user: IUserDTO;
}

export interface IUserToken {
    token: string;
    _id: string;
}
