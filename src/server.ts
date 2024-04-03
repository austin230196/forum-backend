import http from "http";
import { AddressInfo } from "net";
import cluster from "cluster";
import os from "os";

import { NextFunction, Request, Response } from "express";

import AdvancedError from "./helpers/advanced-error";
import router from "./routers/index.router";
import mongoConnect from "./utils/mongo-connect.util";
import connect from "./app";
import generalConfig from "./config/general";
import log from "./utils/logger.util";
// import "./tester";
import ConfigEvent from "./events/config.event";


const app = connect();
const server = http.createServer(app);
const cpus = os.cpus().length;


type IData = {
    content: string;
    date: Date
}


app.use("/api", router);

app.get("/health", async (req, res, next) => {
    try{
        const config = new ConfigEvent();
        const data = {
            content: "This is for testing our queue systems",
            date: new Date()
        }
        await config.addToAmqpQueue<IData>({type: 'test', payload: data}, generalConfig.MAIN_QUEUE_NAME);
        res.status(200);
        return res.json({
            message: "API is live",
        })
    }catch(e){
        next(e);
    }
})


app.use((req, res, next) => {
    const err = new AdvancedError("Page not found", 404);
    next(err);
})

app.use((error: AdvancedError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);
    return res.json({
        message: error.message || 'Server Error',
        success: false
    })
})

// server.on("connect", (req, socket, head) => {
//     console.log({req, socket, head});
// })

server.on("connection", (socket) => {
    // console.log({socket});
    console.log('Client connected');
})

server.on("error", async err => {
    console.error(err);
})


// if(cluster.isPrimary){
//     log.info('This is the master process ' + process.pid);
//     //fork a new one
//     for(var i=0; i < cpus; i++){
//         cluster.fork();
//     }
// }else {
//     server.listen(generalConfig.PORT, async() => {
//         //connect mongoose
//         console.log({id: process.pid});
//         await mongoConnect();
//         await redisClient.connect()
//         const addr = server.address() as AddressInfo;
//         console.log(`Server has started on http://${addr.address}:${addr.port}`);
//     })
// }

server.listen(generalConfig.PORT, async() => {
    try{
        const config = new ConfigEvent();
        await config.listenForAmqp(generalConfig.MAIN_QUEUE_NAME);
        //connect mongoose
        console.log({id: process.pid});
        await mongoConnect();
        const addr = server.address() as AddressInfo;
        console.log(`Server has started on http://${addr.address}:${addr.port}`);
    }catch(e:any){
        return console.error(e.message);
    }
})