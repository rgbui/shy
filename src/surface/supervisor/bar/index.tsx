// import React from 'react';
// import { Icon } from 'rich/component/view/icon';
// import { surface } from '../..';
// import { PageRouter } from './router';
// import { PageUsers } from './user';
// import "./style.less";
// import { AppLang } from '../../../../i18n/enum';
// import { AppTip } from '../../../../i18n/tip';
// import { observer } from 'mobx-react-lite';
// import { MemberSvg, SearchSvg } from 'rich/component/svgs';
// import { ShyUrl, UrlRoute } from '../../../history';
// import HomeSrc from "../../../assert/img/shy.256.png";
// import { PageLayoutType } from 'rich/src/page/declare';
// import Tooltip from 'rc-tooltip';
// import { PageViewStore } from '../view/store';
// import { ElementType } from 'rich/net/element.type';
// import { FieldsSvg } from "rich/component/svgs"
// export var Bar = observer(function (props: { store: PageViewStore, className?: string | (string[]), noPosition?: boolean }) {
//     function back() {
//         UrlRoute.push(ShyUrl.myWorkspace);
//     }
//     var classList: string[] = ['shy-supervisor-bar', 'flex'];
//     if (props.className) {
//         if (Array.isArray(props.className)) classList.push(...props.className);
//         else classList.push(props.className);
//     }
//     var item = props.store.item;
//     if (item?.pageType == PageLayoutType.docCard) classList.push('ppt')
//     if (!surface.showSlideBar) {
//         return <div style={{ position: props.noPosition ? 'static' : undefined }} className={classList.join(" ")}>
//             <div className='shy-supervisor-bar-left flex-auto'>
//                 {!surface.showSln && <a href='https://shy.live' className='shy-supervisor-bar-logo'><img src={HomeSrc} /></a>}
//                 <PageRouter store={props.store}></PageRouter>
//             </div>
//             <div className='shy-supervisor-bar-right w-200  flex-fixed h-40 flex-end'>
//                 <PageUsers store={props.store}></PageUsers>
//                 {surface.user.isSign && <a className='shy-supervisor-bar-button' onMouseDown={e => back()}>返回我的空间</a>}
//                 {!surface.user.isSign && <a className='shy-supervisor-bar-button' href='https://shy.live/sign/in'>登录</a>}
//             </div>
//         </div>
//     }
//     return <div style={{ position: props.noPosition ? 'static' : undefined }} className={classList.join(" ")}>
//         <div className='shy-supervisor-bar-left flex-auto flex'>
//             <PageRouter store={props.store}></PageRouter>
//         </div>
//         <div className='shy-supervisor-bar-right w-200  flex-fixed h-40  flex-end'>
//             <PageUsers store={props.store}></PageUsers>
//             {[ElementType.SchemaRecordView, ElementType.SchemaRecordViewData].includes(props.store.pe.type) && <AppTip placement='bottom' id={AppLang.BarPublish}><a onClick={e => props.store.onOpenFieldProperty(e)}><Icon size={18} rotate={90} icon={FieldsSvg} ></Icon></a></AppTip>}
//             {item && [PageLayoutType.doc, PageLayoutType.board].includes(item.pageType) && <Tooltip placement='bottom' overlay={'搜索'}><a onClick={e => props.store.onSearch(e)}><Icon size={14} icon={SearchSvg}></Icon></a></Tooltip>}
//             {item && [PageLayoutType.textChannel].includes(item.pageType) && <Tooltip placement='bottom' overlay={'成员'} ><a onClick={e => props.store.onMembers(e)}><Icon size={20} icon={MemberSvg}></Icon></a></Tooltip>}
//             {([ElementType.SchemaRecordView, ElementType.SchemaRecordViewData].includes(props.store.pe.type) || item && [PageLayoutType.doc, PageLayoutType.dbForm, PageLayoutType.board, PageLayoutType.db, PageLayoutType.dbForm, PageLayoutType.dbView].includes(item.pageType)) && <AppTip placement='bottom' id={AppLang.BarPublish}><a onClick={e => props.store.onOpenPublish(e)}><Icon size={20} icon='publish:sy' ></Icon></a></AppTip>}
//             {item && ![PageLayoutType.textChannel].includes(item.pageType) && <AppTip placement='bottom' id={AppLang.BarProperty}><a onClick={e => props.store.onOpenPageProperty(e)}><Icon size={20} icon='elipsis:sy' ></Icon></a></AppTip>}
//         </div>
//     </div>
// })

