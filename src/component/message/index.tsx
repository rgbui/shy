import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { S } from "rich/i18n/view";


export class MessageBox extends EventsComponent {
    render() {
        return <div>
            <div><S>消息通知</S></div>
        </div>
    }
}