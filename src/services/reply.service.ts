import {HydratedDocument, UpdateQuery, SchemaDefinition, FilterQuery } from "mongoose";

import Reply, { IReply } from "../models/reply.model";


class ReplyService{
    public constructor(){
    }
    public async create(data: SchemaDefinition<IReply>): Promise<HydratedDocument<IReply>>{
        const reply = new Reply({
            message: data.message,
            topicId: data.topicId,
            creator: data.creator,
        })
        await reply.save();
        return reply.toJSON();
    }

    public async delete(query: FilterQuery<IReply>){
        await Reply.deleteOne(query);
    }

    public async findOne(query: FilterQuery<IReply>): Promise<HydratedDocument<IReply> | null>{
        const reply = await Reply.findById(query);
        return reply;
    }

    public async findAllTopicReplies(query: FilterQuery<IReply>){
        const replies = await Reply.find(query);
        return replies;
    }

    public async findAll(query: FilterQuery<IReply>){
        const replies = await Reply.find(query);
        return replies;
    }

    public async update(query: FilterQuery<IReply>, data: UpdateQuery<IReply>): Promise<HydratedDocument<IReply> | null> {
        const updatedReply = await Reply.findOneAndUpdate(query, data);
        return updatedReply;
    }
}



export default ReplyService;