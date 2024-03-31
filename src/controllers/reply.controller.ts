import { Request, Response, NextFunction } from "express";

import ReplyService from "../services/reply.service";
import BaseController from "./base.controller";
import StatusCodes from "../enum/StatusCode";
import { CreateReply, GetReply, GetAllTopicReplies } from "../schemas/reply.schema";
import { ISession } from "../models/session.model";


export default class ReplyController extends BaseController {
    public constructor(
        protected replyService: ReplyService,
    ){
        super();
    }


    public async createReply(req: Request<{}, {}, CreateReply["body"]>, res: Response, next: NextFunction) {
        try{
            let r = req as Request & {session: ISession};
            const reply = await this.replyService.create({...r.body, creator: r.session.userId});
            return this.sendSuccessWithData(res, "Reply created", StatusCodes.CREATED, reply);
        }catch(e){
            next(e)
        }
    }


    public async getReply(req: Request<GetReply["params"]>, res: Response, next: NextFunction){
        try{
            const reply = await this.replyService.findOne({_id: req.params.id});
            return this.sendSuccessWithData(res, "Reply fetched", 200, reply);
        }catch(e){
            next(e);
        }
    }


    public async deleteReply(req: Request<GetReply["params"]>, res: Response, next: NextFunction) {
        try{
            await this.replyService.delete({_id: req.params.id});
            return this.sendSuccess(res, "Reply deleted successfully", 202);
        }catch(e){
            next(e);
        }
    }

    public async getAllTopicReplies(req: Request<GetAllTopicReplies["params"]>, res: Response, next: NextFunction){
        try{
            const topicId = req.params.topicId;
            const replies = await this.replyService.findAllTopicReplies({topicId});
            return this.sendSuccessWithData(res, "Replies for topic " + topicId + " fetched successfully", StatusCodes.OK, replies);
        }catch(e){next(e)}
    }
}