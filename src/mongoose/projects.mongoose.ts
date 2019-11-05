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
        innerId: {
            type: String,
            required: true,
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
