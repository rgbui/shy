

import lodash from "lodash";
import { observer, useObserver } from "mobx-react";
import React from "react";
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { Textarea } from "rich/component/view/input/textarea";
import { util } from "rich/util/util";
import { masterSock } from "../../../../../net/sock";
import { WikiDoc } from "../declare";

export var ContentViewer = observer(function (props: { doc: WikiDoc }) {
    var doc = props.doc;
    var local = useObserver(() => {
        return {
            saveLoading: false
        }
    })
    async function load() {
        if (!Array.isArray(doc.contents)) {
            var g = await masterSock.get('/robot/wiki/content', { docId: doc.id });
            if (g?.ok) {
                doc.contents = g.data.contents || [];
            }
        }
    }
    async function save() {
        local.saveLoading = true;
        await masterSock.patch('/robot/wiki/content', { docId: doc.id, data: { contents: doc.contents } });
        local.saveLoading = false;
    }
    var input = lodash.debounce(async (e) => {
        doc.text = e;
        await masterSock.put('/robot/wiki', { docId: doc.id, data: { text: e } })
    }, 1000)

    React.useEffect(() => {
        load()
    }, [doc.id])

    return <div>
        <div><Input value={doc.text} onChange={e => input(e)} ></Input></div>
        <div>
            {doc.contents?.map((c, i) => {
                return <div id={c.id}>
                    <Textarea value={c.content} onChange={e => {
                        c.content = e;
                        doc.contentChange = true;
                    }}></Textarea>
                    <div>
                        <Button onMouseDown={e => {
                            doc.contents.splice(i, 0, { id: util.guid(), content: '' });
                            doc.contentChange = true;
                        }}>插入</Button>
                        <Button onMouseDown={e => {
                            doc.contents.splice(i, 1);
                            doc.contentChange = true;
                        }}>删除</Button>
                    </div>
                </div>
            })}
            <div className="flex-center">
                <Button loading={local.saveLoading} onMouseDown={e => save()}>保存</Button>
            </div>
        </div>
    </div>
})