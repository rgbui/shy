

import lodash, { chain } from "lodash";
import React from "react";
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { Textarea } from "rich/component/view/input/textarea";
import { util } from "rich/util/util";
import { masterSock } from "../../../../../net/sock";
import { WikiDoc } from "../declare";
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import { RobotInfo } from "rich/types/user";
import { ElementType, parseElementUrl } from "rich/net/element.type";
import { channel } from "rich/net/channel";
import { getPageIcon, getPageText } from "rich/src/page/declare";
import { Icon } from "rich/component/view/icon";

@observer
export class ContentViewer extends React.Component {
    constructor(props) {
        super(props)
        makeObservable(this, {
            doc: observable,
            robot: observable,
            local: observable
        })
    }
    doc: WikiDoc = null;
    local = {
        saveLoading: false,
        embedding: false,
        input: null,
        error: '',
        relevanceData: null,
        pe: null
    }
    robot: RobotInfo = null;
    async load(doc: WikiDoc, robot: RobotInfo) {
        this.robot = robot;
        this.doc = doc;
        var local = this.local;
        if (!Array.isArray(doc.contents)) {
            var g = await masterSock.get('/robot/doc/content', { id: doc.id });
            if (g?.ok) {
                doc.contents = g.data.contents || [{ content: '', id: util.guid() }];
                if (doc.contents.length == 0) {
                    doc.contents = [{ content: '', id: util.guid() }];
                }
            }
        }
        if (this.doc.elementUrl) {
            var pe = parseElementUrl(this.doc.elementUrl);
            if (pe?.type == ElementType.PageItem) {
                var item = (await channel.get('/page/item', { id: pe.id })).data.item;
                if (item) {
                    local.relevanceData = item;
                    local.pe = pe;
                }
            }
        }
        if (local.input) local.input.updateValue(doc.text || '');
        this.forceUpdate()
    }
    render(): React.ReactNode {
        var doc = this.doc;
        var local = this.local;
        var self = this;
        async function setEmbedding() {
            if (doc.embedding === false) {
                local.embedding = true;
                local.error = '';
                try {
                    await masterSock.fetchStream({ url: '/robot/doc/embedding/stream', data: { id: doc.id }, method: 'post' }, (str, done) => {
                        doc.embeddingTip = str;
                        if (done) {
                            doc.embedding = true;
                            doc.embeddingTip = '';
                            local.embedding = false;
                        }
                    })
                }
                catch (ex) {
                    console.error(ex);
                    local.error = '训练出错'
                }
                finally {
                    // local.embedding = false;
                }
            }
        }

        async function save() {
            local.saveLoading = true;
            try {
                await masterSock.put('/robot/save/doc/content', {
                    robotId: self.robot.id, data: {
                        id: doc.id,
                        contents: doc.contents,
                        embeddding: false
                    }
                });
            }
            catch (ex) {

            }
            finally {
                local.saveLoading = false;
            }
        }
        var autoSave = lodash.debounce(async () => {
            save()
        }, 1000)

        var input = lodash.debounce(async (e) => {
            doc.text = e;
            await masterSock.patch('/patch/doc', { id: doc.id, data: { text: e } })
        }, 1000)
        if (!this.doc) return <div></div>
        return <div>
            <div className="flex-end gap-h-10">
                <span className="error">{local.error}</span>
                <Button className="gap-r-10" loading={local.saveLoading} onMouseDown={e => save()}>保存</Button>
                {doc.embedding == true && <Button ghost>已训练</Button>}
                {doc.embedding == false && <Button loading={local.embedding} onMouseDown={e => setEmbedding()}>训练</Button>}
            </div>
            {doc.embeddingTip && <div className="flex flex-center">
                <span className="bg-p text-white padding-w-5 round padding-h-2">训练进度：{doc.embeddingTip}</span>
                <span className="remark gap-l-10">训练中请不要离开</span>
            </div>}
            <div className="remark gap-h-10"><label>标题:</label></div>
            <div className="gap-h-10"><Input ref={e => local.input = e} value={doc.text || ''} onChange={e => input(e)} ></Input></div>
            {local.pe?.type == ElementType.PageItem && <>
                <div className="remark gap-h-10"><label>关联:</label></div>
                <div className="gap-h-10 flex">
                    <span className="item-hover round cursor padding-w-5 padding-h-2 flex">
                        <Icon size={18} icon={getPageIcon(local.relevanceData.icon)}></Icon>
                        {getPageText(local.relevanceData)}
                    </span>
                </div>
            </>}
            <div className="remark gap-h-10"><label>内容:</label></div>
            <div className="gap-h-10">
                {doc.contents?.map((c, i) => {
                    return <div key={c.id}>
                        <Textarea maxLength={4000 * 4} style={{ minHeight: 400 }} value={c.content} onChange={e => {
                            c.content = e;
                            doc.embedding = false;
                            autoSave();
                        }}></Textarea>
                        <div className="remark f-12 gap-h-5">支持markdown语法，限{4000 * 4}字内</div>
                    </div>
                })}
            </div>
            <div className="h-150"></div>
        </div>
    }
}
