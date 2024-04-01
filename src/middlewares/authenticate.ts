import { Request, Response, NextFunction } from "express";
import {JwtPayload} from "jsonwebtoken";

import AdvancedError from "../helpers/advanced-error";
import JWT from "../utils/jwt.util";


export default function (type: 'admin' | 'user'){
    console.log({type});
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            let authHeader = req.get("Authorization");
            if(!authHeader) throw new AdvancedError('User not authorized', 401);
            let [bearerString, token] = authHeader.split(" ");
            if(bearerString !== 'Bearer' || !bearerString) throw new AdvancedError('Invalid auth header format', 401);
            //first check if this is valid
            const payload = await (new JWT()).verify(token);
            //now find a user with this token
            const session = (payload as JwtPayload).session;
            if(session.expired) throw new AdvancedError("Session expired, Login", 401);
            (req as any).session = session;
            next();
        }catch(e: any){
            next(e)
        }
    }
}