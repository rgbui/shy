import React from "react";
import { surface } from "../../app/store";
import { WorkspaceProfile } from "../../workspace/profile";
import { observer, useLocalObservable } from "mobx-react";
import { UserProfile } from "../../user/profile";
import { SearchSvg, TrashSvg, UploadSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { channel } from "rich/net/channel";
import { S } from "rich/i18n/view";
import { Input } from "rich/component/view/input";
import { lst } from "rich/i18n/store";
import { Mime } from "../declare";
import { getPageIcon, getPageText } from "rich/src/page/declare";

export var SlnView = observer(function () {
    var local = useLocalObservable<{ word: string, input: Input }>(() => {
        return {
            word: '',
            input: null
        }
    })
    React.useEffect(() => {
        function move(event: MouseEvent) {
            surface.sln.globalMove(event);
        }
        document.addEventListener('mousemove', move)
        return () => {
            document.removeEventListener('mousemove', move);
        }
    }, [])
    function renderBottoms() {
        if (surface?.workspace?.isPubSite) return <></>
        if (surface.workspace.isManager)
            return <div className="gap-t-20">
                <div onMouseDown={e => surface.workspace.onOpenTemplate(e)} className="shy-ws-item-page flex gap-w-5 min-h-28 round relative cursor ">
                    <span className="gap-l-5 round size-20 flex-center gap-r-5 remark"><Icon size={16} icon={{ name: 'bytedance-icon', code: 'page-template' }}></Icon></span>
                    <span><S>模板</S></span>
                </div>
                <div onMouseDown={e => surface.workspace.onImportFiles()} className="shy-ws-item-page flex gap-w-5 min-h-28 round relative cursor ">
                    <span className="gap-l-5  round size-20 flex-center gap-r-5 remark"><Icon size={16} icon={UploadSvg}></Icon></span>
                    <span><S>导入</S></span>
                </div>
                <div onMouseDown={e => surface.workspace.onOpenTrash(e)} className="shy-ws-item-page flex gap-w-5 min-h-28 round relative cursor ">
                    <span className="gap-l-5  round size-20 flex-center gap-r-5 remark"><Icon size={16} icon={TrashSvg}></Icon></span>
                    <span><S>垃圾桶</S></span>
                </div>
            </div>
        else return <></>
    }
    function renderPublishSiteSearch() {
        return <> {surface?.workspace?.isPubSite && !surface?.workspace?.isPubSiteHideMenu && <div className="gap-10">
            <Input ref={e => local.input = e} value={local.word} onChange={e => { local.word = e }} clear onClear={() => { local.word = '' }} prefix={<span className="flex-center size-24 remark " placeholder={lst('搜索...')}>
                <Icon size={16} icon={SearchSvg}></Icon>
            </span>}></Input>
        </div>}
            {local.word && <div>
                {surface.workspace.findAll(g => {
                    console.log(g.text, g.mime, g);
                    if (g.mime == Mime.page || g.mime == Mime.table || g.mime == Mime.chatroom) {
                        if (getPageText(g).indexOf(local.word) > -1) return true;
                    }
                    return false;
                }).map(item => {
                    return <div key={item.id} onMouseDown={e => {
                        local.word = '';
                        if (local.input) local.input.updateValue('');
                        channel.air('/page/open', { item: item })
                    }} className="flex gap-h-5 padding-h-5 padding-w-10 round item-hover">
                        <span className="flex-fixed flex-center"><Icon size={18} icon={getPageIcon(item)}></Icon></span>
                        <span className="flex-auto gap-l-5">{getPageText(item)}</span>
                    </div>
                })
                }
            </div>}
        </>
    }
    return <div className='shy-wss h100' tabIndex={1}>
        {surface.workspace && <div className={'shy-ws relative h100 flex flex-col flex-full shy-ws-' + ('note')}>
            {!(surface?.workspace?.isPubSite && surface?.workspace?.isPubSiteDefineBarMenu) && <WorkspaceProfile ></WorkspaceProfile>}
            {renderPublishSiteSearch()}
            {!local.word && <div style={{
                paddingTop: surface?.workspace?.isPubSite && !surface?.workspace?.isPubSiteHideMenu ? 0 : undefined,

            }} className='shy-ws-items' ref={e => surface.sln.el = e}>
                <div
                    style={{ minHeight: 'calc(100% - 150px )' }}
                >
                    {surface.workspace.childs.map(ws => {
                        var View = surface.sln.getMimeViewComponent(ws.mime);
                        return <View key={ws.id} item={ws} deep={-1} ></View>
                    })}
                </div>
                {renderBottoms()}
            </div>}
            {!surface?.workspace?.isPubSite && <UserProfile></UserProfile>}
        </div>}
    </div>
})