export default abstract class BaseProxyService {
    public abstract getLoginURL(): Promise<string>;
    public abstract getAccessToken(code: string): Promise<string>;
    public abstract getUserDetails(token: string): Promise<any>;
}