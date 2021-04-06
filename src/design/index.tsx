import React from "react";
import { Doc } from "./doc";
import { Slide } from "./side";

export class Design extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className='sy-designer'>
            <Slide></Slide>
            <Doc></Doc>
        </div>
    }
}