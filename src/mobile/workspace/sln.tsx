import React from "react";
import { observer } from "mobx-react";
import { PageItem } from "../../surface/sln/item";
import { Icon } from "rich/component/view/icon";
import { surface } from "../../surface/store";
export var WorkspaceSln = observer(function () {
    function renderItem(item: PageItem, deep: number = 0) {
        return <div key={item.id}>
            <div><Icon icon={item.icon}></Icon><span>{item.text}</span></div>
            <ol>
                {item.childs.map(c => {
                    return renderItem(c, deep + 1)
                })}
            </ol>
        </div>
    }
    return <div>
        {surface.workspace.childs.map(c => renderItem(c))}
    </div>
})