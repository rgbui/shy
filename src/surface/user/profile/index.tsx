import { observer } from "mobx-react";
import React from "react";
import { SettingsSvg } from "rich/component/svgs";
import { Avatar } from "rich/component/view/avator/face";
import { IconButton } from "rich/component/view/icon";
import { surface } from "../..";
import { useOpenUserSettings } from "../settings";
import './style.less';

export var UserProfile = observer(function () {
    async function Mousedown(event: React.MouseEvent) {
        var r = useOpenUserSettings()
    }
    return <div className="shy-user-profile">
        {surface.user && <Avatar size={32} userid={surface.user.id}></Avatar>}
        <div className="shy-user-profile-operators">
            <IconButton icon={SettingsSvg} wrapper onMouseDown={e => Mousedown(e)} width={32} size={16}></IconButton>
        </div>
    </div>
});