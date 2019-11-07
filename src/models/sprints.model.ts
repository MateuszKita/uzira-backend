import {ITask} from './tasks.model';

export interface ISprint {
    _id: ObjectId;
    index: number;
    active: boolean;
    startDate: string;
    endDate: string;
    tasks: ITask[];
}
