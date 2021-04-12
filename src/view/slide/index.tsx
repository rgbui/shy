import React from "react";
import { WorkSpacesView } from "../../core/workspace/surface";
import { User } from "./user";

export class Slide extends React.Component {
    constructor(props) { super(props) }
    render() {
        return <div className='sy-slide'>
            <WorkSpacesView></WorkSpacesView>
            <User></User>
        </div>
    }
}