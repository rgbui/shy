
import React from "react";
import { ShyAlert } from "rich/component/lib/alert";
import { DotsSvg, EditSvg, PlusSvg } from "rich/component/svgs";
import { useForm } from "rich/component/view/form/dialoug";
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

export class ShyUserPks extends React.Component {
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
            var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, [{ text: '添加私钥', name: 'add', icon: PlusSvg }]);
            if (r) {
                var g = await useForm({
                    title: '创建个人身份私钥',
                    remark: '私钥名称',
                    fields: [{ name: 'name', text: '名称', type: 'input' }],
                    checkModel: async (model) => {
                        if (model.name) return '名称不能为空'
                        return ''
                    }
                });
                if (g) {
                    await masterSock.put('/user/create/pk', { name: g.name });
                    await self.load()
                    ShyAlert('个人身份私钥添加成功')
                }
            }
        }
        async function openPkProperty(pk: UserPks, event: React.MouseEvent) {
            var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, [
                { name: 'edit', text: "编辑名称", icon: EditSvg },
                ...(self.pks.length > 2 && pk.mode == 'active' ? [
                    { name: 'check', text: "启用", checkLabel: pk.check },
                    { name: 'uncheck', text: "禁用", checkLabel: !pk.check }
                ] : [])
            ]);
            if (r) {
                if (r.item.name == 'check') {
                    await masterSock.patch('/user/update/pk', { id: pk.id, check: true })
                    await self.load();
                    ShyAlert('个人身份私钥启用成功')
                }
                else if (r.item.name == 'uncheck') {
                    await masterSock.patch('/user/update/pk', { id: pk.id, check: false })
                    await self.load();
                    ShyAlert('个人身份私钥禁用成功')
                }
                else if (r.item?.name == 'edit') {
                    editProperty(pk, event)
                }

            }
        }
        async function editProperty(pk: UserPks, event: React.MouseEvent) {
            var g = await useForm({
                title: '编辑私钥名称',
                remark: '私钥名称',
                model: { name: pk.name },
                fields: [{ name: 'name', text: '名称', type: 'input' }],
                checkModel: async (model) => {
                    if (model.name) return '名称不能为空'
                    return ''
                }
            });
            if (g) {
                await masterSock.patch('/user/update/pk', { id: pk.id, name: g.name });
            }
            await self.load();
            ShyAlert('个人身份私钥编辑成功')
        }
        return <div>
            <div className="flex"><span className="flex-fixed h2">个人身份私钥</span><span className="flex-auto flex-end"><span onMouseDown={e => open(e)} className="flex-center size-24 cursor item-hover round"><Icon icon={DotsSvg}></Icon></span></span></div>
            <Divider></Divider>
            {this.loading && <Spin block></Spin>}
            {!this.loading && <div>
                {this.pks.map(pk => {
                    return <div className={"item-hover round padding-14 gap-b-10  min-h-30 flex-top" + (pk.check ? " " : " op-4")} key={pk.id}>
                        <div className="flex-auto">
                            <div className="flex">
                                <span>{pk.name}</span>
                                <span className=" gap-l-10 f-12 bg-primary round text-white op-7 padding-w-5 padding-h-1">{pk.mode == 'deal' ? "交易" : "日常"}</span>
                            </div>
                            <div className="remark">{pk.public_key}</div>
                        </div>
                        <div className="flex-fixed flex r-gap-l-5">
                            <span onMouseDown={e => openPkProperty(pk, e)} className="flex-center size-24 cursor item-hover round"><Icon icon={DotsSvg}></Icon></span>
                        </div>
                    </div>
                })}
            </div>}

            <div className="remark gap-h-30">
                个人身份私钥主要分类
                <div>1.生活交易 适用于交易安全方面的私钥</div>
                <div>2.日常行烽 适用于签名社区内的交互行为</div>
            </div>
        </div>
    }
}