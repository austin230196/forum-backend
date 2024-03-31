import { Router, RouterOptions } from "express";

import { replyRouter } from "./reply.router";
import { topicRouter } from "./topic.router";
import { userRouter } from "./user.router";

const routerOptions: RouterOptions = {
    mergeParams: true,
    strict: true,
    caseSensitive: true
}


const router = Router(routerOptions);


router.use("/v1", topicRouter, replyRouter);
router.use("/v1/user", userRouter);



export default router;