import React from "react";
import { Divider } from "rich/component/view/grid";
import { S } from "rich/i18n/view";
export class ShyAppear extends React.Component {
    render() {
        return <div className="shy-app-lang">
            <h2 className="h2"><S>外观</S></h2>
            <Divider></Divider>
        </div>
    }
}