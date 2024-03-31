import {Schema, model, Types, Document} from "mongoose";


export interface IFollow extends Document{
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    topicId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}


const followSchema = new Schema<IFollow>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    topicId: {
        type: Schema.Types.ObjectId,
        ref: 'Topic'
    }
}, {timestamps: true});



const Follow = model<IFollow>("Follow", followSchema);


export default Follow;