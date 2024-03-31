import { NextFunction, Request, Response } from "express";

import BaseController from "./base.controller";
import TopicService from "../services/topic.service";
import StatusCodes from "../enum/StatusCode";
import { ISession } from "../models/session.model";
import { GetTopic, CreateTopic, GetAllTopics } from "../schemas/topic.schema";
import FollowService from "../services/follow.service";
import { FollowTopic } from "../schemas/follow.schema";



export default class TopicController extends BaseController {
    public constructor(
        protected topicService: TopicService,
        protected followService: FollowService
    ){
        super()
    }


    public async toggleFollowTopic(req: Request<{}, {}, FollowTopic["body"]>, res: Response, next: NextFunction){
        //find follow
        let duplicateFollow = await this.followService.find({topicId: req.body.topicId, userId: req.body.userId});
        let message = 'Topic followed';
        if(duplicateFollow){
            //then unfollow
            await this.followService.unfollowTopic({topicId: duplicateFollow.topicId, userId: duplicateFollow.userId});
            message = 'Topic unfollowed';
        }else {
            //then follow
            await this.followService.followTopic(req.body);
        }
        return this.sendSuccess(res, message, 201);
    }


    public async getAllTopics(req: Request<{}, {}, {}, GetAllTopics["query"]>, res: Response, next: NextFunction) {
        try{
            const category = req.query.category;
            let topics = await this.topicService.findAll(category ? {category} : {});
            return this.sendSuccessWithData(res, "Topics fetched successfully", StatusCodes.OK, topics);
        }catch(e){
            next(e)
        }
    }


    public async createTopic(req: Request<{}, {}, CreateTopic["body"]>, res: Response, next: NextFunction){
        try{
            let r = req as Request & {session: ISession};
            const newTopic = await this.topicService.create({...r.body, creator: r.session.userId});
            this.sendSuccessWithData(res, "Topic created for discussion", StatusCodes.CREATED, newTopic);
        }catch(e){
            next(e);
        }
    }


    public async deleteTopic(req: Request<GetTopic["params"]>, res: Response, next: NextFunction){
        try{
            await this.topicService.delete({_id: req.params.id});
            return this.sendSuccess(res, "Topic deleted successfully", StatusCodes.ACCEPTED);
        }catch(e){
            next(e);
        }
    }


    public async findTopic(req: Request<GetTopic["params"]>, res: Response, next: NextFunction){
        try{
            const id = req.params.id;
            const topic = await this.topicService.findOne({_id: id});
            return this.sendSuccessWithData(res, "Topic found successfully", StatusCodes.ACCEPTED, topic);
        }catch(e){
            next(e);
        }
    }
}