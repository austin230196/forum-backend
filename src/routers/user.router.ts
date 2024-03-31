import { Router, RouterOptions } from "express";

import validate from "../middlewares/validate";
import UserController from "../controllers/user.controller";
import UserService from "../services/user.service";
import { loginUserSchema, createUserSchema } from "../schemas/user.schema";
import detectDevice from "../middlewares/detect-device";
import SessionService from "../services/session.service";
import JWT from "../utils/jwt";
import authenticate from "../middlewares/authenticate";


const routerOptions: RouterOptions = {
    strict: true,
    mergeParams: true,
    caseSensitive: true,
};


export const userRouter = Router(routerOptions);
const userController = new UserController(new UserService(), new SessionService(), new JWT());

userRouter.route("/register").post(validate(createUserSchema), userController.createUser.bind(userController));

userRouter.route("/login").post([validate(loginUserSchema), detectDevice], userController.login.bind(userController) as any);

userRouter.route("/token/refresh").get([detectDevice], userController.refreshToken.bind(userController) as any);

//route for updating avatar

userRouter.route("/sessions").get(authenticate('user'), userController.getUserSessions.bind(userController) as any);