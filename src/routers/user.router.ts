import { Router, RouterOptions } from "express";

import validate from "../middlewares/validate";
import UserController from "../controllers/user.controller";
import UserService from "../services/user.service";
import { loginUserSchema, createUserSchema, loginCallbackSchema, forgotPasswordSchema, updatePasswordSchema, socialLoginSchema } from "../schemas/user.schema";
import detectDevice from "../middlewares/detect-device";
import SessionService from "../services/session.service";
import JWT from "../utils/jwt.util";
import authenticate from "../middlewares/authenticate";
import GithubLoginProxyService from "../service-proxies/github.login.proxy.service";
import Mailer from "../utils/mailer.util";
import GoogleLoginProxyService from "../service-proxies/google.login.proxy.service";


const routerOptions: RouterOptions = {
    strict: true,
    mergeParams: true,
    caseSensitive: true,
};


export const userRouter = Router(routerOptions);
const userController = new UserController(new UserService(), new SessionService(), new JWT(), new GithubLoginProxyService(), new GoogleLoginProxyService(), new Mailer());

userRouter.route("/register").post(validate(createUserSchema), userController.createUser.bind(userController));
userRouter.route("/login").post([validate(loginUserSchema), detectDevice], userController.login.bind(userController) as any);
userRouter.route("/forgot-password").post([validate(forgotPasswordSchema), detectDevice], userController.forgotPassword.bind(userController) as any);
userRouter.route("/update-password").post([validate(updatePasswordSchema), detectDevice], userController.updatePassword.bind(userController));
userRouter.route("/login/:provider").get(validate(socialLoginSchema), userController.getSocialLoginURL.bind(userController));
userRouter.route("/login/:provider/callback").post([validate(loginCallbackSchema), detectDevice], userController.loginCallBack.bind(userController) as any);
userRouter.route("/token/refresh").get([detectDevice], userController.refreshToken.bind(userController) as any);
//route for updating avatar
userRouter.route("/sessions").get(authenticate('user'), userController.getUserSessions.bind(userController) as any);
userRouter.route("/logout").post(authenticate("user"), userController.logout.bind(userController) as any);