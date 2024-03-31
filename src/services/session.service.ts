import { FilterQuery, HydratedDocument, SchemaDefinition, Types } from "mongoose";

import Session, { ISession } from "../models/session.model";




export default class SessionService {
    public constructor(){}

    public async create(data: SchemaDefinition<ISession>): Promise<HydratedDocument<ISession>> {
        const session = new Session({
            userId: data.userId,
            userAgent: data.userAgent,
            device: data.device,
        });
        await session.save();

        return session.toJSON();
    }


    public async invalidate(query: FilterQuery<ISession>){
        await Session.findOneAndUpdate(query, {expired: true});
        return true;
    }


    public async findAll(query: FilterQuery<ISession>) {
        const sessions = await Session.find(query).populate<{userId: Types.ObjectId}>({
            path: 'userId',
            model: 'User'
        });
        return sessions;
    }


    public async findOne(query: FilterQuery<ISession>){
        const session = await Session.findOne(query).populate<{userId: Types.ObjectId}>('userId');
        return session;
    }


    public async hasExpired(query: FilterQuery<ISession>): Promise<Boolean>{
        const session = await Session.findOne(query);
        if(!session) return true;
        else return session.expired;
    }

    public async delete(query: FilterQuery<ISession>){
        await Session.deleteOne(query);
    }
}