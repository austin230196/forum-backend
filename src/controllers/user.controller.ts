import { Request, Response, NextFunction } from "express";
import {type DetectResult} from "node-device-detector";

import BaseController from "./base.controller";
import UserService from "../services/user.service";
import { LoginUser, CreateUser, LoginCallback, ForgotPassword, UpdatePassword } from "../schemas/user.schema";
import AdvancedError from "../helpers/advanced-error";
import JWT from "../utils/jwt.util";
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

    public async forgotPassword(req: Request<{}, {}, ForgotPassword["body"]> & {device: DetectResult}, res: Response, next: NextFunction) {
        try{
            let user = await this.userService.find({email: req.body.email});
            if(!user) throw new AdvancedError("User account not found", 404);
            if(user.accountType !== 'manual') throw new AdvancedError("Invalid account type for action", 422);
            //first get the token
            //create a session for the token
            let existingSession = this.sessionService.findOne({id: user!._id, expired: false})
            let session;
            if(!existingSession){
                //create one
                session = await this.sessionService.create({
                    userId: user._id,
                    userAgent: req.get('User-Agent'),
                    device: req.device
                })
            }
            let token = await this.jwt.sign({session: session ? session : existingSession}, {
                expiresIn: generalConfig.FORGOT_PASSWORD_TOKEN_TTL
            })
            
            //then create a link
            let params = new URLSearchParams();
            params.append("token", token);
            const link = `${generalConfig.WEB_APP_URL}?${params}`;

            //send email to this user
            console.log({link});

            return this.sendSuccessWithData(res, `An email has been sent this address (${user.email})`, 200, null);
        }catch(e: any){next(e)}
    }


    public async updatePassword(req: Request<{}, {}, UpdatePassword["body"]>, res: Response, next: NextFunction){
        try{
            //first get session by validating
            const {token, newPassword} = req.body;
            let payload = await this.jwt.verify(token);
            if(typeof(payload) === 'string') throw new AdvancedError(payload, 401);
            let session = payload.session;
            if(session.expired) throw new AdvancedError("Session expired", 401);
            let user = await this.userService.find({id: session.user_id, accountType: 'manual'});
            if(!user) throw new AdvancedError("Invalid user", 400);

            //user found
            //update their password
            await this.userService.updatePassword({_id: user.id}, newPassword);
            //revoke all user sessions
            await this.sessionService.invalidate({user_id: user._id});

            return this.sendSuccess(res, "Password updated", 201);
        }catch(e: any){next(e)}
    }


    public async loginCallBack(req: Request<LoginCallback["params"]>, res: Response, next: NextFunction){
        try{
            const provider = (req.params.provider).toLocaleLowerCase();
            if(!provider) throw new AdvancedError("Provider not found", 422);
            let isValid = generalConfig.VALID_PROVIDERS.includes(provider);
            if(!isValid) throw new AdvancedError("Invalid provider", 422);
            
        }catch(e: any){
            console.log("loginCallback#user has errored")
            next(e);
        }
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