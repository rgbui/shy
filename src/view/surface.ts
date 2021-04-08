import { ViewSurface } from ".";
import { PageData } from "../model/page";
import { User } from "../model/user";
import { Workspace } from "../model/workspace";

export class Surface {
    view: ViewSurface;
    get isLogin() {
        return this.user ? true : false;
    }
    user: User;
    pageData: PageData;
    workspace: Workspace;
}
export var surface = new Surface();