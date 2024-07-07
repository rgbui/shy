
import lodash from "lodash";
import { Rect } from "rich/src/common/vector/point";
import { Page } from "rich/src/page";
import { PageLayoutType } from "rich/src/page/declare";
import { PageDirective } from "rich/src/page/directive";
import { surface } from "../../app/store";
import { SnapStore } from "../../../../services/snap/store";
import { Mime } from "../../sln/declare";
import { PageViewStore } from "./store";
import { log } from "../../../../common/log";
import { channel } from "rich/net/channel";
import { ViewOperate } from "rich/src/history/action";
import { AtomPermission } from "rich/src/page/permission";

export async function createPageContent(store: PageViewStore) {
    try {
        if (!store.page) {
            var page = new Page();
            page.ws = surface.workspace;
            page.openSource = store.source;
            page.isSchemaRecordViewTemplate = store.config.isTemplate;
            page.openPageData = store.config.initData;
            page.customElementUrl = store.elementUrl;
            store.page = page;
            await page.cacCurrentPermissions();
            var pd: {
                content: any;
                operates?: undefined;
            } | {
                operates: ViewOperate[];
                content: any;
            }
            if (!page.isAllow(AtomPermission.pageDeny, AtomPermission.dbDeny)) {
                pd = await store.snapStore.querySnap(page.isCanEdit ? false : true);
            }
            if (store.config?.type) store.page.pageLayout = { type: store.config.type }
            if (store.item) {
                page.pageInfo = store.item;
                if (store.item.mime == Mime.table) {
                    page.pageLayout = { type: PageLayoutType.db };
                    page.requireSelectLayout = false;
                }
                else if (store.item.mime == Mime.chatroom) {
                    page.pageLayout = { type: PageLayoutType.textChannel };
                    page.requireSelectLayout = false;
                }
            }
            page.on(PageDirective.history, async function (action) {
                if (!page.canEdit({ ignoreLocker: true })) return;
                //console.log(action.syncBlocks, 'syncBlocks')
                if (Array.isArray(action.syncBlocks))
                    for (var syncBlock of action.syncBlocks) {
                        var snap = SnapStore.createSnap(syncBlock.elementUrl)
                        await snap.viewOperatorAndSnap(action.get() as any, {
                            content: await syncBlock.getSyncString()
                        }, { force: action.immediate ? true : false, notSave: action.isCursorOperatorOrPicker() })
                        //console.log('sss', action.immediate,await syncBlock.getSyncString());
                    }
                if (action.syncPage) {
                    if (page.views.length == 0) {
                        console.error('page views.lenght happend save');
                        return;
                    }
                    await store.snapStore.viewOperatorAndSnap(action.get() as any, {
                        content: await page.getString(),
                        text: store.item?.text,
                        thumb: await page.getThumb(),
                        plain: await page.getPlain(),
                        preview: await page.getPreviewContent(),
                    }, { force: action.immediate ? true : false, notSave: action.isCursorOperatorOrPicker() })
                }
            });
            page.on(PageDirective.syncPage, async (data) => {
                if (!page.isCanEdit) return;
                if (page.views.length == 0) {
                    console.error('page views.lenght happend save');
                    return;
                }
                await store.snapStore.viewSnap({
                    content: await page.getString(),
                    text: store.item?.text,
                    thumb: await page.getThumb(),
                    plain: await page.getPlain(),
                    preview: await page.getPreviewContent(),
                    ...data,
                });
            })
            page.on(PageDirective.changePageLayout, async () => {
                store.updateElementUrl(store.item.elementUrl);
            })
            page.on(PageDirective.error, error => {
                console.error(error);
                log.error(error);
            });
            page.on(PageDirective.save, async () => {
                if (!page.isCanEdit) return;
                var syncBlocks = page.findAll(g => g.syncBlockId ? true : false);
                for (let i = 0; i < syncBlocks.length; i++) {
                    if (syncBlocks[i].elementUrl) {
                        try {
                            var snap = SnapStore.createSnap(syncBlocks[i].elementUrl);
                            await snap.forceSave();
                        }
                        catch (ex) {
                            console.error(ex);
                        }
                    }
                }
                await store.snapStore.forceSave();
            });
            page.on(PageDirective.blur, async () => {
                if (store.source == 'slide') store.emit('close');
            });
            page.on(PageDirective.close, async () => {
                if (page.openSource == 'slide')
                    surface.supervisor.emit('closeSlide')
                else if (page.openSource == 'page')
                    surface.supervisor.emit('closePage')
                else if (page.openSource == 'dialog')
                    surface.supervisor.emit('closeDialog')
            });
            page.on(PageDirective.spreadSln, async () => {
                surface.onToggleSln();
            });
            page.on(PageDirective.rollup, async (id) => {
                var pd = await store.snapStore.rollupSnap(id);
                if (pd?.content) {
                    await page.reload(pd.content);
                    page.forceUpdate();
                }
            });
            page.on(PageDirective.reload, async () => {
                page.onUnmount();
                delete store.page;
                createPageContent(store);
            })
            page.on(PageDirective.syncItems, async () => {
                if (store.item) {
                    await store.item.onSync();
                }
                page.onUnmount();
                delete store.page;
                await createPageContent(store);
            })
            page.on(PageDirective.back, async () => {
                var r = surface.supervisor.elementUrls.findLast(g => g.elementUrl !== page.elementUrl && g.source == 'page');
                if (r) {
                    channel.act('/page/open', { elementUrl: r.elementUrl })
                }
            })
            page.on(PageDirective.mounted, async () => {
                store.page.onHighlightBlock(store.config.blockId, true);
            })
            if (pd)
                await page.load(pd.content, pd.operates);
            if (store.view.pageEl) {
                var bound = Rect.fromEle(store.view.pageEl);
                page.render(store.view.pageEl, {
                    width: bound.width,
                    height: bound.height
                });
            }
            else {
                console.error('store.view.pageEl is null')
            }
        }
        else {
            var bound = Rect.fromEle(store.view.pageEl);
            await store.page.renderFragment(store.view.pageEl, { width: bound.width, height: bound.height });
            store.page.onHighlightBlock(store.config.blockId, true);
        }
        if (store.page.openSource == 'page') {
            surface.workspace.enterWorkspace();
        }
        if (store.page?.pageLayout?.type == PageLayoutType.textChannel) {
            var ws = surface.wss.find(g => g.id == surface.workspace?.id);
            if (ws) {
                lodash.remove(ws.unreadChats, c => c.roomId == store.item.id);
                store.item.unreadChats = [];
            }
        }
    }
    catch (ex) {
        console.log(ex);
    }
}