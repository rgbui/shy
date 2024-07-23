import React from "react";
import { S } from "rich/i18n/view";
import { CheckSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";


var eqs = [

    { group: '基础功能' },

    { text: '文档', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: '数据表', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: '白板', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: 'PPT', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: '频道（即时通信IM)', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: '导入导出', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: '双链', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: '标签', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: '思维导图', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: '空间搜索', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: '协作分享', local: false, private: true, cloud: true, standard: true, pro: true },
    { text: 'AI协作(写作、创作等)', local: true, private: true, cloud: true, standard: true, pro: true },
    { text: 'AI智能搜索', local: true, private: true, cloud: false, standard: true, pro: true },
    { text: 'AI机器人客服', local: false, private: true, cloud: false, standard: true, pro: true },
    { text: '成员管理', local: false, private: true, cloud: false, standard: true, pro: true },
    { text: '应用发布', local: false, private: true, cloud: false, standard: true, pro: true },

    { group: '用量' },
    { text: '协作及访客DAU', local: false, private: '不限', cloud: '5人/日', standard: '50人/日', pro: '1000人/日' },
    { text: '空间存储', local: '不限', private: '不限', cloud: '100M', standard: '20G', pro: '100G' },
    { text: '数据行数', local: '不限', private: '不限', cloud: '5千行', standard: '30万行', pro: '200万行' },
    { text: '单图片上限', local: '不限', private: '不限', cloud: '5M', standard: '20 MB', pro: '50 MB' },
    { text: '单附件上限', local: '不限', private: '不限', cloud: '5M', standard: '500 MB', pro: '2 GB' },
    { text: '单视频上限', local: '不限', private: '不限', cloud: '不支持上传', standard: '500 MB', pro: '2 GB' },


    { text: '语言大模型', local: '充值', private: '充值', cloud: '1万字', standard: '300万字', pro: '2000万字' },
    { text: 'AI生图', local: '充值', private: '充值', cloud: false, standard: '20张', pro: '100张' },
    { text: '内容安全过滤', local: false, private: '充值', cloud: '系统过滤', standard: '系统及自定义过滤', pro: '系统及自定义过滤' },

    { group: "高级功能" },

    { text: '公开互联网', local: false, private: '需备案', cloud: false, standard: true, pro: true },
    { text: 'SEO优化', local: false, private: true, cloud: false, standard: true, pro: true },

    { text: '支持API', local: false, private: true, cloud: false, standard: true, pro: true },
    { text: '社区支持', local: true, private: true, cloud: false, standard: true, pro: true },
    { text: '二级域名', local: false, private: false, cloud: false, standard: '2个', pro: '5个' },
    { text: '独立域名', local: false, private: '1个', cloud: false, standard: false, pro: '3个' },
    { text: '独立app', local: false, private: false, cloud: false, standard: false, pro: '1个' },
    { text: '商业化运营', local: false, private: true, cloud: false, standard: false, pro: true },
    { text: '特色功能优先体验', local: false, private: true, cloud: false, standard: false, pro: true },

]

/**
 * 权益对比
 */
export function EquityView(props: { top?: number }) {

    function rf(g: string | boolean) {
        if (typeof g == 'string') return g;
        if (g) return <div className="flex-center">
            <Icon size={16} icon={CheckSvg}></Icon>
            {/* <img src={CheckImg} className="size-20" alt="" /> */}
        </div>;
        else return '-'
    }

    return <div className="gap-h-30">
        <h3 className="flex-center shy-site-block-head gap-t-30"><S>权益详细对比</S></h3>
        <div>
            <table className="table ">
                <thead style={{
                    position: 'sticky',
                    top: typeof props.top == 'number' ? props.top : 56
                }}>
                    <tr>
                        <th></th>
                        <th>本地(免费)</th>
                        <th>私有云(免费)</th>
                        <th>云端(免费)</th>
                        <th>个人版</th>
                        <th>协作版</th>
                    </tr>
                </thead>
                <tbody>
                    {eqs.map((v, i) => {
                        if (v.group) return <tr key={i}>
                            <td colSpan={6} className="gap-t-30 ">
                                <div className="flex remark">{v.group}</div>
                            </td>
                        </tr>
                        return <tr key={i}>

                            <td><div className="flex flex-end">{v.text}</div></td>
                            <td>{rf(v.local)}</td>
                            <td>{rf(v.private)}</td>
                            <td>{rf(v.cloud)}</td>
                            <td>{rf(v.standard)}</td>
                            <td>{rf(v.pro)}</td>


                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    </div>
}