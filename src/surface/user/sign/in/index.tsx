import React from "react";
import { config } from "../../../../../common/config";
import { UsLogin } from "./us";
import { CnLogin } from "./cn";
import { lst } from "rich/i18n/store";
import { UrlRoute } from "../../../../history";
import "./style.less";

export var Login = (function () {
    return <div className={'shy-login-panel   desk-drag'}  >
        {!window.shyConfig.isServerSide && <div className='shy-login-logo'><a
            className="text-p" href={'/'}>
            <img alt="诗云 shy.live" style={{
                height: 50
            }} src={config.isUS ? UrlRoute.getUrl('static/img/shy.red.svg') : UrlRoute.getUrl('static/img/shy.live.svg')} />
        </a>
        </div>}
        {window.shyConfig.isServerSide && <div className='shy-login-logo'>
            <a
                className="text-p" href={"/home"}><img
                    style={{ width: 60, height: 60 }}
                    src={UrlRoute.getUrl('static/img/shy.logo.blue.256.png')} />
                <span>{lst("诗云服务端")}</span>
            </a>
        </div>}
        {config.isUS && <UsLogin></UsLogin>}
        {!config.isUS && <CnLogin></CnLogin>}
    </div>
})