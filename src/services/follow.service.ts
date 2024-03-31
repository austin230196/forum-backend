import { FilterQuery, HydratedDocument, SchemaDefinition } from "mongoose";

import Follow, { IFollow } from "../models/follow.model";


export default class FollowService {
    public constructor(){}

    public async followTopic(data: SchemaDefinition<IFollow>): Promise<HydratedDocument<IFollow>>{
        const follow = new Follow({
            userId: data.userId,
            topicId: data.topicId
        });
        await follow.save();

        return follow;
    }


    public async unfollowTopic(query: FilterQuery<IFollow>) {
        await Follow.deleteOne(query);
    }

    public async findAllFollowing(query: FilterQuery<IFollow>) {
        const following = await Follow.find(query);
        return following;
    }

    public async find(query: FilterQuery<IFollow>) {
        const following = await Follow.findOne(query);
        return following;
    }
}
