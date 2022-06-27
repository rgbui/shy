
import { observer } from "mobx-react";
import React from "react";
export var LayoutView = observer(function (props: { children: React.ReactNode }) {
    return <div className="shy-mobile-layout">
        <div className="shy-mobile-layout-head">

        </div>
        <div className="shy-mobile-layout-content">
            {props.children}
        </div>
        <div className="shy-mobile-layout-footer">
            <a><span>空间</span></a>
            <a><span>私信</span></a>
            <a><span>发现</span></a>
            <a><span>我</span></a>
        </div>
    </div>
})