import React from "react";
import { ShyUrl, UrlRoute } from "../../../history";
import { surface } from "../../app/store";
import { User } from "../user";
import { channel } from "rich/net/channel";
import { S } from "rich/i18n/view";
import { config } from "../../../../common/config";

export class LogOut extends React.Component {
    private isLogout: boolean = false;
    async componentDidMount() {
        if (this.isLogout == false) {
            var r = await channel.get('/sign/out');
            if (r.ok) {
                surface.user?.removeTim();
                surface.user = new User();
                surface.workspace?.removeTim()
                if (window.shyConfig.isPro) {
                    if (config.isServerSide) {
                        surface.user.toSign();
                    }
                    else if (config.isDesk) {
                        surface.user.toSign();
                    }
                    else {
                        location.href = UrlRoute.getUrl();
                    }
                }
                else UrlRoute.push(ShyUrl.root);
            }
        }
    }
    render() {
        return <div className='shy-logout'>
            <span><S>正在退出中...</S></span>
        </div>
    }
}