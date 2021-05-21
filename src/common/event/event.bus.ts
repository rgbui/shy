
import { EventName } from "./event.name";
import { PageItem } from "../../solution/item/item";
import { PageItemMenuType } from "../../solution/extensions/menu";

export class EventBus {
    private _events: { name: EventName, fn: (...args: any[]) => any }[] = [];
    on(name: EventName, fn: (...args: any[]) => any) {
        this._events.push({ name, fn });
    }
    off(name: EventName | ((...args: any[]) => any), fn?: (...args: any[]) => any) {
        if (typeof name == 'function') this._events.removeAll(g => g.fn == name)
        else if (typeof name == 'number') {
            if (typeof fn == 'function') this._events.removeAll(g => g.name == name && g.fn == fn)
            else this._events.removeAll(g => g.name == name)
        }
    }
    emit(name: EventName, ...args: any[]) {
        var evs = this._events.findAll(g => g.name == name);
        if (evs.length > 0) {
            var rs = [];
            for (let i = 0; i < evs.length; i++) {
                try {
                    var r = evs[i].fn.apply(this, args);
                    rs.push(r);
                }
                catch (ex) {
                    console.error(`happend error emit ${EventName[name]}`, ex);
                }
            }
            if (evs.length == 1) return rs.first()
            else return rs;
        }
    }
    exists(name: EventName | ((...args: any[]) => any), fn?: (...args: any[]) => any) {
        if (typeof name == 'function') return this._events.exists(g => g.fn == name)
        else if (typeof name == 'number') {
            if (typeof fn == 'function') return this._events.exists(g => g.name == name && g.fn == fn)
            else return this._events.exists(g => g.name == name)
        }
    }
}
export interface EventBus {
    on(name: EventName.selectPageItem, fn: (item: PageItem, event: MouseEvent) => void);
    emit(name: EventName.selectPageItem, item: PageItem, event: MouseEvent);
    on(name: EventName.selectPageItemMenu, fn: (item: PageItem, menuItem: PageItemMenuType, event: MouseEvent) => void);
    emit(name: EventName.selectPageItemMenu, item: PageItem, menuItem: PageItemMenuType, event: MouseEvent);
}
export var eventBus = new EventBus();