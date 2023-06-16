import React from "react";
import { ShyUrl, UrlRoute } from "../../../history";
import { surface } from "../../store";
import { User } from "../user";
import { channel } from "rich/net/channel";

export class LogOut extends React.Component {
    private isLogout: boolean = false;
    async componentDidMount() {
        if (this.isLogout == false) {
            var r = await channel.get('/sign/out');
            if (r.ok) {
                surface.user = new User();
                if (surface.workspace?.tim)
                    surface.workspace.tim.close()
                surface.workspace = null;
                if (surface.user?.tim)
                    surface.user.tim.close();
                if (window.shyConfig.isPro) location.href = 'https://shy.live'
                else UrlRoute.push(ShyUrl.root);
            }
        }
    }
    render() {
        return <div className='shy-logout'>
            <span>正在退出中...</span>
        </div>
    }
}