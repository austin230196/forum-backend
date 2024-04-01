import generalConfig from "../config/general"

export default function GithubUrlHoFc(params: any){
    return generalConfig.GITHUB_URL + params;
}