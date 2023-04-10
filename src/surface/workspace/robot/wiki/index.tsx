import { computed, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Confirm } from "rich/component/lib/confirm";
import { DotsSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { useSelectMenuItem } from "rich/component/view/menu";
import { MenuItemType } from "rich/component/view/menu/declare";
import { Point } from "rich/src/common/vector/point";
import { masterSock } from "../../../../../net/sock";
import { surface } from "../../../store";
import { RobotInfo, WikiDoc } from "../declare";
import { ContentViewer } from "./content";

@observer
export class RobotWikiList extends React.Component<{ robot: RobotInfo }> {
    constructor(props) {
        super(props);
        this.robot = props.robot;
        makeObservable(this, {
            loading: observable,
            robot: observable,
            docs: observable,
            editDocId: observable,
            editDoc: computed
        })
    }
    loading: boolean = false;
    robot: RobotInfo = null;
    docs: WikiDoc[] = [];
    componentDidMount() {
        this.load()
    }
    async load() {
        this.loading = true;
        try {
            var r = await masterSock.get('/robot/wiki/list', { wsId: surface.workspace?.id, robotId: this.robot.id });
            if (r.ok) {
                this.docs = r.data.docs;
            }
        }
        catch (ex) {

        }
        finally {
            this.loading = false;
        }
    }
    render() {
        return <div>

            <div></div>
            <div className="flex">
                <div className="flex-fixed w-200">
                    {this.renderDocs(this.docs, null)}
                </div>
                <div className="flex-auto">
                    <ContentViewer doc={this.editDoc}></ContentViewer>
                </div>
            </div>
        </div>
    }
    async mousedownItem(e: React.MouseEvent, doc: WikiDoc, parentDoc?: WikiDoc) {
        var r = await useSelectMenuItem({ roundPoint: Point.from(e) }, [{ name: 'add' }, { name: 'addSub' }, { type: MenuItemType.divide }, { name: 'edit' }, { name: 'delete' }])
        if (r) {
            if (r.item?.name == 'edit') {

            }
            else if (r.item?.name == 'delete') {
                if (await Confirm('确认删除吗')) {
                    await masterSock.delete('/wiki/doc', { id: doc.id })
                    this.docs.arrayJsonRemove('childs', g => g.id == doc.id)
                }
            }
            else if (r.item?.name == 'add') {
                var g = await masterSock.put('/wiki/doc', { data: { wsId: surface.workspace?.id, robotId: this.robot.id, parentId: parentDoc?.id, text: '新建文档' } })
                if (g.ok) {
                    var docs = parentDoc?.childs || this.docs;
                    var at = docs.findIndex(g => g == doc);
                    docs.splice(at + 1, 0, g.data.doc)
                }
            }
            else if (r.item?.name == 'addSub') {
                var g = await masterSock.put('/wiki/doc', { data: { wsId: surface.workspace?.id, robotId: this.robot.id, parentId: doc.id, text: '新建文档' } })
                if (g.ok) {
                    var docs = doc.childs;
                    if (!Array.isArray(docs)) docs = doc.childs = [];
                    var at = docs.findIndex(g => g == doc);
                    docs.push(g.data.doc)
                }
            }
        }
    }
    get editDoc() {
        return this.docs.arrayJsonFind('childs', g => g.id == this.editDocId)
    }
    editDocId: string = '';
    async openDoc(e: React.MouseEvent, doc: WikiDoc) {
        if (this.editDocId == doc.id) return;
        var oldEditDoc = this.editDoc;
        if (oldEditDoc.contentChange == true) {
            if (await Confirm('文档内容已经修改，是否保存？')) {
                await masterSock.post('/wiki/doc', { data: { id: oldEditDoc.id, contentS: oldEditDoc.contents } })
                oldEditDoc.contentChange = false;
            }
        }
        this.editDocId = doc.id;
    }
    renderDocs(docs: WikiDoc[], parentDoc: WikiDoc, level: number = 0) {
        return <div>
            {docs.map(doc => {
                return <div key={doc.id}>
                    <div onMouseDown={e => this.openDoc(e, doc)} className={"flex item-hover round" + (this.editDocId == doc.id ? " item-hover-focus" : "")} style={{ paddingLeft: level * 20 }}>
                        <span className="flex-auto text-overflow">{doc.text}</span>
                        <span className="flex-fixed">
                            <span className="flex-center size-20 item-hover" onClick={e => this.mousedownItem(e, doc, parentDoc)}> <Icon size={20} icon={DotsSvg}></Icon></span>
                        </span>
                    </div>
                    {doc.childs && this.renderDocs(doc.childs, doc, level + 1)}
                </div>
            })}
        </div>
    }
}