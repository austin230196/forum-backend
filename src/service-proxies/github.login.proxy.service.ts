import * as qs from "query-string";



export default class GithubLoginProxyService {
    public async githubLoginProxyService(){
        const params = (qs as any).stringify({
            client_id: process.env.APP_ID_GOES_HERE,
            redirect_uri: 'https://programmable-forum.online/login',
            scope: ['read:user', 'user:email'].join(' '), // space seperated string
            allow_signup: true,
        })
        console.log("PARAMS");
    }
}