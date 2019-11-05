import {Schema, Model, model} from 'mongoose';
import {IProjectDTO} from '../models/projects.model';
import {GenericTaskSchema, TaskSchema} from './tasks.mongoose';

export const projectSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sprints: [{
        _id: {
            type: Number,
            required: true
        },
        active: {
            type: Boolean,
            required: true,
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        tasks: {
            type: [TaskSchema],
            default: []
        }
    }],
    backlog: {
        tasks: {
            type: [GenericTaskSchema],
            default: []
        }
    },
    users: [{
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        _id: {
            type: String,
            required: true,
        }
    }]
});

export const Project: Model<IProjectDTO> = model('Project', projectSchema);
