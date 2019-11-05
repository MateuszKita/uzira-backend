import {ObjectId} from 'mongodb';
import {Document} from 'mongoose';
import {ITask} from './tasks.model';
import {ISprint} from './sprints.model';
import {ISimpleUser} from './users.model';

export interface IProject {
    _id: ObjectId | any;
    backlog: {
        tasks: ITask[];
    };
    name: string;
    sprints: ISprint[];
    users: ISimpleUser[];
}

export interface ISimpleProject {
    _id: ObjectId | any;
    name: string;
}

export interface IProjectDTO extends IProject, Document {
}
