import generalConfig from "../config/general.config"

export default function GithubUrlHoFc(params: any){
    return generalConfig.GITHUB_URL + params;
}