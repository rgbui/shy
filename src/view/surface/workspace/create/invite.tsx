import { observer } from "mobx-react";
import React from "react";
import { surface } from "../..";
import { currentParams, SyHistory } from "../../../../history";
export var InviteView = observer(function () {
    async function trySign() {
        var wsId = currentParams('/invite/:id')?.id;
        if (!surface.user.isSign) {
            await surface.user.loadUser()
        }
        if (!surface.user.isSign) {
            var url = '/invite/' + wsId;
            SyHistory.push('/sign/in?back=' + window.encodeURIComponent(url));
            return;
        }
    }


    React.useEffect(() => {
        trySign();
    }, [])

    return <div className="shy-invite">

    </div>
})