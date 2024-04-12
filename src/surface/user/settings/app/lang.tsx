import React from "react";
import { CheckSvg } from "rich/component/svgs";
import { Divider } from "rich/component/view/grid";
import { Icon } from "rich/component/view/icon";
import { langOptions, ls } from "rich/i18n/store";
import { S } from "rich/i18n/view";

export class ShyAppLang extends React.Component {
    render() {
        return <div className="shy-app-lang">
            <h2 className="h2"><S>语言</S></h2>
            <Divider></Divider>
            <div>
                {langOptions.map((c, i) => {
                    return <div key={i} onMouseDown={async e => {
                        await ls.change(c.lang as any);
                        this.forceUpdate()
                    }} className={"flex cursor h-30 gap-h-5 item-hover-light-focus item-hover padding-5-10 round"}>
                        <span className="flex-fixed  size-20 flex-center">
                            {ls.lang == c.lang && <Icon size={16} icon={CheckSvg}></Icon>}
                        </span>
                        <span className="flex-fixed">{c.text}</span>
                    </div>
                })}
            </div>
        </div>
    }
}