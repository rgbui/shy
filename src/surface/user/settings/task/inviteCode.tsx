import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { channel } from "rich/net/channel";
import { User } from "../../user";
import { Button } from "rich/component/view/button";
import { CopyAlert } from "rich/component/copy";
import { DuplicateSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { Spin } from "rich/component/view/spin";
import { S } from "rich/i18n/view";
import { ls } from "rich/i18n/store";
import { UrlRoute } from "../../../../history";

export var InviteCode = observer(function () {
    var local = useLocalObservable<{
        user: Partial<User>,
        loading: boolean
    }>(() => {
        return {
            user: null,
            loading: false
        }
    })

    async function load() {
        if (!local.user) {
            local.loading = false;
            var r = await channel.get('/user/query')
            if (r.ok && r.data && r.data.user) {
                local.user = r.data.user;
            }
            local.loading = true;
        }
    }
    React.useEffect(() => {
        load();
    }, [])
    return <div>
        <div className="border-light gap-h-10 round">
            {!local.loading && <Spin block></Spin>}
            {local.loading && <><div className="gap-w-10">
                <div className="flex gap-h-10">
                    <div className="flex-auto flex cursor" onClick={e => CopyAlert(local.user?.inviteCode, ls.t('邀请码已复制'))}><S>邀请码</S>:
                        <span>{local.user?.inviteCode}</span>
                        <i className="size-20 flex-center inline-flex item-hover round "><Icon size={16} icon={DuplicateSvg}></Icon></i>
                    </div>
                    <div className="flex-fixed"><Button size="small" onClick={e => { CopyAlert(UrlRoute.getUrl()+`/sign/in?code=` + local.user?.inviteCode, ls.t('邀请地址已复制') ); }}><S>复制邀请地址</S></Button></div>
                </div>
            </div>
            </>
            }
        </div>
    </div>
})