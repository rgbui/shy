import { observer } from "mobx-react";
import React from "react";
import { surface } from "../..";
import { ShyUrl, SyHistory, UrlRoute } from "../../../history";
export var InviteView = observer(function () {
    async function trySign() {
        var inviteCode = UrlRoute.match(ShyUrl.invite)?.id;
        if (!surface.user.isSign) {
            await surface.user.loadUser()
        }
        if (!surface.user.isSign) {
            var url = '/invite/' + inviteCode;
            UrlRoute.push(ShyUrl.signIn,{back:url});
            return;
        }
    }


    React.useEffect(() => {
        trySign();
    }, [])

    return <div className="shy-invite">

    </div>
})