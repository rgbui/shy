import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { Confirm } from "rich/component/lib/confirm";
import { DotsSvg, EditSvg, PageSvg, PlusAreaSvg, PlusSvg, TrashSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { useSelectMenuItem } from "rich/component/view/menu";
import { MenuItemType } from "rich/component/view/menu/declare";
import { Point } from "rich/src/common/vector/point";
import { masterSock } from "../../../../../net/sock";
import { surface } from "../../../store";
import { RobotInfo, WikiDoc } from "../declare";
import { ContentViewer } from "./content";
import { util } from "rich/util/util";
import { ShyUtil } from "../../../../util";
import { MouseDragger } from "rich/src/common/dragger";
import { ghostView } from "rich/src/common/ghost";

export var RobotWikiList = observer((props: { robot: RobotInfo }) => {
    var local = useLocalObservable<{
        loading: boolean,
        robot: RobotInfo,
        docs: WikiDoc[],
        editDoc: WikiDoc,
        cv: ContentViewer,
        docPanel: HTMLElement
    }>(() => {
        return {
            cv: null,
            loading: false,
            robot: props.robot,
            docs: [],
            editDoc: null,
            docPanel: null
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
                docs = ShyUtil.flatArrayConvertTree(docs);
                docs.arrayJsonEach('childs', g => {
                    g.spread = false;
                    if (!Array.isArray(g.childs)) g.childs = [];
                })
                docs.forEach(doc => {
                    doc.spread = true;
                })
                local.docs = docs;
                console.log('docs,', local.docs)
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
                text: '知识',
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
            { name: 'add', text: "添加", icon: PlusSvg },
            { name: 'addSub', text: '添加子文档', icon: PlusAreaSvg },
            { type: MenuItemType.divide },
            // { name: 'edit',text:'重命名',icon:EditSvg}, 
            { name: 'fine', text: '微调', icon: PageSvg },
            { name: 'delete', text: '删除', icon: TrashSvg }
        ])
        if (r) {
            if (r.item?.name == 'edit') {

            }
            else if (r.item?.name == 'fine') {
                await masterSock.post('/robot/doc/embedding', { id: doc.id })
            }
            else if (r.item?.name == 'delete') {
                if (await Confirm('确认删除吗')) {
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
                        text: '新建文档'
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
                        text: '新建文档'
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
        if (local.editDoc?.id == doc.id) return;
        var overDrop: { id: string, doc: WikiDoc, el: HTMLElement, drop: 'up' | 'up-sub' } = {
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
            moving: (e) => {
                ghostView.move(e);
                if (local.docPanel && local.docPanel.contains(e.target as HTMLElement)) {
                    var c = (e.target as HTMLElement).closest('[data-wiki-id]') as HTMLElement;
                    if (c) {
                        var id = c.getAttribute('data-wiki-id');
                        if (doc.id != id) {
                            var currentDoc = local.docs.arrayJsonFind('childs', g => g.id == id);
                            if (overDrop?.el && overDrop.id != id) {
                                overDrop?.el.classList.remove('border-b-p');
                            }
                            c.classList.add('border-b-p')
                            overDrop = {
                                id: id,
                                el: c as HTMLElement,
                                doc: currentDoc,
                                drop: currentDoc.spread == true ? "up-sub" : 'up'
                            };
                            return;
                        }
                    }
                }
                if (overDrop?.el) {
                    overDrop?.el.classList.remove('border-b-p');
                    overDrop = { id: null, doc: null, el: null, drop: null }
                }
            },
            moveEnd(e, isMove) {
                ghostView.unload();
                if (overDrop?.el) {
                    overDrop.el.classList.remove('border-b-p');
                    dragPos(doc, overDrop.doc, overDrop.drop)
                }
                if (!isMove && local.cv)
                    local.cv.load(doc, local.robot)
            }
        })
    }
    async function dragPos(doc: WikiDoc, dropDoc: WikiDoc, arrow: 'up' | 'up-sub') {
        var parentId = arrow == 'up-sub' ? dropDoc.id : dropDoc.parentId;
        var g = await masterSock.post('/doc/move', {
            id: doc.id,
            pos: {
                parentId,
                id: arrow == 'up-sub' ? (dropDoc.childs || [])[0]?.id : dropDoc.id,
                arrow: 'up'
            }
        })
        if (g.ok) {
            runInAction(() => {
                local.docs.arrayJsonRemove('childs', g => g.id == doc.id)
                if (arrow == 'up-sub') {
                    if (!Array.isArray(dropDoc.childs)) dropDoc.childs = [];
                    dropDoc.childs.push(doc);
                    doc.parentId = dropDoc.id;
                }
                else {
                    var docs = (dropDoc.parentId ? local.docs.arrayJsonFind('childs', g => g.id == dropDoc.parentId).childs : local.docs)
                    var at = docs.findIndex(g => g.id == dropDoc.id);
                    docs.forEach((c, i) => {
                        if (i > at) { c.at += 1 }
                    })
                    doc.at = dropDoc.at + 1;
                    docs.splice(at + 1, 0, doc);
                }
            })
        }
    }
    function renderDocs(docs: WikiDoc[], parentDoc: WikiDoc, level: number = 0) {
        if (!parentDoc || parentDoc?.spread === true) {
            return <div>
                {docs.map(doc => {
                    return <div key={doc.id} >
                        <div data-wiki-id={doc.id} onMouseDown={e => mousedownDoc(e, doc)} >
                            <div className={"visible-hover cursor flex h-30 item-hover round" + (local.editDoc?.id == doc.id ? " item-hover-focus" : "")} style={{ paddingLeft: level * 20 }}>
                                <span className="size-20 flex-center item-hover round"
                                    onMouseDown={e => { doc.spread = doc.spread ? false : true; e.stopPropagation() }}>
                                    <Icon icon={doc.spread ? "arrow-down:sy" : 'arrow-right:sy'}></Icon></span>
                                <span className="flex-fixed size-20 round item-hover flex-center cursor">
                                    <Icon size={16} icon={PageSvg}></Icon>
                                </span>
                                <span className="flex-auto text-overflow">{doc.text || '知识'}</span>
                                <span className="flex-fixed">
                                    <span className="flex-center size-20 item-hover visible round" onClick={e => contextmenuItem(e, doc, parentDoc)}><Icon size={20} icon={DotsSvg}></Icon></span>
                                </span>
                            </div>
                        </div>
                        {doc.childs && renderDocs(doc.childs, doc, level + 1)}
                    </div>
                })}
            </div>
        }
        else return <></>
    }


    return <div>

        <div></div>
        <div className="flex flex-top">
            <div className="flex-fixed w-200">
                <div className="flex">
                    <span className="flex-auto">知识</span>
                    <span onMouseDown={e => add(e)} className="size-20 cursor round item-hover flex-center flex-fixed"><Icon size={16} icon={PlusSvg}></Icon></span>
                </div>
                <div ref={e => local.docPanel = e}>{renderDocs(local.docs, null)}</div>
            </div>
            <div className="flex-auto gap-w-10">
                <ContentViewer ref={e => local.cv = e}></ContentViewer>
            </div>
        </div>
    </div>
})
