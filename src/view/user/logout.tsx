import React from "react";
import { SyHistory } from "../history";
import { userService } from "./service";


export class LogOut extends React.Component {
    private isLogout: boolean = false;
    async componentDidMount() {
        if (this.isLogout == false) {
            var r = await userService.signOut();
            if (r.ok) SyHistory.push('/login');
        }
    }
    render() {
        return <div className='shy-logout'>
            <span>正在退出中...</span>
        </div>
    }
}