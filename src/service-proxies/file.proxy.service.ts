import {v2 as cloudinaryV2} from "cloudinary";

import generalConfig from "../config/general";

export default class FileProxyService {
    //get file and do with it what you want 
    //submit a job to upload and when you get response 
    //update the location in the database
    public async load(){
        // cloudinaryV2.utils.api_sign_request(params_to_sign, api_secret);
        let config = cloudinaryV2.config({
            cloud_name: generalConfig.CLOUDINARY_APP_NAME,
            api_key: generalConfig.CLOUDINARY_API_KEY,
            api_secret: generalConfig.CLOUDINARY_API_SECRET
        })
        console.log({config});
    }


    public async uploadVideo(path: string, resource: 'video' | 'image'){
        await this.load()
        await cloudinaryV2.uploader.upload(path, {
            resource_type: resource,
            public_id: new Date() + path.replace("/", "-"),
            eager_async: true
        })

    }

}