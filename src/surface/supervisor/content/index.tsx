import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { SnapStore } from "../../../../services/snap/store";
import { Page } from "rich/src/page";
import { Rect } from "rich/src/common/vector/point";
import { wss } from "../../../../services/workspace";

export var PageContentView = observer(function () {

    var local = useLocalObservable<{ el: HTMLElement }>(() => {
        return {
            el: null
        }
    })

    async function load() {
        var usp = new URLSearchParams(location.href);
        var e = usp.get('elementUrl');
        var wsId = usp.get('wsId');
        var sock = await wss.getWsSock(wsId);
        var token = usp.get('token');
        var snap = SnapStore.createSnap(e);

        // var r = await sock.get<{
        //     localExisting: boolean,
        //     file: IconArguments,
        //     operates: any[],
        //     content: string
        // }>('/view/snap/query', {
        //     elementUrl: this.elementUrl,
        //     wsId: surface.workspace.id,
        //     seq,
        //     readonly: readonly ? true : false
        // });
        if (snap) {
            var pd = await snap.querySnap(true);
            var page = new Page();
            page.edit = await false;
            page.openSource = 'page'
            page.isSchemaRecordViewTemplate = false;
            page.customElementUrl = e;
            await page.load(pd.content, pd.operates);
            var bound = Rect.fromEle(local.el);
            page.render(local.el, {
                width: bound.width,
                height: bound.height
            });
        }

    }

    React.useEffect(() => {
        load()
    }, [])

    return <div ref={e => local.el = e}>

    </div>
})