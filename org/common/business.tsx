import React from "react";
export function PubBusinessView() {
    return <div>

        <h3 className="flex-center shy-site-block-head"  >
            <span className="bold">
                诗云 陪你 一起做好小生意
            </span>
        </h3>

        <div className="flex-center gap-h-20 remark f-20 l-24">
            从知识管理到数字化运营，笔记软件集组织、同步、编辑、分享、个性化于一体，让你的生意更灵活
        </div>

        <div className="flex-center-full   flex-auto-mobile-wrap r-gap-b-20 col-3-g20">

            <div className="shy-site-block-card padding-20 box-border">
                <div className="flex-center">
                    <img style={{
                        width: 100
                    }} src='static/img/customer.png' />
                </div>
                <h4 className="f-24 gap-h-15 flex-center" >低成本</h4>
                <p className="f-16 text-1 l-24">
                    无需采购软件或IT投入
                    <br />
                    从店铺创建、客户服务到内容营销，一站式全面解决
                </p>
            </div>

            <div className="shy-site-block-card  padding-20 box-border">
                <div className="flex-center"><img style={{
                    width: 100
                }} src='static/img/book.png' /></div>
                <h4 className="f-24 gap-h-15 flex-center">持续经营</h4>
                <p className="f-16 text-1  l-24">
                    社区化运营，实时互动，个性化IP服务
                    <br />
                    把顾客变成终身客户，实现可持续增长
                </p>
            </div>

            <div className="shy-site-block-card  padding-20 box-border">
                <div className="flex-center"><img style={{
                    width: 100
                }} src='static/img/nimble.png' /></div>
                <h4 className="f-24 gap-h-15 flex-center">灵活应变</h4>
                <p className="f-16 text-1  l-24">
                    笔记软件的多样化表达，可以让你随时调整产品、价格、营销策略。
                    <br />随时按需添加新业务板块
                </p>
            </div>

        </div>

    </div>
}