import React from "react";
import { Divider } from "rich/component/view/grid";
import { SelectBox } from "rich/component/view/select/box";
import { langOptions, ls } from "rich/i18n/store";
import { S } from "rich/i18n/view";

export class ShyAppLang extends React.Component {
    render() {
        return <div className="shy-app-lang">
            <h2 className="h2"><S>语言</S></h2>
            <Divider></Divider>
            <div className="flex">
                <span className="flex-auto"><S>选择语言</S></span>
                <span className="flex-fixed"><SelectBox
                    options={langOptions.map(c => {
                        return {
                            text: c.text,
                            value: c.lang
                        }
                    })}
                    value={ls.lang}
                    onChange={async e => {
                        await ls.change(e);
                        this.forceUpdate()
                    }}></SelectBox></span>
            </div>
        </div>
    }
}