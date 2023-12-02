import { observer } from "mobx-react";
import React from "react";
import { OpenFileDialoug } from "rich/component/file";
import { Button } from "rich/component/view/button";
import { Col, Divider, Row, Space } from "rich/component/view/grid";
import { Remark } from "rich/component/view/text";
import { channel } from "rich/net/channel";
import { Rect } from "rich/src/common/vector/point";
import { surface } from "../../../store";
import { useColorPicker } from "rich/component/view/color/picker";
import { makeObservable, observable } from "mobx";
import { autoImageUrl } from "rich/net/element.type";
import { Textarea } from "rich/component/view/input/textarea";
import { S } from "rich/i18n/view";

const DEFAULT_COLOR = 'rgb(192,157,156)';

@observer
export class UserSettingProfile extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, { inputSlogan: observable });
    }
    async onUploadFace() {
        var file = await OpenFileDialoug({ exts: ['image/*'] });
        if (file) {
            var r = await channel.post('/user/upload/file', { file, uploadProgress: (event) => { } })
            if (r.ok) {
                if (r.data.file.url) {
                    surface.user.onUpdateUserInfo({ avatar: { name: 'upload', url: r.data.file.url } })
                }
            }
        }
    }
    async removeFace() {
        surface.user.onUpdateUserInfo({ avatar: null })
    }
    async onUploadCover() {
        var file = await OpenFileDialoug({ exts: ['image/*'] });
        if (file) {
            var r = await channel.post('/user/upload/file', { file, uploadProgress: (event) => { } })
            if (r.ok) {
                if (r.data.file.url) {
                    surface.user.onUpdateUserInfo({ cover: { name: 'image', url: r.data.file.url } })
                }
            }
        }
    }
    async removeCover() {
        await surface.user.onUpdateUserInfo({ cover: null })
    }
    async onUpdateColor() {
        await surface.user.onUpdateUserInfo({ cover: { color: DEFAULT_COLOR, name: 'fill' } })
    }
    async openFontColor(event: React.MouseEvent) {
        var r = await useColorPicker(
            { roundArea: Rect.fromEvent(event) },
            {
                color: surface.user?.cover?.color || undefined, change(color) {
                    surface.user.cover = { color: color, name: 'fill' };
                }
            }
        );
        if (r) {
            await surface.user.onUpdateUserInfo({ cover: { color: r, name: 'fill' } })
        }
    }
    async saveSlogan(event: React.MouseEvent, button: Button) {
        button.loading = true;
        await surface.user.onUpdateUserInfo({ slogan: this.inputSlogan });
        this.inputSlogan = '';
        button.loading = false;
    }
    inputSlogan: string = '';
    render(): React.ReactNode {
        function renderCheckSvg() {
            return <svg aria-hidden="false" width="32" height="24" viewBox="0 0 24 24"><path fill="hsl(0, calc(var(--saturation-factor, 1) * 0%), 100%)" fillRule="evenodd" clipRule="evenodd" d="M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7.00003L19.5899 5.59003L8.99991 16.17Z"></path></svg>
        }
        return <div className="shy-user-settings-profile">
            <h2 className="h2"><S>用户个人资料</S></h2>
            <Divider></Divider>
            <div className="shy-user-settings-profile-box">
                <div className="shy-user-settings-profile-box-left">
                    <Row>
                        <Col>
                            <h5><S>头像</S></h5>
                        </Col>
                        <Col span={12} align='start'>
                            <Space>
                                <Button onClick={e => this.onUploadFace()}><S>上传头像</S></Button>
                                {surface.user.avatar?.url && <Button ghost onClick={e => this.removeFace()}><S>移除头像</S></Button>}
                            </Space>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h5><S>个人资料颜色</S></h5>
                        </Col>
                        <Col span={12} align='start'>
                            <div className="shy-user-settings-color">
                                <div className="shy-user-settings-color-bg"
                                    onMouseDown={e => this.onUpdateColor()}>
                                    {surface.user?.cover?.color == DEFAULT_COLOR && renderCheckSvg()}
                                </div>
                                <span><S>默认</S></span>
                            </div>
                            <div className="shy-user-settings-color">
                                <div className="shy-user-settings-color-bg"
                                    onMouseDown={e => this.openFontColor(e)}
                                    style={{
                                        backgroundColor: surface.user?.cover?.color ? surface.user?.cover?.color : "#d85050"
                                    }}>
                                    <svg style={{ position: 'absolute', right: 2, top: 2 }} width="14" height="14" viewBox="0 0 16 16"><g fill="none"><path d="M-4-4h24v24H-4z"></path><path fill="hsl(0, calc(var(--saturation-factor, 1) * 0%), 100%)" d="M14.994 1.006C13.858-.257 11.904-.3 10.72.89L8.637 2.975l-.696-.697-1.387 1.388 5.557 5.557 1.387-1.388-.697-.697 1.964-1.964c1.13-1.13 1.3-2.985.23-4.168zm-13.25 10.25c-.225.224-.408.48-.55.764L.02 14.37l1.39 1.39 2.35-1.174c.283-.14.54-.33.765-.55l4.808-4.808-2.776-2.776-4.813 4.803z"></path></g></svg>
                                    {surface.user?.cover?.color != DEFAULT_COLOR && renderCheckSvg()}
                                </div>
                                <span><S>自定义</S></span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col><h5><S>个人资料横幅</S></h5></Col>
                        <Col>
                            <Remark><S text={'上传横幅图片要求'}>我们建议使用至少 600x240 大小的图片。您可上传小于 5 MB 的 PNG、JPG 或动态 GIF。</S></Remark>
                        </Col>
                        <Col span={12} align='start' style={{ marginTop: 10 }} >
                            <Space>
                                <Button onClick={e => this.onUploadCover()}><S>上传横幅</S></Button>
                                {surface.user?.cover?.url && <Button ghost onClick={e => this.removeCover()}><S>移除横幅</S></Button>}
                            </Space>
                        </Col>
                    </Row>
                    <Row>
                        <Col><h5><S>自我介绍</S></h5></Col>
                        {/* <Col>
                            <Remark>如果您愿意，还可以使用 markdown 和链接。</Remark>
                        </Col> */}
                        <Col align='start'>
                            <Textarea
                                value={this.inputSlogan || surface.user.slogan}
                                onChange={e => this.inputSlogan = e}></Textarea>
                        </Col>
                        {this.inputSlogan && <Col style={{ marginTop: 10 }}>
                            <Button onClick={(e, b) => this.saveSlogan(e, b)}><S>保存</S></Button>
                        </Col>}
                    </Row>
                </div>
                <div className="shy-user-settings-profile-box-right">
                    <h5><S>预览</S></h5>
                    <div className="shy-user-settings-profile-box-card">
                        <div className="bg">
                            {!surface.user.cover?.url && <div style={{ height: 60, backgroundColor: surface.user?.cover?.color ? surface.user?.cover?.color : 'rgb(192,157,156)' }}></div>}
                            {surface.user.cover?.url && <img style={{ height: 120 ,display:'block'}} src={autoImageUrl(surface.user.cover?.url, 500)} />}
                        </div>
                        <div className='shy-settings-user-avatar' style={{ top: surface.user.cover?.url ? 120 : 60 }}>
                            {surface.user?.avatar && <img src={autoImageUrl(surface.user.avatar.url, 50)} />}
                            {!surface.user?.avatar && <span>{surface.user.name.slice(0, 1)}</span>}
                        </div>
                        <div className="shy-user-settings-profile-box-card-content">
                            <div className="h2">{surface.user.name}#{surface.user.sn}</div>
                            <Remark>{this.inputSlogan || surface.user.slogan}</Remark>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    }
}

