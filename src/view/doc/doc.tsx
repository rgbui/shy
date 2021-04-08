import React from "react";
import { DocBar } from "../../core/doc/bar";
import { Docs } from "../../core/doc/view";
export class Doc extends React.Component {
    constructor(props) { super(props) }
    render() {
        return <div className='sy-doc'>
            <DocBar></DocBar>
            <Docs></Docs>
        </div>
    }
}