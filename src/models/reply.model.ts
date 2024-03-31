import {Schema, model, Types, Document} from "mongoose";


export interface IReply extends Document {
    _id: Types.ObjectId; 
    creator: Types.ObjectId;
    topicId: Types.ObjectId;
    message: String;
    createdAt: Date;
    updatedAt: Date;
}


const replySchema = new Schema<IReply>({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    topicId: {
        type: Schema.Types.ObjectId,
        ref: "Topic",
        required: true
    },
    message: {
        type: String,
        required: true
    },
}, {timestamps: true});



const Reply = model<IReply>("Reply", replySchema);


export default Reply;