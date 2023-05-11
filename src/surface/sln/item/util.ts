import { PageLayoutType } from "rich/src/page/declare";
import { PageItem } from ".";
import { ElementType, getElementUrl } from "rich/net/element.type";

export function getPageItemElementUrl(item: PageItem) {
    if (item.pageType == PageLayoutType.db) {
        return getElementUrl(ElementType.Schema, item.id);
    }
    else if (item.pageType == PageLayoutType.doc || item.pageType == PageLayoutType.board || item.pageType == PageLayoutType.docCard) {
        return getElementUrl(ElementType.PageItem, item.id);
    }
    else if (item.pageType == PageLayoutType.dbView) {
        return getElementUrl(ElementType.SchemaView, item.parentId, item.id);
    }
    else if (item.pageType == PageLayoutType.dbForm) {
        return getElementUrl(ElementType.SchemaRecordView, item.parentId, item.id);
    }
    else if (item.pageType == PageLayoutType.textChannel) {
        return getElementUrl(ElementType.Room, item.id);
    }
}