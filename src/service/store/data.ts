
export var data = {
    url: '/page',
    views: [
        {
            url: '/view',
            blocks: {
                childs: [
                    {
                        url: '/row',
                        blocks: {
                            childs: [
                                { url: '/textspan', content: '你还好吗\n\n大师，换行' },
                                { url: '/textspan', content: '我是你邻居' }
                            ]
                        }
                    },
                    {
                        url: '/row',
                        blocks: {
                            childs: [
                                {
                                    url: '/textspan',
                                    blocks: {
                                        childs: [
                                            { url: '/text', content: '你就这样' },
                                            { url: '/text', content: '我就这样喽' }]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        url: '/row',
                        blocks: {
                            childs: [
                                {
                                    url: '/textspan',
                                    content: ''
                                }
                            ]
                        }
                    },
                    {
                        url: '/row',
                        blocks: {
                            childs: [
                                { url: '/head', content: '大标题' }
                            ]
                        }
                    },
                    {
                        url: "/row",
                        blocks: {
                            childs: [
                                { url: '/todo', content: '我可以选择吗', checked: true }
                            ]
                        }
                    },
                    {
                        url: '/row',
                        blocks: {
                            childs: [{
                                url: '/image',
                                widthPercent: 50,
                                src: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201508%2F10%2F20150810150356_hnves.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614066907&t=93f1dfde3d75b35f1153af1eda01e314'
                            }]
                        }
                    },
                    {
                        url: '/row',
                        blocks: {
                            childs: [
                                {
                                    url: '/table/store',
                                    cols: [{ name: 's1', width: 50 }, { name: 's2', width: 50 }],
                                    meta: {
                                        cols: [
                                            { name: 's1', text: '姓名', type: 'string' },
                                            { name: 's2', text: "年龄", type: 'number' }]
                                    },
                                    data: [{ s1: "阚海", s2: 32 }, { s1: '', s2: 24 }]
                                }
                            ]
                        }
                    },
                    {
                        url: '/row',
                        blocks: {
                            childs: [{ url: '/katex', formula: "c = \\pm\\sqrt{a^2 + b^2}" }]
                        }
                    },
                    {
                        url: "/row",
                        blocks: {
                            childs: [{
                                url: '/table',
                                cols: [{ width: 100 }, { width: 100 }, { width: 200 }],
                                blocks: {
                                    childs: [
                                        {
                                            url: '/table/row', blocks: {
                                                childs: [
                                                    {
                                                        url: "/table/cell",
                                                        blocks: {
                                                            childs: [
                                                                {
                                                                    url: '/row',
                                                                    blocks: {
                                                                        childs: [{ url: '/textspan', content: "子内容。\n。。。。" }]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        url: "/table/cell",
                                                        blocks: {
                                                            childs: [
                                                                {
                                                                    url: '/row',
                                                                    blocks: {
                                                                        childs: [{ url: '/textspan', content: "子内容。\n。。。。" }]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        url: "/table/cell",
                                                        blocks: {
                                                            childs: [
                                                                {
                                                                    url: '/row',
                                                                    blocks: {
                                                                        childs: [{ url: '/textspan', content: "子内容。\n。。。。" }]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            url: '/table/row', blocks: {
                                                childs: [
                                                    {
                                                        url: "/table/cell",
                                                        blocks: {
                                                            childs: [
                                                                {
                                                                    url: '/row',
                                                                    blocks: {
                                                                        childs: [{ url: '/textspan', content: "子内容。\n。。。。" }]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        url: "/table/cell",
                                                        blocks: {
                                                            childs: [
                                                                {
                                                                    url: '/row',
                                                                    blocks: {
                                                                        childs: [{ url: '/textspan', content: "子内容。\n。。。。" }]
                                                                    }
                                                                }
                                                            ]
                                                        },
                                                        colspan: 2
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            url: '/table/row', blocks: {
                                                childs: [
                                                    {
                                                        url: "/table/cell",
                                                        blocks: {
                                                            childs: [
                                                                {
                                                                    url: '/row',
                                                                    blocks: {
                                                                        childs: [{ url: '/textspan', content: "子内容。\n。。。。" }]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        url: "/table/cell",
                                                        blocks: {
                                                            childs: [
                                                                {
                                                                    url: '/row',
                                                                    blocks: {
                                                                        childs: [{ url: '/textspan', content: "子内容。\n。。。。" }]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        url: "/table/cell",
                                                        blocks: {
                                                            childs: [
                                                                {
                                                                    url: '/row',
                                                                    blocks: {
                                                                        childs: [{ url: '/textspan', content: "子内容。\n。。。。" }]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }]
                        }
                    },
                    {
                        url: '/row',
                        blocks: {
                            childs: [
                                {
                                    url: '/code',
                                    code: 'var d="ssss";'
                                }
                            ]
                        }
                    },
                    {
                        url: '/row',
                        blocks: {
                            childs: [
                                {
                                    url: '/list',
                                    blocks: {
                                        childs: [{ url: '/list/text', content: '选项1' }],
                                        subChilds: [
                                            {
                                                url: '/col',
                                                blocks: {
                                                    childs: [
                                                        {
                                                            url: '/row',
                                                            blocks: {
                                                                childs: [{ url: '/textspan', content: "子内容。。。。。" }]
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }]
                        }
                    }
                ]
            }
        }
    ]
}
export var defaultPageData = {
    url: '/page',
    views: [
        {
            url: '/view',
            blocks: {
                childs: [
                    {
                        url: '/row',
                        blocks: {
                            childs: [
                                { url: '/textspan', content: '你还好吗\n\n大师，换行' },
                                { url: '/textspan', content: '我是你邻居' }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}

export var workspaceDefaultData = {
    profile_photo: 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2Fd84aa9f4-1aaf-4547-8273-ba1129f7b675%2F109951163041428408.jpg?table=space&id=37659cc5-3ed0-4375-9a9d-ce77379a49ff&width=40&userId=3c8f21e7-4d95-4ff1-a44b-3a82c3a8098e&cache=v2',
    title: '我的空间',
    modules: [
        {
            text: '我的页面',
            type: 'pages',
            items: [
                { id: 'kankankan', text: '测试页面', mime: 1 },
                { id: 'kankanTes', text: '测试页面', mime: 1 },
                { id: 'kankanTe', text: '测试页面', mime: 1 }
            ]
        }
    ]
}