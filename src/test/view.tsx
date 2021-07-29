import React from "react"
import { currentParams, SyHistory } from "../history"
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