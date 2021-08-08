import { LangProvider } from "rich/i18n/lib/provider";
import { AppLang } from "./enum";
export var appLangProvider = new LangProvider<AppLang>('app');
appLangProvider.register(async (lang) => {
    var data: any = {};
    switch (lang) {
        case 'en':
            data = await import('./lang/en');
            break;
        case 'zh':
            data = await import('./lang/zh');
            break;
    }
    if (typeof data.default != 'undefined')
        return data.default;
})
