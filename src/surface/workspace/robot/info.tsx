import lodash from "lodash";
import { observer } from "mobx-react";
import React from "react";
import { EditSvg, PicSvg } from "rich/component/svgs";
import { Button } from "rich/component/view/button";
import { useForm } from "rich/component/view/form/dialoug";
import { useSelectMenuItem } from "rich/component/view/menu";
import { MenuItem, MenuItemType } from "rich/component/view/menu/declare";
import { autoImageUrl } from "rich/net/element.type";
import { Rect } from "rich/src/common/vector/point";
import { RobotInfo } from "rich/types/user";
import { masterSock } from "../../../../net/sock";
import { OpenFileDialoug } from "rich/component/file";
import { channel } from "rich/net/channel";

@observer
export class RobotInfoView extends React.Component<{ robot: RobotInfo }> {
    onEdit = async (event: React.MouseEvent) => {
        var menus: MenuItem<string>[] = [
            { text: '重命名', icon: EditSvg, name: 'rname' },
            { text: '上传头像', icon: PicSvg, name: 'avatar' },
            { type: MenuItemType.divide },
            { text: '上传封面', icon: PicSvg, name: 'cover' },
            // { type: MenuItemType.divide },
            // { text: '移除头像', icon: EditSvg, name: 'delete' },
            // { text: '移除封面', icon: EditSvg, name: 'delete' },
        ]
        var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, menus);
        if (r?.item) {
            if (r.item.name == 'rname') {
                var model = { text: this.props.robot.name }
                var f = await useForm({
                    head: false,
                    fields: [{ name: 'text', text: '机器人名称', type: 'input' }],
                    title: '编辑机器人名称',
                    remark: '',
                    footer: false,
                    model: lodash.cloneDeep(model),
                    checkModel: async (model) => {
                        if (!model.text) return '机器人名称不能为空';
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
        }
    }
    render() {
        var robot = this.props.robot;
        return <div className="shy-user-settings-profile-box-card settings" style={{ margin: '20px 0px' }}>
            <div className="bg">
                {!robot.cover?.url && <div style={{ height: 100, backgroundColor: robot?.cover?.color ? robot?.cover?.color : 'rgb(192,157,156)' }}></div>}
                {robot.cover?.url && <img style={{ height: 180 }} src={autoImageUrl(robot.cover?.url, 900)} />}
            </div>
            <div className='shy-settings-user-avatar' style={{ top: robot.cover?.url ? 180 : 100 }}>
                {robot?.avatar && <img src={autoImageUrl(robot.avatar.url, 120)} />}
                {!robot?.avatar && <span>{robot.name.slice(0, 1)}</span>}
            </div>
            <div className="shy-user-settings-profile-box-card-operators">
                <h2>{robot.name}#{robot.sn}</h2>
                <Button onClick={e => this.onEdit(e)}>编辑机器人资料</Button>
            </div>
        </div>
    }
}