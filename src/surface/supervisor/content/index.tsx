import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { Page } from "rich/src/page";
import { Rect } from "rich/src/common/vector/point";
import { IconArguments } from "rich/extensions/icon/declare";
import { ViewOperate } from "rich/src/history/action";
import { surface } from "../../store";
import { PageDirective } from "rich/src/page/directive";
import { channel } from "rich/net/channel";

export var PageContentView = observer(function (props: { elementUrl?: string, wsId?: string }) {

    var local = useLocalObservable<{ el: HTMLElement }>(() => {
        return {
            el: null
        }
    })
    async function load() {
        var e: string, wsId: string;
        if (props.elementUrl) {
            e = props.elementUrl;
            wsId = props.wsId;
        }
        else {
            var usp = (new URL(location.href)).searchParams;
            var e: string = usp.get('elementUrl');
            if (!e) e = usp.get('url')
            if (e) e = decodeURIComponent(e);
            var wsId = usp.get('wsId');
            var token = usp.get('token');
        }
        await surface.onLoadWorkspace(wsId, false)

        // var sock = await wss.getWsSock(wsId);
      
        var r = await surface.workspace.sock.get<{
            localExisting: boolean,
            file: IconArguments,
            operates: any[],
            content: string
        }>('/view/snap/query', {
            elementUrl: e,
            wsId: wsId,
            seq: -1,
            readonly: false
        });
        if (r.ok) {
            var pd = { operates: r.data.operates as ViewOperate[] || [], content: r.data.content ? JSON.parse(r.data.content) : {} }
            var page = new Page();
            var item = await channel.get('/page/query/elementUrl', { elementUrl: e })
            page.pageInfo = item;
            page.edit = await false;
            page.openSource = 'page'
            page.isSchemaRecordViewTemplate = false;
            page.customElementUrl = e;
            page.readonly = true;
            page.bar = false;
            await page.cachCurrentPermissions();
            await page.load(pd.content, pd.operates);
            var bound = Rect.fromEle(local.el);
            page.on(PageDirective.mounted, async () => {
                if (typeof (window as any).puppeteer_page_load == 'function' && !props.elementUrl)
                    (window as any).puppeteer_page_load();
            })
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