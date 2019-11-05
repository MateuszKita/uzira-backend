import {Schema, Model, model} from 'mongoose';
import {IProjectDTO} from '../models/projects.model';
import {GenericTaskSchema, TaskSchema} from './tasks.mongoose';
import isEmail = require('validator/lib/isEmail');

export const projectSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sprints: [{
        innerId: {
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
    users: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: [{
            name: {
                type: String,
                required: true,
                trim: true
            },
            email: {
                type: String,
                unique: true,
                required: true,
                trim: true,
                lowercase: true,
                validate(value: string) {
                    const emailIsValid = isEmail(value);
                    if (!emailIsValid) {
                        throw new Error('Email is invalid');
                    }
                    return emailIsValid;
                }
            },
            initialId: {
                type: String,
                unique: true
            }
        }],
        backlog: {
            tasks: {
                type: [GenericTaskSchema],
                default: []
            }
        }
    }]
});

// projectSchema.virtual('tasks', {
//     ref: 'Task',
//     localField: '_id',
//     foreignField: 'owner'
// });

projectSchema.pre('remove', async function(next) {
    const project = this;
    // await Task.deleteMany({owner: user._id});
    next();
});

export const Project: Model<IProjectDTO> = model('Project', projectSchema);
