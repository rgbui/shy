import { PageView } from "./view";
import { PagesView } from "./views/pages";
import { PageItemView } from "./views/view";


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

export function getMimeViewComponent(mime: Mime): typeof PageView {
    switch (mime) {
        case Mime.page:
            return PageItemView;
        case Mime.pages:
            return PagesView;
        default:
            return PageItemView;
    }
}