import { observer } from "mobx-react"
import { LayoutView } from "../layout"
import React from "react";
import { surface } from "../../surface";
import { Avatar } from "rich/component/view/avator/face";
export var UserView = observer(function () {
    return <LayoutView>
        <div>

            <div className="relative h-80">
                <div>{surface.user.cover && <img src={surface.user.cover.url} />}</div>
                <div>
                    <Avatar user={surface.user}></Avatar>
                    <span>{surface.user.name}</span>
                </div>
            </div>

            <div>

                <div><span></span></div>

            </div>


        </div>
    </LayoutView>
})