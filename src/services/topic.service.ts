import { SchemaDefinition, HydratedDocument, FilterQuery, Types } from "mongoose";

import Topic, { ITopic } from "../models/topic.model";
import { IReply } from "../models/reply.model";
import { IFollow } from "../models/follow.model";
import { IUser } from "../models/user.model";


export default class TopicService{
    public constructor(){
    }
    public async create(data: SchemaDefinition<ITopic>): Promise<HydratedDocument<ITopic>>{
        const topic = new Topic({
            message: data.message,
            title: data.title,
            category: data.category,
            creator: data.creator,
        })
        await topic.save();

        return topic.toJSON();
    }

    public async delete(query: FilterQuery<ITopic>){
        await Topic.deleteOne(query);
    }

    public async findOne(query: FilterQuery<ITopic>): Promise<HydratedDocument<ITopic> | null>{
        const topic = await Topic.findOne(query).populate<{replies: IReply[]}>({
            path: 'replies',
            populate: {
                path: 'creator',
                model: 'User',
            },
        }).populate<{followers: IFollow[]}>({
            path: 'followers',
            populate: {
                path: 'userId',
                model: 'User'
            }
        }).populate({
            path: 'creator',
            populate: {
                path: 'creator',
                model: 'User'
            }
        });
        return topic;
    }

    public async findAll(query: FilterQuery<ITopic>){
        const topics = await Topic.find(query).populate<{replies: Types.ObjectId[]}>({
            path: 'replies',
            populate: {
                path: 'creator',
                model: 'User',
            },
        })
        .populate<{followers: Types.ObjectId[]}>({
            path: 'followers',
            populate: {
                path: 'userId',
                model: 'User'
            }
        })
        .populate({
            path: 'creator',
            model: 'User'
        });;
        return topics;
    }
}