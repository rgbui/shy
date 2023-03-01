
import React from "react";
import { DotsSvg, EditSvg } from "rich/component/svgs";
import { Divider } from "rich/component/view/grid";
import { Icon } from "rich/component/view/icon";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Spin } from "rich/component/view/spin";
import { Rect } from "rich/src/common/vector/point";
import { masterSock } from "../../../../../net/sock";

export interface UserPks {
    id: string;
    createDate: Date;
    creater: string;
    name: string;
    remark: string;
    mode: string;
    disabled: boolean;
    public_key: string;
    private_key: string;
    check: boolean;
}


export class ShyPayList extends React.Component {
    pks: UserPks[] = [];
    loading: boolean = false;
    componentDidMount() {
        this.load()
    }
    async load() {
        this.loading = true;
        this.forceUpdate();
        var r = await masterSock.get('/user/pks');
        if (r.ok) this.pks = r.data.list;
        this.loading = false;
        this.forceUpdate();
    }
    render() {

        var self = this;
        async function open(event: React.MouseEvent) {
            var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, []);
            if (r) {

            }
        }
        async function openPkProperty(pk: UserPks, event: React.MouseEvent) {
            var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, [{ name: 'disabled' }]);
            if (r) {
                if (r.item.name == 'disabled') {
                    await masterSock.patch('/user/update/pks', { id: pk, data: { disabled: pk.disabled ? false : true } })
                }
            }
        }
        async function editProperty(pk: UserPks, event: React.MouseEvent) {


            await masterSock.put('/user/create/pks', {});
            await self.load();
            self.forceUpdate();

        }

        return <div>
            <div><span className="flex-fixed"></span><span className="flex-auto flex-end"><span className="flex-center size-24 cursor item-hover round"><Icon icon={DotsSvg}></Icon></span></span></div>
            <Divider></Divider>
            {this.loading && <Spin></Spin>}
            {!this.loading && <div>
                {this.pks.map(pk => {
                    return <div className="item-hover  min-h-30 flex" key={pk.id}>
                        <div className="flex-auto"><span>{pk.name}</span></div>
                        <div className="flex-fixed">
                            <span onMouseDown={e => editProperty(pk, e)} className="flex-center size-24 cursor item-hover round"><Icon icon={EditSvg}></Icon></span>
                            <span onMouseDown={e => openPkProperty(pk, e)} className="flex-center size-24 cursor item-hover round"><Icon icon={DotsSvg}></Icon></span>
                        </div>
                    </div>
                })}
            </div>}
        </div>
    }
}