
export class PageItem {
    id: string;
    childs?: PageItem[];
    text: string;
    spread?: boolean
}
export class Workspace {
    id: string;
    title: string;
    profile_photo: string;
    items: PageItem[]
}