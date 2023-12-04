import React from "react";
import { config } from "../../../../../common/config";
import { UsLogin } from "./us";
import { CnLogin } from "./cn";
import LogoSrc from "../../../../assert/img/shy.logo.256.png";
import LogoBlueSrc from "../../../../assert/img/shy.logo.blue.256.png";
import { lst } from "rich/i18n/store";
import { UrlRoute } from "../../../../history";
import "./style.less"

export var Login = (function () {
    return <div className={'shy-login-panel   desk-drag'}  >
        <div className='shy-login-logo'><a className="text-p" href={window.shyConfig.isServerSide ? "/home" : '/'}><img style={{ width: 60, height: 60 }} src={window.shyConfig.isServerSide ? LogoBlueSrc : LogoSrc} /><span>{window.shyConfig.isServerSide ? lst("诗云服务端") : <img className="h-25" src={UrlRoute.getUrl(config.isUS ? 'static/img/shy.png' : 'static/img/shy.text.png')} />}</span></a></div>
        {config.isUS && <UsLogin></UsLogin>}
        {!config.isUS && <CnLogin></CnLogin>}
    </div>
})