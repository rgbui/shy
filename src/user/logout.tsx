import React from "react";
import { history } from "../history";
import { UserService } from "../service/user";

export class LogOut extends React.Component {
    private isLogout: boolean = false;
    async componentDidMount() {
        if (this.isLogout == false) {
            var r = await UserService.Logout();
            history.push('/');
        }
    }
    render() {
        return <div className='sy-logout'>

        </div>
    }
}