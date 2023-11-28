import lodash from "lodash";
import { observer } from "mobx-react";
import React from "react";
import { DotsSvg, EditSvg, GlobalLinkSvg, PicSvg } from "rich/component/svgs";
import { Button } from "rich/component/view/button";
import { useForm } from "rich/component/view/form/dialoug";
import { useSelectMenuItem } from "rich/component/view/menu";
import { MenuItem, MenuItemType } from "rich/component/view/menu/declare";
import { autoImageUrl } from "rich/net/element.type";
import { Rect } from "rich/src/common/vector/point";
import { RobotInfo } from "rich/types/user";
import { masterSock } from "../../../../../net/sock";
import { OpenFileDialoug } from "rich/component/file";
import { channel } from "rich/net/channel";

import { lst } from "rich/i18n/store";
import { Icon } from "rich/component/view/icon";
import { ShyAlert } from "rich/component/lib/alert";

@observer
export class RobotInfoView extends React.Component<{ robot: RobotInfo }> {
    onEdit = async (event: React.MouseEvent) => {
        var menus: MenuItem<string>[] = [
            { text: lst('重命名'), icon: EditSvg, name: 'rname' },
            { text: lst('上传头像'), icon: PicSvg, name: 'avatar' },
            { type: MenuItemType.divide },
            { text: lst('上传封面'), icon: PicSvg, name: 'cover' },
            { type: MenuItemType.divide },
            { name: 'share', icon: GlobalLinkSvg, checkLabel: this.props.robot.share == 'public', text: lst('公开') }
            // { text: '移除头像', icon: EditSvg, name: 'delete' },
            // { text: '移除封面', icon: EditSvg, name: 'delete' },
        ]
        var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, menus);
        if (r?.item) {
            if (r.item.name == 'rname') {
                var model = { text: this.props.robot.name }
                var f = await useForm({
                    head: false,
                    fields: [{ name: 'text', text: lst('机器人名称'), type: 'input' }],
                    title: lst('编辑机器人名称'),
                    remark: '',
                    footer: false,
                    model: lodash.cloneDeep(model),
                    checkModel: async (model) => {
                        if (!model.text) return lst('机器人名称不能为空');
                    }
                });
                if (f && !lodash.isEqual(f, model)) {
                    await masterSock.patch('/robot/set', { id: this.props.robot.id, data: { name: f.text } })
                    this.props.robot.name = f.text;
                }
            }
            else if (r.item.name == 'avatar') {
                var file = await OpenFileDialoug({ exts: ['image/*'] });
                if (file) {
                    var rg = await channel.post('/user/upload/file', { file, uploadProgress: (event) => { } })
                    if (rg.ok) {
                        if (rg.data.file.url) {
                            await masterSock.patch('/robot/set', {
                                id: this.props.robot.id,
                                data: {
                                    avatar: { name: 'upload', url: rg.data.file.url }
                                }
                            })
                            this.props.robot.avatar = { name: 'upload', url: rg.data.file.url }
                        }
                    }
                }
            }
            else if (r.item.name == 'cover') {
                var file = await OpenFileDialoug({ exts: ['image/*'] });
                if (file) {
                    var rg = await channel.post('/user/upload/file', { file, uploadProgress: (event) => { } })
                    if (rg.ok) {
                        if (rg.data.file.url) {
                            await masterSock.patch('/robot/set', {
                                id: this.props.robot.id,
                                data: {
                                    cover: { name: 'image', url: rg.data.file.url }
                                }
                            })
                            this.props.robot.cover = { name: 'image', url: rg.data.file.url }
                        }
                    }
                }
            }
            else if (r.item.name == 'share') {
                await masterSock.patch('/robot/set', {
                    id: this.props.robot.id,
                    data: {
                        share: this.props.robot.share == 'public' ? 'private' : 'public'
                    }
                })
                this.props.robot.share = this.props.robot.share == 'public' ? 'private' : 'public'
                ShyAlert(lst('已公开'))
            }
        }
    }
    render() {
        var robot = this.props.robot;
        return <div className="shy-user-settings-profile-box-card settings w100" style={{ margin: '20px 0px' }}>
            <div className="bg">
                {!robot.cover?.url && <div style={{ height: 100, backgroundColor: robot?.cover?.color ? robot?.cover?.color : 'rgb(192,157,156)' }}></div>}
                {robot.cover?.url && <img style={{ height: 180, display: 'block' }} src={autoImageUrl(robot.cover?.url, 900)} />}
            </div>
            <div className='shy-settings-user-avatar' style={{ top: robot.cover?.url ? 180 : 100 }}>
                {robot?.avatar && <img src={autoImageUrl(robot.avatar.url, 120)} />}
                {!robot?.avatar && <span>{(robot.name || '').slice(0, 1)}</span>}
            </div>
            <div className="shy-user-settings-profile-box-card-operators">
                <h2>{robot.name}#{robot.sn}</h2>
                <div className="flex-fixed">
                    <span onMouseDown={e => this.onEdit(e)} className="item-hover flex-center size-24 round cursor">
                        <Icon icon={DotsSvg}></Icon>
                    </span>
                </div>
            </div>
        </div>
    }
}