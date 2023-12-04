import React from "react";
import { Rect } from "rich/src/common/vector/point";
import { surface } from "../../store";
import { observer } from "mobx-react";
import { ChevronDownSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { autoImageUrl } from "rich/net/element.type";
import { isMobileOnly } from "react-device-detect";
export var WorkspaceProfile = observer(function () {
    async function mousedown(event: React.MouseEvent) {
        var ele = event.currentTarget as HTMLElement;
        ele = ele.querySelector('.shy-ws-profile-info') as HTMLElement;
        var rect = Rect.from(ele.getBoundingClientRect());
        surface.workspace.openMenu({ fixPoint: rect.leftBottom.add(0, 0) }, rect.width)
    }
    return <div className={'shy-ws-profile' + (surface.workspace?.cover?.url ? " cover" : "")} onMouseDown={e => mousedown(e)}>
        <div className={'shy-ws-profile-info flex desk-drag'}>
            {isMobileOnly && <span className="flex-fixed flex-center size-24 round cursor item-hover desk-no-drag">
                <Icon size={16} icon={{ name: "bytedance-icon", code: 'hamburger-button' }}></Icon>
            </span>}
            <span className="flex-auto bold f-16 text-overflow gap-r-5 "><span className="desk-no-drag">{surface.workspace.text}</span></span>
            {surface.workspace.isMember && <span className=" desk-no-drag size-20 item-hover flex-center remark flex-fixed gap-r-10"><Icon icon={ChevronDownSvg} size={16} ></Icon></span>}
        </div>
        {surface.workspace.cover && <div className="shy-ws-profile-cover">
            <img src={autoImageUrl(surface.workspace.cover.url, 500)} />
        </div>}
    </div>
})

