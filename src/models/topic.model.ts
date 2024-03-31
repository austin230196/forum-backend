import {Schema, model, Types, Document} from "mongoose";

import Category from "../types/Category";
import { IReply } from "./reply.model";
import { IFollow } from "./follow.model";


export interface ITopic extends Document{
    _id: Types.ObjectId;
    creator: Types.ObjectId;
    title: String;
    category: Category;
    message: String;
    replies: Array<IReply>;
    followers: Array<IFollow>;
    createdAt: Date;
    updatedAt: Date;
}

const topicSchema = new Schema<ITopic>({
    title: {
        type: String,
        unique: true,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        unique: true,
        required: true
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Reply'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'Follow'
    }]
}, {timestamps: true});


// topicSchema.post(/^order$/, async function(next, order: 'latest' | 'oldest'){
//     return this.query.sort({createdAt: order === 'latest' ? 1 : -1});
// })



const Topic = model<ITopic>("Topic", topicSchema);


export default Topic;