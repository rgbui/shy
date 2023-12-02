import { EventsComponent } from "rich/component/lib/events.component";
import React from "react";
import LogoSrc from "../../src/assert/img/shy.blue.svg";
import { serverSlideStore } from "../store";
import { Switch } from "rich/component/view/switch";
import { S } from "rich/i18n/view";
import { PopoverSingleton } from "rich/component/popover/popover";
import { SelectBox } from "rich/component/view/select/box";
import { langOptions, ls } from "rich/i18n/store";
export class ServerSlideConfig extends EventsComponent {
    config: {
        version: string,
        isAutoStartup: boolean,
        closeTray: boolean
    } = {
            version: '1.0.0',
            isAutoStartup: false,
            closeTray: false
        }
    async open() {
        this.config = await serverSlideStore.shyServiceSlideElectron.getConfig()
        this.forceUpdate()
    }
    render() {
        return <div className="w-300 min-h-200 padding-14 round">
            <div className="flex-center">
                <LogoSrc style={{ width: 54, height: 54 }}></LogoSrc><span style={{ fontSize: 24 }}><S>诗云服务端</S></span>
            </div>
            <div className="flex gap-h-10">
                <span className="flex-fixed w-120 flex-end gap-r-5"><S>版本</S>:</span>
                <span className="flex-auto">{this.config.version}</span>
            </div>
            <div className="flex gap-h-10">
                <span className="flex-fixed w-120 flex-end gap-r-5"><S>开机启动</S>:</span>
                <span className="flex-auto"><Switch onChange={e => {
                    this.config.isAutoStartup = e;
                    serverSlideStore.shyServiceSlideElectron.setStartUp(this.config.isAutoStartup)
                    this.forceUpdate()
                }} checked={this.config.isAutoStartup}></Switch></span>
            </div>
            <div className="flex gap-h-10">
                <span className="flex-fixed w-120 flex-end gap-r-5"><S>缩小到拖盘</S>:</span>
                <span className="flex-auto"><Switch onChange={e => {
                    this.config.closeTray = e;
                    serverSlideStore.shyServiceSlideElectron.setTray(this.config.closeTray)
                    this.forceUpdate()
                }} checked={this.config.closeTray}></Switch></span>
            </div>
            <div className="flex gap-h-10">
                <span className="flex-fixed w-120 flex-end gap-r-5"><S>语言</S>:</span>
                <span className="flex-auto">
                    <SelectBox
                        options={langOptions.map(c => {
                            return {
                                text: c.text,
                                value: c.lang
                            }
                        })}
                        value={ls.lang}
                        onChange={async e => {
                            await ls.change(e);
                            this.forceUpdate()
                        }}></SelectBox>
                </span>
            </div>
        </div>
    }
}

export async function useServerSlideConfig() {
    let popover = await PopoverSingleton(ServerSlideConfig);
    let serverNumberView = await popover.open({ center: true, centerTop: 100 });
    serverNumberView.open()
    return new Promise((resolve: (data: any) => void, reject) => {
        popover.only('close', () => {
            resolve(null)
        })
    })
}