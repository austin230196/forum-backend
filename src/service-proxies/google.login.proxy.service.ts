import axios from "axios";

import generalConfig from "../config/general.config";
import BaseProxyService from "./base.proxy.service";


export default class GoogleLoginProxyService implements BaseProxyService{

    public async getLoginURL(): Promise<string> {
        let params = new URLSearchParams();
        params.append("client_id", generalConfig.GOOGLE_CLIENT_ID);
        params.append("redirect_uri", generalConfig.GOOGLE_CALLBACK_URL);
        params.append("response_type", "code");
        params.append("scope", "profile email");
        let url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
        return url;
    }


    public async getAccessToken(code: string): Promise<string> {
        const res = await axios.post("https://oauth2.googleapis.com/token", {
            client_id: generalConfig.GOOGLE_CLIENT_ID,
            redirect_uri: generalConfig.GOOGLE_CALLBACK_URL,
            client_secret: generalConfig.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code'
        })
        return res?.data?.access_token;
    }


    public async getUserDetails(token: string): Promise<any> {
        const res = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return res?.data;
    }
}