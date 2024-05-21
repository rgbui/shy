import React from "react";
import { S } from "rich/i18n/view";

import CheckImg from "../../src/assert/img/check.png";


var eqs = [

    { text: '文档功能', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: '数据表功能', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: '白板功能', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: 'PPT功能', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: '频道功能（聊天)', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: '导入导出', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: '双链', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: '标签', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: '协作分享', local: false, private: true, cloud: true, standard: true, pro: true },
    { text: 'AI协作(写作、创作等)', local: true, private: true, cloud:  true, standard: true, pro: true },
    { text: 'AI智能搜索', local: true, private: true, cloud: false, standard: true, pro: true },
    { text: 'AI机器人客服', local: false, private: true, cloud: false, standard: true, pro: true },
    { text: '成员管理', local: false, private: true, cloud: false, standard: true, pro: true },

    { text: '空间存储', local: '不限', private: '不限', cloud: '100M', standard: '20G', pro: '100G' },
    { text: '单图片上限', local: '不限', private: '不限', cloud: '5M', standard: '20 MB', pro: '50 MB' },
    { text: '单附件上限', local: '不限', private: '不限', cloud: '5M', standard: '500 MB', pro: '2 GB' },
    { text: '单视频上限', local: '不限', private: '不限', cloud: '不支持上传', standard: '500 MB', pro: '2 GB' },
    { text: '数据行数', local: '不限', private: '不限', cloud: '5千行', standard: '30万行', pro: '200万行' },
    { text: '日活DAU（高峰)', local: false, private: '不限', cloud: '5人/月', standard: '50人/月', pro: '2000人/月' },
   

    { text: '语言大模型', local: '充值', private: '充值', cloud: '1万字', standard: '300万字', pro: '2000万字' },
    { text: 'AI生图', local: '充值', private: '充值', cloud: false, standard: '20张', pro: '100张' },
    { text: '内容安全过滤', local: false, private: '充值', cloud: '系统过滤', standard: '系统及自定义过滤', pro: '系统及自定义过滤' },


    { text: '公开互联网', local: false, private: '需备案', cloud: false, standard: true, pro: true },
    { text: 'SEO优化', local: false, private: true, cloud: false, standard: true, pro: true },

    { text: '支持API', local: false, private: true, cloud: false, standard: true, pro: true },
    { text: '社区支持', local: true, private: true, cloud: false, standard: true, pro: true },
    { text: '二级域名', local: false, private: false, cloud: false, standard: true, pro: true },
    { text: '独立域名', local: false, private: '1个', cloud: false, standard: false, pro: '3个' },
    { text: '独立app', local: false, private: false, cloud: false, standard: false, pro: '1个' },
    { text: '商业化运营(变现)', local: false, private: false, cloud: false, standard: false, pro: true },
    { text: '特色功能优先体验', local: false, private: true, cloud: false, standard: false, pro: true },

]

/**
 * 权益对比
 */
export function EquityView() {

    function rf(g: string | boolean) {
        if (typeof g == 'string') return g;
        if (g) return <img src={CheckImg} className="size-20" alt="" />;
        else return '-'
    }

    return <div className="gap-h-30">
        <h3 className="flex-center shy-site-block-head gap-t-30"><S>权益详细对比</S></h3>
        <div>
            <table className="table ">
                <thead style={{
                    position: 'sticky',
                    top: 56
                }}>
                    <tr>
                        <th></th>
                        <th>本地(免费)</th>
                        <th>私有云(免费)</th>
                        <th>云端(免费)</th>
                        <th>标准版</th>
                        <th>专业版</th>
                    </tr>
                </thead>
                <tbody>
                    {eqs.map((v, i) => <tr key={i}>

                        <td>{v.text}</td>
                        <td>{rf(v.local)}</td>
                        <td>{rf(v.private)}</td>
                        <td>{rf(v.cloud)}</td>
                        <td>{rf(v.standard)}</td>
                        <td>{rf(v.pro)}</td>


                    </tr>)}
                </tbody>
            </table>
        </div>
    </div>
}