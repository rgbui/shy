import React from "react";
import { ShyUrl, SyHistory, UrlRoute } from "../../../history";
import { userService } from "../../../../services/user";
import { surface } from "../..";
import { userTim } from "../../../../net/primus/tim";
import { User } from "../user";

export class LogOut extends React.Component {
    private isLogout: boolean = false;
    async componentDidMount() {
        if (this.isLogout == false) {
            var r = await userService.signOut();
            if (r.ok) {
                surface.user = new User();
                surface.workspace = null;
                userTim.close();
                UrlRoute.push(ShyUrl.root);
            }
        }
    }
    render() {
        return <div className='shy-logout'>
            <span>正在退出中...</span>
        </div>
    }
}