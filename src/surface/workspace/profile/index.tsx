import React from "react";
import { Rect } from "rich/src/common/vector/point";
import { surface } from "../../app/store";
import { observer } from "mobx-react";
import { ChevronDownSvg, DoubleLeftSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { autoImageUrl } from "rich/net/element.type";
import { isMobileOnly } from "react-device-detect";
import "./style.less";
import { Tip } from "rich/component/view/tooltip/tip";
import { S } from "rich/i18n/view";
import { UA } from "rich/util/ua";

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
            <span className="flex flex-auto  gap-r-5 ">
                <span className="desk-no-drag flex-fixed bold f-16 text-overflow max-w-100">{surface.workspace.text}</span>
                {surface.workspace.isMember && <span className="shy-ws-arrow-drop desk-no-drag size-20 round  flex-center text-1 flex-fixed item-hover "><Icon icon={ChevronDownSvg} size={14} ></Icon></span>}
            </span>
            <div className="flex-fixed">
                <Tip overlay={<div>
                    <span><S>关闭侧边栏</S></span>
                    <span style={{ color: '#aaa' }}>
                        {UA.isMacOs ? "⌘+\\" : "Ctrl+\\"}
                    </span>
                </div>}>
                    <span onMouseDown={e => {
                        e.stopPropagation();
                        surface.onToggleSln();
                    }} className="shy-ws-double-left size-24 round item-hover cursor flex-center gap-r-10 text-1">
                        <Icon size={18} icon={DoubleLeftSvg}></Icon>
                    </span>
                </Tip>

            </div>
        </div>
        {surface.workspace.cover && <div className="shy-ws-profile-cover">
            <img src={autoImageUrl(surface.workspace.cover.url, 500)} />
        </div>}
    </div>
})

