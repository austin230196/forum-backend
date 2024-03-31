import { Router, RouterOptions } from "express";


import ReplyController from "../controllers/reply.controller";
import ReplyService from "../services/reply.service";
import validate from "../middlewares/validate";
import { createReplySchema, getReplySchema, getAllTopicRepliesSchema } from "../schemas/reply.schema";
import authenticate from "../middlewares/authenticate";


const routerOptions: RouterOptions = {
    strict: true,
    mergeParams: true,
    caseSensitive: true
}

export const replyRouter = Router(routerOptions);
const replyController = new ReplyController(new ReplyService());


replyRouter.route("/replies")
.post([authenticate('user'), validate(createReplySchema)], replyController.createReply.bind(replyController));

replyRouter.route("/replies/:id")
.get(validate(getReplySchema), replyController.getReply.bind(replyController))
.delete(validate(getReplySchema), replyController.deleteReply.bind(replyController))

replyRouter.route("/replies/topic/:topicId")
.get([validate(getAllTopicRepliesSchema)], replyController.getAllTopicReplies.bind(replyController));
