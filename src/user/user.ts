import { IconArguments } from "rich/extensions/icon/declare";
import React from "../../../rich/node_modules/@types/react";
import { userService } from "./service";
import { useOpenUserSettings } from "./settings";

export enum UserStatus {
    busy,
    online,
    offline
}
export class User {
    public id: string;
    public inc: number;
    public status: UserStatus;
    public createDate: Date;
    public phone: string;
    public paw: string;
    public name: string;
    public avatar: IconArguments;
    public email: string;
    public slogan: string;
    get isSign() {
        return this.id ? true : false;
    }
    async loadUser() {
        var r = await userService.ping();
        if (r.ok) {
            Object.assign(this, r.data.user);
        }
    }
    async onOpenUserSettings(event: React.MouseEvent) {
        await useOpenUserSettings()
    }
}