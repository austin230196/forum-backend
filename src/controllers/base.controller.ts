import { type Response } from "express"

class BaseController {
    constructor(){}

    public sendSuccess(res: Response, message: string, statusCode: number){
        res.status(statusCode);
        return res.json({
            message,
            success: true
        })
    }


    public sendSuccessWithData<T>(res: Response, message: string, statusCode: number, data: T){
        res.status(statusCode);
        return res.json({
            message,
            success: true,
            data
        })
    }
}



export default BaseController;