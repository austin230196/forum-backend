import { Router, RouterOptions } from "express";

import TopicController from "../controllers/topic.controller";
import TopicService from "../services/topic.service";
import validate from "../middlewares/validate";
import authenticate from "../middlewares/authenticate";
import { getTopicSchema, createTopicSchema, getAllTopicsSchema } from "../schemas/topic.schema";
import FollowService from "../services/follow.service";
import { followTopicSchema } from "../schemas/follow.schema";

const routerOptions: RouterOptions = {
    strict: true,
    caseSensitive: true,
    mergeParams: true
};


export const topicRouter = Router(routerOptions);
const topicController = new TopicController(new TopicService(), new FollowService());


topicRouter.route("/topics")
.get(validate(getAllTopicsSchema), topicController.getAllTopics.bind(topicController))
// .options(topicController.handleOptions.bind(topicController))
.post([authenticate('user'), validate(createTopicSchema)], topicController.createTopic.bind(topicController));

topicRouter.route("/topics/:id")
.get([validate(getTopicSchema)], topicController.findTopic.bind(topicController))
.delete([authenticate('user'), validate(getTopicSchema)], topicController.deleteTopic.bind(topicController));

topicRouter.route("/topics/follow/toggle")
.post([validate(followTopicSchema), authenticate('user')], topicController.toggleFollowTopic.bind(topicController));

//follow topic
//unfollow topic 
//toggle topic