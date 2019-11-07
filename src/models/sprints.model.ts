import {ITask} from './tasks.model';

export interface ISprint {
    _id: string;
    index: number;
    active: boolean;
    startDate: string;
    endDate: string;
    tasks: ITask[];
}
