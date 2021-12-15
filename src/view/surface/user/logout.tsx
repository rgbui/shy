import React from "react";
import { SyHistory } from "../../../history";
import { userService } from "../../../../services/user";
import { surface } from "..";
import { userTim } from "../../../../net/primus";

export class LogOut extends React.Component {
    private isLogout: boolean = false;
    async componentDidMount() {
        if (this.isLogout == false) {
            var r = await userService.signOut();
            if (r.ok) {
                surface.user = null;
                surface.workspace = null;
                userTim.close();
                SyHistory.push('/');
            }
        }
    }
    render() {
        return <div className='shy-logout'>
            <span>正在退出中...</span>
        </div>
    }
}