import mongoose from "mongoose";
import generalConfig from "../config/general";


export default async function(){
    await mongoose.connect(generalConfig.DATABASE_URL)
}