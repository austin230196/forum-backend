import DeviceDetector, {type DetectResult} from "node-device-detector";
import { Response, Request, NextFunction } from "express";

export default function(req: Request, res: Response, next: NextFunction){
    const detector = new DeviceDetector({
        deviceIndexes: true,
        clientIndexes: true,
        deviceAliasCode: false
    })
    let userAgent = req.get('User-Agent');
    let device = detector.detect(userAgent as string);
    (req as any).device = device;
    next();
}