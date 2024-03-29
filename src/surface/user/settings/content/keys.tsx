
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
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";

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
            var g = await useForm({
                maskCloseNotSave: true,
                title: lst('创建个人身份私钥'),
                head: false,
                remark: lst('创建个人身份私钥'),
                fields: [{ name: 'name', text: lst('私钥名称'), type: 'input' }],
                checkModel: async (model) => {
                    if (model.name) return lst('私钥名称不能为空')
                    return ''
                }
            });
            if (g) {
                await masterSock.put('/user/create/pk', { name: g.name });
                await self.load()
                ShyAlert(lst('个人身份私钥添加成功'))
            }
        }
        async function openPkProperty(pk: UserPks, event: React.MouseEvent) {
            var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, [
                { name: 'edit', text: lst("编辑名称"), icon: EditSvg },
                ...(self.pks.length > 2 && pk.mode == 'active' ? [
                    { name: 'check', text: lst("启用"), checkLabel: pk.check },
                    { name: 'uncheck', text: lst("禁用"), checkLabel: !pk.check }
                ] : [])
            ]);
            if (r) {
                if (r.item.name == 'check') {
                    await masterSock.patch('/user/update/pk', { id: pk.id, check: true })
                    await self.load();
                    ShyAlert(lst('个人身份私钥启用成功'))
                }
                else if (r.item.name == 'uncheck') {
                    await masterSock.patch('/user/update/pk', { id: pk.id, check: false })
                    await self.load();
                    ShyAlert(lst('个人身份私钥禁用成功'))
                }
                else if (r.item?.name == 'edit') {
                    editProperty(pk, event)
                }
            }
        }
        async function editProperty(pk: UserPks, event: React.MouseEvent) {
            var g = await useForm({
                maskCloseNotSave: true,
                title: lst('编辑私钥名称'),
                remark: lst('私钥名称'),
                model: { name: pk.name },
                fields: [{ name: 'name', text: lst('名称'), type: 'input' }],
                checkModel: async (model) => {
                    if (model.name) return lst('名称不能为空')
                    return ''
                }
            });
            if (g) {
                await masterSock.patch('/user/update/pk', { id: pk.id, name: g.name });
            }
            await self.load();
            ShyAlert(lst('个人身份私钥编辑成功'))
        }
        return <div className="visible-hover">
            <div className="flex">
                <span className="flex-fixed h2"><S>个人身份私钥</S></span>
                <span className="flex-auto flex-end visible">
                    <span onMouseDown={e => open(e)} className="flex-center size-24 cursor item-hover round"><Icon size={20} icon={PlusSvg}></Icon></span>
                </span>
            </div>
            <Divider></Divider>
            {this.loading && <Spin block></Spin>}
            {!this.loading && <div>
                {this.pks.map(pk => {
                    return <div className={"item-hover round padding-14 gap-b-10  min-h-30 flex-top" + (pk.check ? " " : " op-4")} key={pk.id}>
                        <div className="flex-auto">
                            <div className="flex">
                                <span>{pk.name}</span>
                                <span className=" gap-l-10 f-12 bg-primary round text-white op-7 padding-w-5 padding-h-1">{pk.mode == 'deal' ? lst("交易") : lst("日常")}</span>
                            </div>
                            <div className="remark">{pk.public_key}</div>
                        </div>
                        <div className="flex-fixed flex r-gap-l-5">
                            <span onMouseDown={e => openPkProperty(pk, e)} className="flex-center size-24 cursor item-hover round"><Icon size={20} icon={DotsSvg}></Icon></span>
                        </div>
                    </div>
                })}
            </div>}

            <div className="remark gap-h-30 gap-l-14">
                <div><S>个人身份私钥分类</S></div>
                <div><S text="生活交易私钥说明">1.生活交易 适用于签名交易安全</S></div>
                <div><S text='日常行为私钥说明'>2.日常行为 适用于在社区活动签名交互行为</S></div>
            </div>
        </div>
    }
}