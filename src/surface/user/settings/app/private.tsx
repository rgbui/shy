import { observer } from "mobx-react";
import React from "react";
import { masterSock } from "../../../../../net/sock";
import { S } from "rich/i18n/view";
import { Divider } from "rich/component/view/grid";
import { DuplicateSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { CopyAlert } from "rich/component/copy";
import { lst } from "rich/i18n/store";
import { UrlRoute } from "../../../../history";
import { Tip } from "rich/component/view/tooltip/tip";

export class ServiceNumber {
    public id: string;
    public createDate: Date;
    public creater: string;
    /**
    * 服务商
    */
    public serviceProvider: string;
    /**
     * 服务号
    */
    public serviceNumber: string;
    public verifyCode: string;
    public workspaceCount: number;
    public mongodb: Record<string, any>;
    public redis: Record<string, any>;
    public search: { url: string };
    public remark: string;
    public isShyServiceCenter: boolean;
}

export function parseServiceNumberAddress(address: string) {
    address = address.split(/\:\/\//g).last();
    var srs = address.split(/\//g);
    return {
        serviceNumber: srs.first(),
        verifyCode: srs.last()
    }
}

export function buildServiceNumberAddress(sn: ServiceNumber) {
    return `shy-server://${sn.serviceNumber}/invite/${sn.verifyCode}`
}

@observer
export class PrivateClound extends React.Component {
    render() {
        return <div>
            <div className="h2"><S>私有云</S></div>
            <Divider></Divider>
            {this.list.length == 0 && <div className="flex-center remark gap-h-20"><S>还没有自已的私有云</S><a className="link gap-l-10" href={UrlRoute.getUrl('/download')}><S>创建私有数据存储</S></a></div>}
            {this.list.map(l => {
                return <div key={l.id} className="round item-hover-light-focus item-hover gap-b-10 padding-10">
                    <div className="flex">
                        <span className="remark"><S>服务号</S>:</span><span>{l.serviceNumber}</span>
                    </div>
                    <div className="remark f-12">{l.remark}</div>
                    <div className="flex">
                        <Tip text={lst('复制服务邀请地址')}><span className="flex flex-auto"><span className="cursor gap-r-5"
                            onMouseDown={e => this.onCopy(l)}>{buildServiceNumberAddress(l)}</span>
                            <span className="cursor size-24 flex-center" onMouseDown={e => this.onCopy(l)}><Icon size={16} icon={DuplicateSvg}></Icon></span>
                        </span></Tip>
                        <a className="cursor gap-r-5 link flex-fixed" onMouseDown={e => this.createServerInvite(l)}><S>更换邀请</S></a>
                    </div>
                </div>
            })}
        </div>
    }
    onCopy(l: ServiceNumber) {
        CopyAlert(buildServiceNumberAddress(l), lst(`复制成功`))
    }
    list: ServiceNumber[] = [];
    async load() {
        var r = await masterSock.get('/service/my/list');
        if (r.ok) {
            this.list = r.data.list;
            this.forceUpdate()
        }
    }
    componentDidMount(): void {
        this.load()
    }
    async createServerInvite(l: ServiceNumber) {
        var r = await masterSock.patch('/service/patch/invite', { id: l.id });
        if (r.ok) {
            l.verifyCode = r.data.verifyCode;
            this.forceUpdate();
        }
    }
}