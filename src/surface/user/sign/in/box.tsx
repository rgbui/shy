import React from "react";
import { config } from "../../../../../common/config";
import { CnLogin } from "./cn";
import { UsLogin } from "./us";
import { PopoverSingleton } from "rich/component/popover/popover";
import { EventsComponent } from "rich/component/lib/events.component";

export class SignBox extends EventsComponent {
    render() {
        return <div>
            {config.isUS && <UsLogin call={() => this.callback()}></UsLogin>}
            {!config.isUS && <CnLogin call={() => this.callback()}></CnLogin>}
        </div>
    }
    open() {

    }
    callback() {
        this.emit('close');
    }
}

export async function useUserSign() {
    let popover = await PopoverSingleton(SignBox, { mask: true, shadow: true });
    let fv = await popover.open({ center: true, centerTop: 100 });
    fv.open();
    return new Promise((resolve: (value: any) => void, reject) => {
        fv.only('close', (g) => {
            popover.close();
            resolve(true);
        });
        popover.only('close', () => {
            resolve(null);
        });
    })
}