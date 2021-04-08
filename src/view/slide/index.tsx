import React from "react";
import { WorkSpaces } from "../../core/workspace/view";
import { User } from "./user";

export class Slide extends React.Component {
    constructor(props) { super(props) }
    render() {
        return <div className='sy-slide'>
            <WorkSpaces></WorkSpaces>
            <User></User>
        </div>
    }
}