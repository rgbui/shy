export enum SlnDirective {
    addSubPageItem,
    removePageItem,
    updatePageItem,
    toggleModule,
    togglePageItem,
    openItem
}


export enum Mime {
    page = 10,
    pages = 20,
    favourite = 30,
    trash = 40,
    import = 50,
    inbox = 60,
    table = 70,
    files = 80,
    template = 90,
    chatroom = 100
}

export enum PageItemDirective {
    copy,
    remove,
    rename,
    link,
    cut
}
