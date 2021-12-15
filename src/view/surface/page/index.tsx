import React from 'react';
import { Loading } from 'rich/component/view/loading';
import { Page } from 'rich/src/page';
import { PageDirective } from 'rich/src/page/directive';
import { masterSock, Sock } from '../../../../net/sock';
import { workspaceService } from '../../../../services/workspace';
import { XhrReadFileBlob } from '../../../util/file';
import { currentParams } from '../../../history';
import { PageItem } from '../sln/item';

export function PageDisplay() {
    var [loading, setLoad] = React.useState(false);
    var [notFound, setNotFound] = React.useState(false);
    var refEl = React.useRef<HTMLElement>(null);
    async function getFile() {
        var pageId = currentParams('/view/:id')?.id;
        var page = (await workspaceService.getPage(pageId))?.data.page;
        if (page && page.share == 'net') {
            var ms = await masterSock.get<{ url: string }, string>('/pid/tim', { userid: page.creater });
            if (ms.data) {
                var r = await masterSock.get<{ snapshoot: { file: { url: string } } }>(Sock.resolve(ms.data.url, '/page/view'), {
                    wsId: page.workspaceId,
                    pageId: pageId,
                });
                if (r.data) {
                    var file;
                    if (r.data.snapshoot) {
                        file = await XhrReadFileBlob(r.data.snapshoot.file.url);
                        return { file, item: page };
                    }
                }
            }
        }
    }
    async function renderPage(file: Blob, item: Partial<PageItem>) {
        var page = new Page({ readonly: true });
        page.on(PageDirective.blur, function (ev) {
            // console.log('blur', ev)
        });
        page.on(PageDirective.focus, function (ev) {
            //console.log('focus', ev);
        });
        page.on(PageDirective.focusAnchor, function (anchor) {
            // console.log('focusAnchor', anchor);
        });
        page.on(PageDirective.history, async function (action) {
            // await self.item.store.saveHistory(action);
            // await self.item.store.savePageContent(action, await page.getFile());
        });
        // page.on(PageDirective.createDefaultTableSchema, async (data) => {
        //     var r = await workspaceService.createDefaultTableSchema(data);
        //     return r;
        // });
        // page.on(PageDirective.loadTableSchemaData, async (schemaId: string, options) => {
        //     var r = await workspaceService.loadTableSchemaData(schemaId, options);
        //     return r;
        // });
        // page.on(PageDirective.loadTableSchema, async (schemaId: string) => {
        //     var r = await workspaceService.loadTableSchema(schemaId);
        //     return r;
        // });
        page.on(PageDirective.error, error => {
            console.error(error);
        });
        page.on(PageDirective.loadPageInfo, async () => {
            return { text: item.text, icon: item.icon, id: item.id };
        });
        await page.loadFile(file);
        page.render(refEl.current);
    }
    async function load() {
        setLoad(true);
        setNotFound(false);
        var da = await getFile();
        if (da) {
            await renderPage(da.file, da.item);
        }
        else setNotFound(true);
        setLoad(false);
    }
    React.useEffect(() => {
        load();
    }, [])
    return <div className='shy-view'>
        {loading && <Loading></Loading>}
        {notFound && <div>当前页不存在</div>}
        {!notFound && <div className='shy-view-head'></div>}
        <div className='shy-view-content' ref={e => refEl.current = e}></div>
    </div>
}