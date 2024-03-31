import { Request, Response, NextFunction } from "express";
import {type DetectResult} from "node-device-detector";

import BaseController from "./base.controller";
import UserService from "../services/user.service";
import { LoginUser, CreateUser } from "../schemas/user.schema";
import AdvancedError from "../helpers/advanced-error";
import JWT from "../utils/jwt";
import SessionService from "../services/session.service";
import generalConfig from "../config/general";
import { ISession } from "../models/session.model";


export default class UserController extends BaseController {
    public constructor(
        protected readonly userService: UserService,
        protected readonly sessionService: SessionService,
        protected readonly jwt: JWT
    ){
        super();
    }

    public async createUser(req: Request<{}, {}, CreateUser["body"]>, res: Response, next: NextFunction) {
        try{
            await this.userService.create(req.body);
            return this.sendSuccessWithData(res, 'User created successfully', 201, null);
        }catch(e: any){next(e)}
    }

    
    public async login(req: Request<{}, {}, LoginUser["body"]> & {device: DetectResult}, res: Response, next: NextFunction){
        try{
            //first we find the user
            let user = await this.userService.find({
                email: req.body.email
            })
            if(!user) throw new AdvancedError('User not found', 404);
            let matches = await user.comparePassword(req.body.password);
            if(!matches) throw new AdvancedError('Incorrect password', 422);
            //find session
            let session = await this.sessionService.findOne({userId: user._id, expired: false});
            if(!session){
                //create session
                session = await this.sessionService.create({
                    userId: user._id,
                    userAgent: req.get('User-Agent'),
                    device: req.device
                })
            }else {
                //a session was found compare the old device to the new one
                
                //send an email if the devices are different
            }
            
            let accessToken = await this.jwt.sign({session: session}, {
                expiresIn: generalConfig.ACCESS_TOKEN_TTL
            })
            let refreshToken = await this.jwt.sign({session: session}, {
                expiresIn: generalConfig.REFRESH_TOKEN_TTL
            })
            user = user.toJSON();
            let {password, __v, ...userdata} = user;

            return this.sendSuccessWithData(res, 'User logged in successfully', 201, {
                user: userdata,
                accessToken,
                refreshToken
            });
        }catch(e: any){next(e)}
    }


    public async refreshToken(req: Request, res: Response, next: NextFunction){
        try{
            //first get the refresh token
            let refreshToken = req.get("X-Refresh");
            if(!refreshToken) throw new AdvancedError("Refresh token must be provided", 401);
            //refresh token provided
            let payload = await this.jwt.verify(refreshToken);
            if(typeof(payload) === 'string') throw new AdvancedError(payload, 401);
            let accessToken = await this.jwt.sign({session: payload.session}, {
                expiresIn: generalConfig.ACCESS_TOKEN_TTL
            })
            console.log({accessToken});
            return this.sendSuccessWithData(res, 'Access token refreshed', 200, {token: accessToken});
        }catch(e: any){next(e)}
    }


    public async getUserSessions(req: Request & {session: ISession}, res: Response, next: NextFunction){
        try{
            const sessions = await this.sessionService.findAll({userId: req.session.userId});
            return this.sendSuccessWithData(res, 'Sessions fetched', 200, sessions);
        }catch(e: any){next(e)}
    }
}