

import lodash from "lodash";
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
        input: null
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
        if (local.input) local.input.updateValue(doc.text || '');
        this.forceUpdate()
    }
    render(): React.ReactNode {
        var doc = this.doc;
        var local = this.local;
        var self = this;
        async function setEmbedding() {
            local.embedding = true;
            await masterSock.post('/robot/doc/embedding', { id: doc.id })
            local.embedding = false;
        }

        async function save() {
            local.saveLoading = true;
            try {
                await masterSock.put('/robot/save/doc/content', { robotId: self.robot.id, data: { id: doc.id, contents: doc.contents } });
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
            <div className="flex">
                <Button className="gap-r-10" loading={local.saveLoading} onMouseDown={e => save()}>保存</Button>
                <Button loading={local.embedding} disabled={doc.embeddding ? true : false} onMouseDown={e => setEmbedding()}>微调</Button>
            </div>
            <div className="remark"><label>标题:</label></div>
            <div className="gap-h-10"><Input ref={e => local.input = e} value={doc.text || ''} onChange={e => input(e)} ></Input></div>
            <div className="remark"><label>内容:</label></div>
            <div>
                {doc.contents?.map((c, i) => {
                    return <div key={c.id}>
                        <Textarea maxLength={3800} style={{ minHeight: 400 }} value={c.content} onChange={e => {
                            c.content = e;
                            autoSave();
                        }}></Textarea>
                        <div className="remark f-12 gap-h-5">支持markdown语法，限3800字内</div>
                    </div>
                })}
            </div>
        </div>
    }
}
