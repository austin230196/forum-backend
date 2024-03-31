import {Schema, model, Types, Document} from "mongoose";


export interface ISession extends Document{
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    userAgent: String;
    device: Object;
    expired: Boolean;
    createdAt: Date;
    updatedAt: Date;
}


const sessionSchema = new Schema<ISession>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    device: Object,
    userAgent: String,
    expired: {
        required: true,
        type: Boolean,
        default: false
    },
}, {timestamps: true});



const Session = model<ISession>("Session", sessionSchema);


export default Session;