import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Button } from "rich/component/view/button";
import { Dialoug } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { PopoverSingleton } from "rich/component/popover/popover";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import { Workspace } from "../../workspace";
import { CheckBox } from "rich/component/view/checkbox";
import { SelectButtons } from "rich/component/view/button/select";
import { Textarea } from "rich/component/view/input/textarea";
import { masterSock } from "../../../../net/sock";
import lodash from "lodash";
import dayjs from "dayjs";
import { DateInput } from "rich/extensions/date/input";

class CustomDomain extends EventsComponent {
    render() {
        if (!this.ws) return null;
        return <Dialoug head={<div><S>自定义域名</S></div>} style={{ width: 400 }} className={'shy-ws-set-domain'}>
            <div className="gap-h-10">
                <div className="remark f-12"><label><S>域名</S></label></div>
                <div className="gap-t-5 tap-b-10 flex">
                    <Input className={'w-120 '} placeholder={lst('输入域名')} value={this.data.customSiteDomain} onChange={e => { this.data.customSiteDomain = e; this.forceUpdate(); }}></Input>
                </div>
                <div className="gap-h-20 flex">
                    <CheckBox checked={this.data.customSiteDomainProtocol} onChange={e => { this.data.customSiteDomainProtocol = e; this.forceUpdate(); }}><S>支持HTTPS</S></CheckBox>
                </div>
                <div className="remark f-12"><label><S>绑定方式</S></label></div>
                <div className="gap-t-5 tap-b-10 flex">
                    <SelectButtons
                        value={this.data.customSiteDomainData.type}
                        options={[
                            { text: lst('自建'), value: 'self-build' },
                            { text: lst('托管'), value: 'trust' }
                        ]}
                        onChange={e => {
                            this.data.customSiteDomainData.type = e as any;
                            this.forceUpdate()
                        }} ></SelectButtons>
                </div>
                {this.data.customSiteDomainData.type == 'self-build' && <div className="gap-h-20 ">
                    <S>暂不开放</S>
                </div>}
                {this.data.customSiteDomainData.type == 'trust' && <div className="gap-h-20 ">
                    {this.data.customSiteDomainProtocol && <div>
                        <div><S>HTTPS证书</S></div>
                        <div className="f-12 remark"><S text="仅支持nginx_ssl证书">仅支持nginx ssl证书</S></div>
                        <div className="f-12 remark"><S>公钥</S></div>
                        <Textarea value={this.data.customSiteDomainData.publicKey} onChange={e => {
                            this.data.customSiteDomainData.publicKey = e;
                            this.forceUpdate()
                        }}></Textarea>
                        <div className="f-12 remark"><S>私钥</S></div>
                        <Textarea value={this.data.customSiteDomainData.privateKey}
                            onChange={e => {
                                this.data.customSiteDomainData.privateKey = e;
                                this.forceUpdate()
                            }}
                        ></Textarea>
                        <div className="f-12 remark"><S>过期时间</S></div>
                        <DateInput value={this.data.customSiteDomainData.sslDate || dayjs().add(1, "year").toDate()} onChange={e => {
                            this.data.customSiteDomainData.sslDate = e;
                            this.forceUpdate()
                        }}></DateInput>
                    </div>}
                </div>}
                <div>
                    <Button block ref={e => this.button = e} onClick={e => this.save()}><S>保存</S></Button>
                </div>
                {this.error && <div className="error">
                    {this.error}
                </div>}
            </div>
        </Dialoug>
    }
    wsId: string;
    error: string = '';
    button: Button;
    async save() {
        this.error = '';

        this.forceUpdate();
        this.button.loading = true;
        try {
            var r = await masterSock.patch('/ws/set/customeDomain', {
                wsId: this.wsId,
                customSiteDomain: this.data.customSiteDomain,
                customSiteDomainProtocol: this.data.customSiteDomainProtocol,
                customSiteDomainData: this.data.customSiteDomainData,
            })
            if (r?.data?.exists) {
                this.error = lst('域名被占用')
            }
            if (r?.data.illegal) {
                this.error = lst('域名输入不合法')
            }
            if (r.ok && !r.data?.exists && !r.data?.illegal) {
                lodash.assign(this.ws, this.data);
                this.emit('close');
                return;
            }
        }
        catch (ex) {

        }
        finally {
            if (this.button) this.button.loading = false;
            this.forceUpdate();
        }
    }
    async open(ws: Workspace) {
        this.ws = ws;
        this.wsId = ws.id;
        await this.load();
        this.forceUpdate()
    }
    async load() {
        var r = await masterSock.get('/ws/get', { wsId: this.ws.id });
        if (r?.ok) {
            this.data = r.data.workspace;
            if (!this.data.customSiteDomainData) {
                this.data.customSiteDomainData = {
                    type: 'trust',
                    publicKey: '',
                    privateKey: ''
                }
            }
        }
    }
    data: {
        customSiteDomain: string,
        customSiteDomainProtocol: boolean,
        customSiteDomainData: Workspace['customSiteDomainData']
    } = null;
    ws: Workspace
}
export async function useSetCustomDomain(ws: Workspace) {
    let popover = await PopoverSingleton(CustomDomain, { mask: true });
    let fv = await popover.open({ center: true, centerTop: 100 });
    fv.open(ws);
    return new Promise((resolve: (value: any) => void, reject) => {
        fv.only('close', (g) => {
            popover.close();
            resolve(g);
        });
        popover.only('close', () => {
            resolve(null);
        });
    })
}