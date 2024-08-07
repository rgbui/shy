import lodash from "lodash";
import { makeObservable, observable } from "mobx";
import { IconArguments, ResourceArguments } from "rich/extensions/icon/declare";
import { channel } from "rich/net/channel";
import { UserStatus } from "rich/types/user";
import { util } from "rich/util/util";
import { sCache, CacheKey } from "../../../net/cache";
import { CreateTim, Tim } from "../../../net/primus/tim";
import { masterSock } from "../../../net/sock";
import { userTimNotify } from "../../../services/tim";
import { UrlRoute, ShyUrl, SyHistory } from "../../history";
import { surface } from "../app/store";
import { config } from "../../../common/config";
import { ShyAlert } from "rich/component/lib/alert";
import { useOpenUserSettings } from "./settings/lazy";

export class User {
    public id: string = null;
    public sn: number = null;
    public createDate: Date = null;
    public phone: string = null;
    public checkPhone: boolean = null;
    public checkRealName: boolean = null;
    public realName: string = null;
    public role: 'user' | 'robot' = null;
    public paw: string = null;
    public checkPaw: boolean = null;
    public name: string = null;
    public avatar: ResourceArguments = null;
    public cover: IconArguments = null;
    public email: string = null;
    public checkEmail: boolean = null;
    public slogan: string = null;
    public rk: string;
    public uk: string;
    /**
     * 注册来源
     */

    public source: string = null;
    public inviteCode: string = null;
    public usedInviteCode: string = null;
    public config: object = null;
    public status: UserStatus = null;
    public online: boolean = null
    public allowSendLetter = true;
    public allowAddFriend = true;
    public experienceHelp: boolean = true;
    public isAutoCreateWorkspace: boolean = true;
    constructor() {
        makeObservable(this, {
            id: observable,
            sn: observable,
            createDate: observable,
            phone: observable,
            paw: observable,
            name: observable,
            avatar: observable,
            email: observable,
            slogan: observable,
            config: observable,
            inviteCode: observable,
            checkEmail: observable,
            cover: observable,
            realName: observable,
            checkRealName: observable,
            status: observable,
            allowAddFriend: observable,
            allowSendLetter: observable,
            experienceHelp: observable
        })
    }

    get isSign() {
        return this.id ? true : false;
    }

    async onOpenUserSettings(event: React.MouseEvent) {
        await useOpenUserSettings()
    }
    async onUpdateUserInfo(userInfo: Partial<User>) {
        var updateData: Partial<User> = {};
        for (let n in userInfo) {
            if (util.valueIsEqual(userInfo[n], this[n])) continue;
            else updateData[n] = userInfo[n];
        }
        if (Object.keys(updateData).length > 0) {
            var r = await channel.patch('/user/patch', { data: updateData });
            if (r.ok) {
                this.syncUserInfo(updateData);
            }
            channel.fire('/update/user', { user: this })
        }
    }
    syncUserInfo(userInfo: Record<string, any>) {
        lodash.assign(this, userInfo);
    }
    async toSign() {
        UrlRoute.push(ShyUrl.signIn);
    }
    async sign() {
        try {
            await channel.put('/device/sign');
            var r = await channel.get('/sign')
            if (r?.ok) {
                r.data.user.online = true;
                r.data.user.rk = r.data.rk;
                r.data.user.uk = r.data.uk;
                this.syncUserInfo(r.data.user);
            }
        }
        catch (ex) {
            console.error(ex);
        }
    }
    async createTim(force?: boolean) {
        if (!this.tim || force == true) {
            var url = await sCache.get(CacheKey.timUrl);
            if (!url) {
                var ms = await masterSock.get<{ url: string }, string>('/pid/provider/tim');
                if (ms.ok) {
                    url = ms.data.url;
                    await sCache.set(CacheKey.timUrl, url);
                }
            }
            this.tim = await CreateTim('shy', url);
            var self = this;
            var data = await this.getTimHeads();
            data.sockId = this.tim.id;
            await this.tim.post('/sync', data);
            this.tim.only('reconnected', async () => {
                var data = await self.getTimHeads();
                data.sockId = self.tim.id;
                if (surface.workspace) {
                    data.wsId = surface.workspace.id;
                    if (surface.supervisor?.page) {
                        data.viewUrl = surface.supervisor.page.elementUrl;
                    }
                }
                self.tim.post('/sync', data);
            })
            userTimNotify(this.tim);
        }
    }
    async getTimHeads() {
        var device = await sCache.get(CacheKey.device);
        var token = await sCache.get(CacheKey.token);
        var lang = await sCache.get(CacheKey.lang);
        return {
            device,
            token,
            lang
        } as any
    }
    tim: Tim
    async wallet(): Promise<{ money: number, isDue: boolean, meal: "meal-1" | "meal-2", due: Date }> {
        var r = await channel.get('/user/wallet');
        if (r?.ok) {
            return r.data as any;
        }
    }
    async isFillPay(alert: string) {
        var us = await surface.user.wallet();
        if (config.isTestBeta || us.money > 5 || !us.isDue && (us.meal == 'meal-1' || us.meal == 'meal-2')) {
            return true;
        }
        else {
            ShyAlert(alert)
            return false;
        }
    }
    /**
     * 
     * @returns 返回值 为1  表示通过路由跳转，而不是直接网址跳转
     */
    logout() {
        if (window.shyConfig.isPro) {
            if (location.hostname == UrlRoute.getHost() || window.shyConfig.isDesk) {
                SyHistory.push(ShyUrl.signOut);
                return 1;
            }
            else {
                location.href = UrlRoute.getUrl() + '/sign/out'
            }
        }
        else {
            SyHistory.push(ShyUrl.signOut);
            return 1;
        }
    }
}