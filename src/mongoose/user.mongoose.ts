import {hash} from 'bcryptjs';
import isEmail = require('validator/lib/isEmail');
import {Document, Schema, Model, model} from 'mongoose';
import {IUser} from '../models';

export interface IUserDTO extends IUser, Document {
    fullName(): string;
}

const rootThis = this;

export const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
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
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value: string) {
            const passwordIncludesIncorrectWords = value.toLowerCase().includes('password');
            if (passwordIncludesIncorrectWords) {
                throw new Error('Password cannot contain "password"');
            }
            return !passwordIncludesIncorrectWords;
        }
    }
});
UserSchema.pre('save', async (next) => {
    const user = rootThis as any;
    if (user.isModified('password')) {
        user.password = await hash(user.password, 8);
    }
    next();
});
UserSchema.methods.fullName = function(): string {
    return (`${this.firstName.trim()} ${this.lastName.trim()}`);
};

export const User: Model<IUserDTO> = model<IUserDTO>('User', UserSchema);
