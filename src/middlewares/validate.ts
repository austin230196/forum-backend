import { Request, Response, NextFunction } from "express";
import {AnyZodObject} from "zod";



export default function(schema: AnyZodObject){
    return (req: Request, res: Response, next: NextFunction) => {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    }
}