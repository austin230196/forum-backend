import mongoose from "mongoose";
import generalConfig from "../config/general.config";


export default async function(){
    await mongoose.connect(generalConfig.DATABASE_URL)
}