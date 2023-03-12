import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { config } from "../../../common/config";
export class WeixinOpen extends EventsComponent<{ onChange?: (data: { exists: boolean, open: { openId: string, nickname: string } }) => void }> {
    loading: boolean = false;
    sockId: string = '';
    constructor(props) {
        super(props);
        this.sockId = config.guid();
    }
    async open() {
        this.sockId = config.guid();
        this.forceUpdate();
    }
    onMessage = (event: MessageEvent<any>) => {
        if (event.origin && event.origin.startsWith('https://open.shy.live')) {
            var data = JSON.parse(event.data);
            if (data.sockId == this.sockId) {
                var rd = data.data;
                if (typeof this.props.onChange == 'function') this.props.onChange(rd);
                else this.emit('save', { ...rd });
            }
        }
    }
    componentDidMount(): void {
        window.addEventListener('message', this.onMessage)
    }
    componentWillUnmount(): void {
        window.removeEventListener('message', this.onMessage)
    }
    render() {
        var url = 'https://open.shy.live/weixin/sign/url?sockId=' + encodeURIComponent(this.sockId);
        var size = 200;
        var src = `https://open.shy.live/static/qr.html?size=${size}&url=${encodeURIComponent(url)}&sockId=${encodeURIComponent(this.sockId)}`
        return <div className="padding-20">
            <div className="flex-center gap-b-10 f-16 bold">微信扫码登陆</div>
            <div className="flex-center"> <iframe style={{ border: 'none', margin: 0, padding: 0, width: size, height: size }} src={src}></iframe></div>
        </div>
    }
}

export async function useWeixinOpen() {
    let popover = await PopoverSingleton(WeixinOpen, { mask: true, shadow: true });
    let fv = await popover.open({ center: true, centerTop: 100 });
    fv.open();
    return new Promise((resolve: (r: { exists: boolean, open: { openId: string, nickname: string } }) => void, reject) => {
        fv.only('close', () => {
            popover.close();
            resolve(null);
        });
        fv.only('save', (openInfo) => {
            popover.close();
            resolve(openInfo);
        })
        popover.only('close', () => {
            resolve(null);
        });
    })
}