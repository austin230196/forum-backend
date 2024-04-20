import jwt from "jsonwebtoken";
import generalConfig from "../config/general.config";


export default class JWT {
    protected readonly publicKey: string = generalConfig.PUBLIC_KEY;
    protected readonly privateKey: string = generalConfig.PRIVATE_KEY;
    public constructor(){
    }

    public async sign(obj: Object, options?: jwt.SignOptions|undefined) {
        return jwt.sign(obj, this.privateKey, {
            ...(options && options),
            algorithm: 'RS256'
        })
    }


    public async verify(token: string){
        let decoded = jwt.verify(token, this.publicKey, {
            algorithms: ['RS256']
        });
        return decoded;
    } 
}

