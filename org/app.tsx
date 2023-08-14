import React from "react";
import { FooterView } from "./common/footer";
import { HeadView } from "./common/head";
import { Route, Router, Switch } from "react-router";
import { SyHistory } from "../src/history";
import { View404 } from "../src/surface/404";
import { DownloadView } from "./download";
import { PriceView } from "./pricing";
import { ProductView } from "./product";
import { AiView } from "./product/ai";
import { ProductChannel } from "./product/channel";
import { ProductDataTable } from "./product/datatable";
import { ProductDocView } from "./product/doc";
import { ProductPPT } from "./product/ppt";
import { ProductWhiteBoard } from "./product/whiteboard";
import { ServiceProtocol } from "./common/service";
import { PrivacyProtocol } from "./common/privacy";

var OrgMaps = {
    '/': ProductView,
    '/org': ProductView,
    '/download': DownloadView,
    '/pricing': PriceView,
    '/product/ai': AiView,
    '/product/channel': ProductChannel,
    '/product/datatable': ProductDataTable,
    '/product/doc': ProductDocView,
    '/product/ppt': ProductPPT,
    '/product/whiteboard': ProductWhiteBoard,
    '/service_protocol': ServiceProtocol,
    '/privacy_protocol': PrivacyProtocol
}
export function App()
{
    async function bindEvents() {
        document.body.addEventListener('mousedown', e => {
            var c = (e.target as HTMLElement).closest('.shy-site-tab-items');
            if (c) {
                var items = Array.from(c.children);
                var item = items.find(g => g.contains(e.target as HTMLElement) || g === e.target);
                if (item) {
                    var at = items.findIndex(c => c === item);
                    var pages = c.nextElementSibling as HTMLElement;
                    var pcs = Array.from(pages.children);
                    var count = Math.max(items.length, pcs.length);
                    for (let i = 0; i < count; i++) {
                        if (i == at) {
                            if (pcs[i]) (pcs[i] as HTMLElement).style.display = 'block';
                            if (items[i]) items[i].classList.add('item-hover-focus');
                        }
                        else {
                            if (pcs[i]) (pcs[i] as HTMLElement).style.display = 'none';
                            if (items[i]) items[i].classList.remove('item-hover-focus');
                        }
                    }
                }
            }

            var dg = (e.target as HTMLElement).closest('[data-toggle]');
            if (dg) {
                var se = Array.from(dg.children);
                var arrowIcon = se.find(c => c.classList.contains('shy-icon')) as HTMLElement
                var ne = dg.nextElementSibling as HTMLElement;
                if (ne) {
                    if (getComputedStyle(ne, null).display == 'none') {
                        ne.style.display = 'block';
                        arrowIcon.style.transform = 'rotate(0deg)';
                    }
                    else {
                        ne.style.display = 'none';
                        arrowIcon.style.transform = 'rotate(90deg)';
                    }
                }
            }

        })
    }
    React.useEffect(() => {
        bindEvents()
    }, [])
    function renderSites() {
        return <><HeadView></HeadView>
            <div className="shy-site-content">
                <Router history={SyHistory}>
                    <Switch>{
                        Object.keys(OrgMaps).map(key => {
                            return <Route key={key} path={key} exact component={OrgMaps[key]}></Route>
                        })
                    }
                        <Route component={View404}></Route>
                    </Switch>
                </Router>
            </div>
            <FooterView></FooterView>
        </>
    }
    return <div className="shy-site">
        {renderSites()}
    </div>
}