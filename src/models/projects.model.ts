import {ObjectId} from 'mongodb';
import {Document} from 'mongoose';

export interface IProject {
    _id: ObjectId | any;
}

export interface IProjectDTO extends IProject, Document {
}
