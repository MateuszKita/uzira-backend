import {Document} from 'mongoose';
import {ITask} from './tasks.model';
import {ISprint} from './sprints.model';
import {ISimpleUser} from './users.model';

export interface IProject {
    _id: string | any;
    backlog: {
        tasks: ITask[];
    };
    name: string;
    sprints: ISprint[];
    users: ISimpleUser[];
}

export interface IProjectBacklog {
    tasks: ITask[];
}

export interface IProjectDTO extends IProject, Document {
}
