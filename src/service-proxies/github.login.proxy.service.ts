import { URLSearchParams } from "url";
import axios from "axios";


import generalConfig from "../config/general";



export default class GithubLoginProxyService {
    public async getLoginURL(): Promise<string>{
        const params = new URLSearchParams()
        params.append("client_id", generalConfig.GITHUB_CLIENT_ID);
        params.append("redirect_uri", generalConfig.GITHUB_CALLBACK_URL);
        params.append("scope", ['read:user', 'user:email', 'user'].join(' '));
        const url = `${generalConfig.GITHUB_URL}/authorize?${params}`;
        return url;
    }


    public async getAccessToken(code: string): Promise<string> {
        const params = new URLSearchParams();
        params.append("client_id", generalConfig.GITHUB_CLIENT_ID);
        params.append("redirect_uri", generalConfig.GITHUB_CALLBACK_URL);
        params.append("client_secret", generalConfig.GITHUB_CLIENT_SECRET);
        params.append("code", code);
        const url = `${generalConfig.GITHUB_URL}/access_token?${params}`;
        const res = await axios.post(url, undefined, {
            headers: {
                "Accept": "application/json"
            }
        })
        // console.log({r: res.data});
        return res?.data?.access_token;
    }


    public async getUserDetails(token: string){
        const res = await axios.get(generalConfig.GITHUB_USER_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        // console.log({res});
        return res.data;
    }


    public async getUserEmails(token: string){
        const res = await axios.get(generalConfig.GITHUB_USER_URL + "/emails", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        // console.log({res});
        return res.data;
    }
}