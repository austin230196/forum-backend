import { Model, Schema } from "mongoose";

interface ServiceInterface {
    create<T>(data: any): Promise<Model<T>>;

    delete(id: Schema.Types.ObjectId): any;

    findOne<T>(id: Schema.Types.ObjectId): Model<T>

    findAll<T>(): Model<T>[]
}


export default ServiceInterface