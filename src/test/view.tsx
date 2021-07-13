import React from "react"
import { useParams } from "react-router";

import { currentParams, SyHistory } from "../history"


// export function TestView(props){
//     console.log(SyHistory)
//     console.log(props);
//     return <div></div>
// }

export class TestView extends React.Component {
    render() {
        // let data = useParams();
        //console.log(data);
        console.log(SyHistory)
        console.log(this.props);
        console.log(currentParams('/test/:id'))
        return <div></div>
    }
}