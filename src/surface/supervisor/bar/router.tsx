
import React from 'react';
import { Icon } from 'rich/component/view/icon';
import { observer, useLocalObservable } from 'mobx-react';
import { ChevronRightSvg, CollectTableSvg, DocAddSvg, DocEditSvg, LockSvg, MaximizeSvg } from 'rich/component/svgs';
import { Loading } from 'rich/component/view/loading';
import { util } from 'rich/util/util';
import { PageViewStore } from '../view/store';
import { getPageIcon } from 'rich/extensions/at/declare';
import { ElementType } from 'rich/net/element.type';
import { TableSchema } from 'rich/blocks/data-grid/schema/meta';
import { getSchemaViewIcon } from 'rich/blocks/data-grid/schema/util';

export var PageRouter = observer(function (props: { store: PageViewStore }) {
    var local = useLocalObservable<{ isLoad: boolean, schema: TableSchema }>(() => {
        return {
            isLoad: false,
            schema: null
        }
    })
    async function load() {
        if ([ElementType.Schema, ElementType.SchemaView, ElementType.SchemaFieldBlogData, ElementType.SchemaRecordView, ElementType.SchemaRecordViewData].includes(props.store.pe.type)) {
            local.schema = await props.store.getSchema();
            local.isLoad = true;
        }
    }
    React.useEffect(() => {
        load()
    }, [])
    var item = props.store.item;
    if (props.store.pe.type == ElementType.Schema) {
        if (local.isLoad) {
            return <div className='shy-supervisor-bar-router f-14'>
                <span className='item-hover padding-w-10 padding-h-3 round cursor'>{local.schema?.text}</span>
            </div>
        }
    }
    else if ([ElementType.SchemaView].includes(props.store.pe.type)) {
        if (local.isLoad) {
            var view = local.schema?.views?.find(g => g.id == props.store.pe.id1);
            return <div className='shy-supervisor-bar-router flex f-14'>
                <span className='item-hover padding-w-5 padding-h-3 round cursor flex'>
                    <Icon size={16} icon={CollectTableSvg}></Icon>
                    <em className='gap-l-3'>{local.schema?.text}</em>
                </span>
                <span className='remark'><Icon size={12} icon={ChevronRightSvg}></Icon></span>
                <span className='item-hover padding-w-5 padding-h-3 round cursor flex'>
                    <Icon size={16} icon={getSchemaViewIcon(view.url)}></Icon>
                    <em className='gap-l-3'> {view?.text}</em>
                </span>
                <span className='item-hover  round cursor flex-center size-24 round '>
                    <Icon size={16} icon={MaximizeSvg}></Icon>
                </span>
            </div>
        }
    }
    else if ([ElementType.SchemaRecordView, ElementType.SchemaRecordViewData].includes(props.store.pe.type)) {
        if (local.isLoad) {
            var v = local.schema?.recordViews.find(g => g.id == props.store.pe.id1);
            return <div className='shy-supervisor-bar-router text-1 flex f-14'>
                <span className='item-hover padding-w-5 padding-h-3 round cursor flex'>
                    <Icon size={16} icon={CollectTableSvg}></Icon>
                    <em className='gap-l-3'>{local.schema?.text}</em>
                </span>
                <span className='remark'><Icon size={12} icon={ChevronRightSvg}></Icon></span>
                <span className='item-hover padding-w-5 padding-h-3 round cursor flex'>
                    <Icon size={16} icon={ElementType.SchemaRecordViewData == props.store.pe.type ? DocEditSvg : DocAddSvg}></Icon>
                    <em className='gap-l-3'>{v?.text}</em>
                </span>
                <span className='item-hover  round cursor flex-center size-24 round '>
                    <Icon size={16} icon={MaximizeSvg}></Icon>
                </span>
            </div>
        }
    }
    else if ([ElementType.SchemaFieldBlogData].includes(props.store.pe.type)) {
        if (local.isLoad) {
            return <div className='shy-supervisor-bar-router text-1 flex f-14'>
                <span className='item-hover padding-w-5 padding-h-3 round cursor flex'>
                    <Icon size={16} icon={CollectTableSvg}></Icon>
                    <em className='gap-l-3'>{local.schema?.text}</em>
                </span>
                {/* <span className='remark'><Icon size={12} icon={ChevronRightSvg}></Icon></span> */}
                {/* <span className='item-hover padding-w-5 padding-h-3 round cursor flex'>
                    <Icon size={16} icon={ElementType.SchemaRecordViewData == props.store.pe.type ? DocEditSvg : DocAddSvg}></Icon>
                    <em className='gap-l-3'>{v?.text}</em>
                </span> */}
                <span className='item-hover  round cursor flex-center size-24 round '>
                    <Icon size={16} icon={MaximizeSvg}></Icon>
                </span>
            </div>
        }
    }
    else if (item) {
        return <div className='shy-supervisor-bar-router'>
            <span className='shy-supervisor-bar-router-item'><Icon icon={getPageIcon(item)} size={18}></Icon><a className='shy-supervisor-bar-router-item-title'>{item.text || '新页面'}</a></span>
            {item.editDate && <span className='shy-supervisor-bar-router-time'>保存于{util.showTime(item.editDate)}</span>}
            {props.store.snapSaving && <span className='shy-supervisor-bar-router-save'><Loading></Loading>保存中...</span>}
            {item.locker?.userid && <div className='shy-supervisor-bar-router-locker'><Icon size={18} icon={LockSvg}></Icon></div>}
        </div>
    }
    return <></>;
})