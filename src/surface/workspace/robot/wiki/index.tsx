import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { Confirm } from "rich/component/lib/confirm";
import { ArrowLeftSvg, CheckSvg, ChevronDownSvg, DebugSvg, DotSvg, DotsSvg, EditSvg, PageSvg, PlusAreaSvg, PlusSvg, RefreshSvg, TrashSvg, UploadSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { useSelectMenuItem } from "rich/component/view/menu";
import { MenuItemType } from "rich/component/view/menu/declare";
import { Point, Rect } from "rich/src/common/vector/point";
import { masterSock } from "../../../../../net/sock";
import { surface } from "../../../store";
import { WikiDoc } from "../declare";
import { ContentViewer } from "./content";
import { util } from "rich/util/util";
import { ShyUtil } from "../../../../util";
import { MouseDragger } from "rich/src/common/dragger";
import { ghostView } from "rich/src/common/ghost";
import { RobotInfo } from "rich/types/user";
import { RobotInfoView } from "../info";
import { RobotInfoDescriptionView } from "../description";
import { ToolTip } from "rich/component/view/tooltip";
import { RobotInfoPromptView } from "./prompt";
import "./style.less";
import { closeRobotDebug, useRobotDebug } from "./debug";
import { lst } from "rich/i18n/store";
import { Tip } from "rich/component/view/tooltip/tip";
import { S } from "rich/i18n/view";

export var RobotWikiList = observer((props: { robot: RobotInfo, close?: () => void }) => {
    var local = useLocalObservable<{
        loading: boolean,
        robot: RobotInfo,
        docs: WikiDoc[],
        editDoc: WikiDoc,
        renameDoc: WikiDoc,
        cv: ContentViewer,
        docPanel: HTMLElement,
        tab: string,
    }>(() => {
        return {
            cv: null,
            loading: false,
            robot: props.robot,
            docs: [],
            editDoc: null,
            docPanel: null,
            tab: '1',
            renameDoc: null
        }
    })
    async function load() {
        local.loading = true;
        try {
            var r = await masterSock.get('/robot/wiki/list', { wsId: surface.workspace?.id, robotId: local.robot.id });
            if (r.ok) {
                var docs = r.data.docs as WikiDoc[];
                docs.sort((x, y) => {
                    if (x.at > y.at) return 1;
                    else if (x.at == y.at) return 0;
                    else return -1;
                })
                docs.forEach(d => d.embeddingTip = '')
                docs = ShyUtil.flatArrayConvertTree(docs);
                docs.arrayJsonEach('childs', g => {
                    g.spread = false;
                    if (!Array.isArray(g.childs)) g.childs = [];
                })
                docs.forEach(doc => {
                    doc.spread = true;
                })
                local.docs = docs;
            }
        }
        catch (ex) {

        }
        finally {
            local.loading = false;
        }
    }
    React.useEffect(() => {
        load()
    }, [])
    async function add(event: React.MouseEvent) {
        var g = await masterSock.put('/put/doc', {
            data: {
                wsId: surface.workspace?.id,
                robotId: local.robot.id,
                text: lst('知识'),
                contents: [{ id: util.guid(), content: '' }]
            }
        })
        if (g.ok) {
            var docs = (local.docs) as WikiDoc[];
            docs.push(g.data.doc);
        }
    }
    async function contextmenuItem(e: React.MouseEvent, doc: WikiDoc, parentDoc?: WikiDoc) {
        var r = await useSelectMenuItem({ roundPoint: Point.from(e) }, [
            { name: 'add', text: lst("添加"), icon: PlusSvg },
            { name: 'addSub', text: lst('添加子文档'), icon: PlusAreaSvg },
            { type: MenuItemType.divide },
            { name: 'edit', text: lst('重命名'), icon: EditSvg },
            { name: 'fine', text: lst('训练'), icon: RefreshSvg, checkLabel: doc.embedding ? true : false },
            { type: MenuItemType.divide },
            { name: 'delete', text: lst('删除'), icon: TrashSvg }
        ])
        if (r) {
            if (r.item?.name == 'edit') {
                local.renameDoc = doc;
                await util.delay(100);
                var de = document.querySelector('[data-wiki-id=\'' + doc.id + '\']');
                if (de) {
                    var input = de.querySelector('input') as HTMLInputElement;
                    if (input) {
                        input.focus();
                    }
                }
            }
            else if (r.item?.name == 'fine') {
                if (doc.embedding !== true || doc.embedding == true && await Confirm(lst('已训练-tip', '已训练，是否仍然训练')))
                    await masterSock.fetchStream({
                        url: '/robot/doc/embedding/stream',
                        data: {
                            id: doc.id,
                            model: props.robot.model || (window.shyConfig.isUS ? "gpt" : "ERNIE-Bot-turbo")
                        },
                        method: 'post'
                    }, (str, done) => {
                        doc.embeddingTip = str;
                        if (done) {
                            doc.embedding = true;
                            doc.embeddingTip = '';
                            // local.embedding = false;
                        }
                    })
            }
            else if (r.item?.name == 'delete') {
                if (await Confirm(lst('确认删除吗'))) {
                    await masterSock.delete('/del/doc', { id: doc.id })
                    local.docs.arrayJsonRemove('childs', g => g.id == doc.id)
                }
            }
            else if (r.item?.name == 'add') {
                var g = await masterSock.put('/put/doc', {
                    data: {
                        contents: [{ id: util.guid(), content: '' }],
                        wsId: surface.workspace?.id,
                        robotId: local.robot.id,
                        parentId: parentDoc?.id,
                        text: lst('新建文档')
                    }
                })
                if (g.ok) {
                    var docs = (parentDoc?.childs || local.docs) as WikiDoc[];
                    var at = docs.findIndex(g => g == doc);
                    docs.splice(at + 1, 0, g.data.doc)
                }
            }
            else if (r.item?.name == 'addSub') {
                var g = await masterSock.put('/put/doc', {
                    data: {
                        contents: [{ id: util.guid(), content: '' }],
                        wsId: surface.workspace?.id,
                        robotId: local.robot.id,
                        parentId: doc.id,
                        text: lst('新建文档')
                    }
                })
                if (g.ok) {
                    doc.spread = true;
                    var docs = doc.childs;
                    if (!Array.isArray(docs)) docs = doc.childs = [];
                    var at = docs.findIndex(g => g == doc);
                    docs.push(g.data.doc)
                }
            }
        }
    }
    function mousedownDoc(e: React.MouseEvent, doc: WikiDoc) {
        e.preventDefault();
        var overDrop: { id: string, doc: WikiDoc, el: HTMLElement, drop: 'top' | 'bottom' | 'bottom-sub' } = {
            id: null,
            doc: null,
            el: null,
            drop: null
        };
        MouseDragger({
            event: e.nativeEvent,
            dis: 5,
            moveStart: (e) => {
                var pe = (e.target as HTMLElement).closest('[data-wiki-id]') as HTMLElement;
                ghostView.load(pe, { point: Point.from(e) })
            },
            moving: (e, d, isend) => {
                if (isend) return;
                ghostView.move(e);
                if (local.docPanel && local.docPanel.contains(e.target as HTMLElement)) {
                    var c = (e.target as HTMLElement).closest('[data-wiki-id]') as HTMLElement;
                    if (c) {
                        var id = c.getAttribute('data-wiki-id');
                        if (doc.id != id) {
                            var currentDoc = local.docs.arrayJsonFind('childs', g => g.id == id);
                            if (overDrop?.el) {
                                overDrop?.el.classList.remove(
                                    'shy-robot-wiki-item-top',
                                    'shy-robot-wiki-item-bottom',
                                    'shy-robot-wiki-item-bottom-sub'
                                );
                            }
                            var cRect = Rect.fromEle(c as HTMLElement);
                            var paddingLeft = parseFloat(c.getAttribute('data-padding-left'))
                            if (currentDoc.spread == true && currentDoc.childs.length > 0) {
                                if (e.clientX > cRect.left + paddingLeft) {
                                    overDrop = {
                                        id: id,
                                        el: c as HTMLElement,
                                        doc: currentDoc,
                                        drop: 'bottom-sub'
                                    };
                                }
                                else {
                                    overDrop = {
                                        id: id,
                                        el: c as HTMLElement,
                                        doc: currentDoc,
                                        drop: 'bottom'
                                    };
                                }
                                c.classList.add('shy-robot-wiki-item-' + overDrop.drop)
                            }
                            else {
                                var drop: any = 'bottom'
                                if (e.clientY < cRect.middle) {
                                    drop = 'bottom-sub'
                                }
                                c.classList.add('shy-robot-wiki-item-' + drop);
                                overDrop = {
                                    id: id,
                                    el: c as HTMLElement,
                                    doc: currentDoc,
                                    drop: drop
                                };
                            }
                            return;
                        }
                    }
                    else {
                        var dc = Rect.fromEle(local.docPanel);
                        var drop;
                        var cd: WikiDoc;
                        var ce: any;
                        if (Math.abs(e.clientY - dc.top) < Math.abs(e.clientY - dc.bottom)) {
                            drop = 'top';
                            cd = local.docs.first();
                            ce = local.docPanel.querySelector('[data-wiki-id="' + cd.id + '"]');
                            if (overDrop?.el) {
                                overDrop?.el.classList.remove(
                                    'shy-robot-wiki-item-top',
                                    'shy-robot-wiki-item-bottom',
                                    'shy-robot-wiki-item-bottom-sub'
                                );
                            }
                            overDrop = {
                                id: id,
                                el: ce as HTMLElement,
                                doc: cd,
                                drop: drop
                            };
                        }
                        else {
                            drop = 'bottom';
                            cd = local.docs.last();
                            ce = local.docPanel.querySelector('[data-wiki-id="' + cd.id + '"]');
                            if (overDrop?.el) {
                                overDrop?.el.classList.remove(
                                    'shy-robot-wiki-item-top',
                                    'shy-robot-wiki-item-bottom',
                                    'shy-robot-wiki-item-bottom-sub'
                                );
                            }
                            overDrop = {
                                id: id,
                                el: ce as HTMLElement,
                                doc: cd,
                                drop: drop
                            };
                        }
                        return;
                    }
                }
                if (overDrop?.el) {
                    overDrop?.el.classList.remove(
                        'shy-robot-wiki-item-top',
                        'shy-robot-wiki-item-bottom',
                        'shy-robot-wiki-item-bottom-sub'
                    );
                    overDrop = { id: null, doc: null, el: null, drop: null }
                }
            },
            moveEnd(e, isMove) {
                ghostView.unload();
                if (overDrop?.el) {
                    overDrop.el.classList.remove(
                        'shy-robot-wiki-item-top',
                        'shy-robot-wiki-item-bottom',
                        'shy-robot-wiki-item-bottom-sub'
                    );
                    dragPos(doc, overDrop.doc, overDrop.drop)
                }
                if (!isMove && local.cv) {
                    local.cv.load(doc, local.robot)
                    local.editDoc = doc;
                }
            }
        })
    }
    async function dragPos(doc: WikiDoc, dropDoc: WikiDoc, arrow: 'bottom' | 'bottom-sub' | 'top') {
        var parentId = arrow == 'bottom-sub' ? dropDoc.id : null;
        var g = await masterSock.post('/doc/move', {
            id: doc.id,
            pos: {
                parentId,
                id: arrow == 'bottom-sub' ? null : dropDoc.id,
                arrow: arrow == 'top' ? "up" : 'down'
            }
        })
        if (g.ok) {
            runInAction(() => {
                local.docs.arrayJsonRemove('childs', g => g.id == doc.id)
                if (arrow == 'bottom-sub') {
                    if (!Array.isArray(dropDoc.childs)) dropDoc.childs = [];
                    dropDoc.childs.push(doc);
                    doc.parentId = dropDoc.id;
                    doc.at = (dropDoc.childs.last()?.at || -1) + 1;
                }
                else if (arrow == 'bottom') {
                    var docs = (dropDoc.parentId ? local.docs.arrayJsonFind('childs', g => g.id == dropDoc.parentId).childs : local.docs)
                    var at = docs.findIndex(g => g.id == dropDoc.id);
                    docs.forEach((c, i) => {
                        if (i > at) { c.at += 1 }
                    })
                    doc.at = dropDoc.at + 1;
                    docs.splice(at + 1, 0, doc);
                }
                else if (arrow == 'top') {
                    var docs = (dropDoc.parentId ? local.docs.arrayJsonFind('childs', g => g.id == dropDoc.parentId).childs : local.docs)
                    var at = docs.findIndex(g => g.id == dropDoc.id);
                    docs.forEach((c, i) => {
                        if (i > at) { c.at += 1 }
                    })
                    doc.at = dropDoc.at;
                    docs.splice(at, 0, doc);
                }
            })
        }
    }
    async function updateDoc(doc: WikiDoc, props: Record<string, any>) {
        Object.assign(doc, props);
        await masterSock.patch('/patch/doc', { id: doc.id, data: props })
    }
    function renderDocs(docs: WikiDoc[], parentDoc: WikiDoc, level: number = 0) {
        if (!parentDoc || parentDoc?.spread === true) {
            return <div>
                {docs.map(doc => {
                    return <div key={doc.id} >
                        <div data-wiki-id={doc.id}
                            data-padding-left={level * 20 + 20}
                            style={{ '--gap-left': (level * 20 + 20) + 'px' } as any}
                            className="shy-robot-wiki-item"
                            onMouseDown={e => mousedownDoc(e, doc)}
                            onContextMenu={e => {
                                e.preventDefault()
                                contextmenuItem(e, doc, parentDoc)
                            }}
                        >
                            <div className={"visible-hover cursor flex h-30 gap-h-5 item-hover round" + (local.editDoc?.id == doc.id ? " item-hover-focus" : "")} style={{ paddingLeft: level * 20 }}>
                                {local.renameDoc !== doc && <><span className={"flex-fixed gap-l-5 size-20 flex-center item-hover round ts" + (doc.spread ? '' : ' rotate-90-')}
                                    onMouseDown={e => { doc.spread = doc.spread ? false : true; e.stopPropagation() }}>
                                    {doc.childs?.length > 0 && <Icon size={16} icon={ChevronDownSvg}></Icon>}
                                    {!(Array.isArray(doc.childs) && doc.childs.length > 0) && <Icon size={16} icon={DotSvg}></Icon>}
                                </span>
                                    <span className="flex-fixed size-20 round text-1 item-hover flex-center cursor">
                                        <Icon size={16} icon={PageSvg}></Icon>
                                    </span>
                                    <span className="flex-auto text-overflow">{doc.text || lst('知识')}</span>
                                    <span className="flex-fixed flex">
                                        {doc.embedding && <Tip text={'已微调'}><span className="flex-center text-1 size-20 item-hover  round" ><Icon size={16} icon={CheckSvg}></Icon></span></Tip>}
                                        <span className="flex-center size-20 gap-r-5 item-hover visible round" onClick={e => contextmenuItem(e, doc, parentDoc)}><Icon size={20} icon={DotsSvg}></Icon></span>
                                    </span></>}
                                {local.renameDoc == doc && <>
                                    <input className="no-border"
                                        style={{ border: '1px solid #eee' }}
                                        defaultValue={doc.text || lst('知识')}
                                        onChange={e => {
                                        }}
                                        onBlur={e => {
                                            var value = (e.target as HTMLInputElement).value.trim()
                                            if (value) {
                                                updateDoc(doc, { text: value })
                                                local.renameDoc = null;
                                            }
                                        }}
                                    />
                                </>}
                            </div>
                        </div>
                        {doc.childs && renderDocs(doc.childs, doc, level + 1)}
                    </div>
                })}
            </div>
        }
        else return <></>
    }
    function back() {
        closeRobotDebug();
        if (typeof props.close == 'function') props.close()
    }
    async function openDebug(e: React.MouseEvent) {
        var r = await useRobotDebug(props.robot);
        if (r) {

        }
    }
    return <div>
        <div className="flex">
            <div className="flex-fixed flex item-hover padding-w-3 round cursor" onMouseDown={e => back()}>
                <span className="size-24 gap-r-5 flex-center"><Icon size={16} icon={ArrowLeftSvg}></Icon> </span><span><S>后退</S></span>
            </div>
        </div>
        <div>
            <RobotInfoView robot={props.robot}></RobotInfoView>
        </div>
        <div className="flex border-bottom gap-h-10 gap-b-20  r-h-30 r-cursor">
            <span onClick={e => local.tab = '1'} className={"flex-fixed padding-w-15 " + (local.tab == '1' ? "border-b-p" : "")}><S>常规</S></span>
            <span onClick={e => local.tab = '3'} className={"flex-fixed padding-w-15 " + (local.tab == '3' ? "border-b-p" : "")}>prompt</span>
            {props.robot.disabledWiki !== true && <span onClick={e => local.tab = '2'} className={"flex-fixed padding-w-15 " + (local.tab == '2' ? "border-b-p" : "")}><S>知识库</S></span>}
            <span className="flex-auto flex-end">
                <ToolTip overlay={lst('调试')}><span onMouseDown={e => openDebug(e)} className="flex-center size-24 round item-hover cursor"><Icon size={18} icon={DebugSvg}></Icon></span></ToolTip>
            </span>
        </div>
        {local.tab == '1' && <div>
            <RobotInfoDescriptionView robot={props.robot}></RobotInfoDescriptionView>
        </div>}
        {local.tab == '2' && <div>
            <div className="flex flex-top flex-full gap-t-10">
                <div className="flex-fixed w-200 border-right padding-r-10 gap-r-10">
                    <div className="flex">
                        <span className="flex-auto flex">
                            <span className="item-hover round padding-h-3 padding-w-5 cursor"><S>机器人语料库</S></span>
                        </span>
                        <span onMouseDown={e => add(e)}
                            className="size-20 cursor round item-hover flex-center flex-fixed"><Icon size={16} icon={PlusSvg}></Icon></span>
                    </div>
                    <div ref={e => local.docPanel = e}>{renderDocs(local.docs, null)}</div>
                </div>
                <div className="flex-auto gap-w-10">
                    <ContentViewer ref={e => local.cv = e}></ContentViewer>
                </div>
            </div>
        </div>}
        {local.tab == '3' && <div>
            <RobotInfoPromptView robot={props.robot}></RobotInfoPromptView>
        </div>}
    </div>
})
