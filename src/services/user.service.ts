import { FilterQuery, HydratedDocument, SchemaDefinition } from "mongoose";
import User, { IUser } from "../models/user.model";




export default class UserService {
    public constructor(){}

    public async create(data: SchemaDefinition<IUser>): Promise<HydratedDocument<Omit<IUser, 'password'>>> {
        const user = new User({
            name: data.name,
            email: data.email,
            password: data.password
        })
        await user.save();

        return user;
    }


    public async createSocialAccount(provider: 'google'|'github', email:string, name: string, avatarURL: string|null): Promise<HydratedDocument<IUser>> {
        const user = new User({
            name,
            email,
            accountType: provider,
            avatar: avatarURL
        })
        await user.save();

        return user;
    }


    public async find(query: FilterQuery<IUser>) {
        const user = await User.findOne(query);
        return user;
    }


    public async findAll(query: FilterQuery<IUser>){
        const users = await User.find(query);
        return users;
    }


    public async delete(query: FilterQuery<IUser>){
        await User.deleteOne(query);
    }


    public async updatePassword(query: FilterQuery<IUser>, password: String): Promise<HydratedDocument<Omit<IUser, 'password'>> | null>{
        const user = await User.findOneAndUpdate(query, {
            password
        });

        return user;
    }
    
    public async verifyUser(query: FilterQuery<IUser>){
        await User.findOneAndUpdate(query, {isVerified: true});
        return true;
    }


    public async changeAvatar(query: FilterQuery<IUser>, avatar: URL){
        await User.findOneAndUpdate(query, {avatar});
        return true;
    }

}