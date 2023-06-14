import lodash from "lodash";
import React from "react";
import { ReactNode } from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { RobotInfo } from "rich/types/user";



export class RobotDebug extends EventsComponent {
    prompt: ArrayOf<RobotInfo['prompts']> = null;
    async open(prompt: ArrayOf<RobotInfo['prompts']>) {
        this.prompt = prompt;
    }
    render(): ReactNode {

        return <div>
            <div className="pos"></div>
            <div className=""></div>
        </div>
    }
}


export async function useRobotInfoPromputForm(prompt?: ArrayOf<RobotInfo['prompts']>) {
    var popover = await PopoverSingleton(RobotDebug);
    var uf = await popover.open({ center: true, centerTop: 100 });
    uf.open(prompt);
    return new Promise((resolve: (d: ArrayOf<RobotInfo['prompts']>) => void, reject) => {
        uf.on('close', () => {
            popover.close()
            resolve(null);
        })
        uf.on('save', () => {
            popover.close()
            resolve(lodash.cloneDeep(uf.prompt));
        })
        popover.on('close', () => {
            resolve(null);
        })
    })
}