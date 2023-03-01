import { observer } from "mobx-react";
import React from "react";
import { LayoutView } from "../layout";
import { ChannelView } from "./channel";

export var ChatView = observer(function () {
    return <LayoutView>
        <ChannelView></ChannelView>
    </LayoutView>
})


