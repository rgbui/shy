
import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { ArrowLeftSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { RobotInfo } from "rich/types/user";
import { RobotInfoView } from "./info";
import { RobotInfoDescriptionView } from "./description"
import { S } from "rich/i18n/view";
import { RobotTasksList } from "./task/view";
import { RobotChat } from "./chat";
import { RobotWiki } from "./wiki/wiki";
import "./style.less";

export var RobotWikiList = observer((props: { robot: RobotInfo, close?: () => void }) => {
    var local = useLocalObservable<{
        loading: boolean,
        robot: RobotInfo,
        tab: string,
    }>(() => {
        return {

            loading: false,
            robot: props.robot,
            tab: '1'
        }
    })
    
    function back() {
        //closeRobotDebug();
        if (typeof props.close == 'function') props.close()
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
            <span onClick={e => local.tab = '1'} className={"flex-fixed padding-w-15 " + (local.tab == '1' ? "border-b-p" : "")}><S>对话</S></span>
            <span onClick={e => local.tab = '5'} className={"flex-fixed padding-w-15 " + (local.tab == '5' ? "border-b-p" : "")}><S>常规</S></span>
            {props.robot.disabledWiki !== true && <span onClick={e => local.tab = '2'} className={"flex-fixed padding-w-15 " + (local.tab == '2' ? "border-b-p" : "")}><S>知识库</S></span>}
            <span onClick={e => local.tab = '4'} className={"flex-fixed padding-w-15 " + (local.tab == '4' ? "border-b-p" : "")}><S>动作</S></span>
        </div>
        {local.tab == '1' && <div>
            <RobotChat robot={props.robot}></RobotChat>
        </div>}
        {local.tab == '2' && <div>
            <RobotWiki robot={props.robot}></RobotWiki>
        </div>}
        {local.tab == '4' && <div>
            <RobotTasksList robot={props.robot} ></RobotTasksList>
        </div>}
        {local.tab == '5' && <div>
            <RobotInfoDescriptionView robot={props.robot}></RobotInfoDescriptionView>
        </div>}
    </div>
})
