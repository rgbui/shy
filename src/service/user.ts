import { PageData } from "../model/page";
import { User, UserStatus } from "../model/user";
import { Workspace } from "../model/workspace";
import { data } from "./data";

export class UserService {
    static async tryLogin() {
        var user = new User();
        user.id = 'kankantest';
        user.account = 'kankan';
        user.profile_photo = 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2Fd84aa9f4-1aaf-4547-8273-ba1129f7b675%2F109951163041428408.jpg?table=space&id=37659cc5-3ed0-4375-9a9d-ce77379a49ff&width=40&userId=3c8f21e7-4d95-4ff1-a44b-3a82c3a8098e&cache=v2';
        user.status = UserStatus.online;
        return user;
    }
    static async getPageData(pageId: string) {
        var pageId = 'kankankan';
        var pd = new PageData();
        pd.id = pageId;
        pd.data = data;
        return pd;
    }
    static async getWorkspace(workspaceId: string) {
        var pageId = 'kankankan';
        var ws = new Workspace();
        ws.id = 'workspacetest';
        ws.profile_photo = 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2Fd84aa9f4-1aaf-4547-8273-ba1129f7b675%2F109951163041428408.jpg?table=space&id=37659cc5-3ed0-4375-9a9d-ce77379a49ff&width=40&userId=3c8f21e7-4d95-4ff1-a44b-3a82c3a8098e&cache=v2';
        ws.title = '我的空间';
        ws.items = [];
        ws.items.push({
            id: pageId,
            text: '测试页面'
        });
        return ws;
    }
}