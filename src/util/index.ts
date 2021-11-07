import { log } from "../common/log";

var HEXCHARS = "0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_+=!@#$%^&*(){}[]|?/<>,.;:".split("")

export var ShyUtil = {

    /**
     * 将扁平的数组转成一棵树
     * @param data 
     * @param id 
     * @param parentId 
     * @param childsKey 
     * @returns 
     */
    flatArrayConvertTree<T>(data: T[], id: string = 'id', parentId: string = 'parentId', childsKey: string = 'childs') {
        var rs: T[] = [];
        data.each(da => {
            if (da[parentId]) {
                var pa = data.find(g => g[id] == da[parentId]);
                if (pa) {
                    if (!Array.isArray(pa[childsKey])) pa[childsKey] = [];
                    pa[childsKey].push(da);
                    rs.push(da);
                }
            }
        })
        return data.findAll(g => !rs.exists(r => r == g));
    },
    hexadecimalConversion(hex: number, number: number, defineChars?: string[]) {
        var chars = (defineChars ? defineChars : HEXCHARS).slice(0, hex);
        if (number == 0) { return chars.first() };
        var n = number;
        var s = '';
        while (n > 0) {
            var m = n % hex;
            if (typeof chars[m] == 'undefined') {
                console.error({ chars, m, n, hex, number })
            }
            s = chars[m] + s;
            n = (n - m) / hex;
        }
        return s;
    }
}