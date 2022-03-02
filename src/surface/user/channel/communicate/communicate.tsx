import { observer } from "mobx-react";
import React from "react";
import { RichTextInput } from "rich/component/view/text.input"
export var CommunicateView = observer(function () {
    function popOpen(cs: { char: string, span: HTMLElement }) {

    }
    function onInput(data: { files?: File[], content?: string }) {

    }
    return <div className="shy-user-channel-communicate">
        <div className="shy-user-channel-communicate-head"></div>
        <div className="shy-user-channel-communicate-content"></div>
        <div className="shy-user-channel-communicate-input">
            <RichTextInput popOpen={popOpen} onInput={onInput}></RichTextInput>
        </div>
    </div>
})