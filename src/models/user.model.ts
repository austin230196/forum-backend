import {Schema, model, Types, Document} from "mongoose";
import bcrypt from "bcrypt";

import generalConfig from "../config/general.config";


export interface IUser extends Document{
    _id: Types.ObjectId;
    name: String;
    email: String;
    avatar?: URL;
    password: String;
    accountType: 'google' | 'manual' | 'twitter' | 'apple';
    createdAt: Date;
    updatedAt: Date;   
    comparePassword: (password: String) => Promise<boolean>;
}


const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        default: null,
    },
    password: String,
    accountType: {
        type: String,
        default: 'manual'
    }
}, {timestamps: true});


userSchema.pre("save", async function(next){
    if(this.isModified('password')){
        let salt = await bcrypt.genSaltSync(generalConfig.SALT);
        this.password = await bcrypt.hashSync(this.password as string, salt);
    }
    next();
});

userSchema.methods.comparePassword = async function(password: String): Promise<boolean> {
    const matches = await bcrypt.compare(password as string, this.password);
    return matches;
}



const User = model<IUser>("User", userSchema);


export default User;