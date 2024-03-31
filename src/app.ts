import express from "express";


export default function(){
    const app = express();

    //cors
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Max-Age", 24 * 60 * 60);
        next();
    })
    
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));

    app.use((req, res, next) => {
        console.log({path: req.url, body: req.body, method: req.method});
        next();
    })

    return app;
}