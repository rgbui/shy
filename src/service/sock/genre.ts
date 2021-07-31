
/**
 * 数据传输的一致性
 * 主要是json序列化日期，导致其数据类型丢失
 * 其它的数据类型暂无需特定的转换
 */
 export var GenreConsistency = {
    parse(json: any) {
        if (Array.isArray(json)) {
            json.forEach(j => this.parse(j))
        }
        else if (json === null || typeof json === 'undefined') {
            return json;
        }
        else if (typeof json == 'object') {
            for (let m in json) {
                if (m.endsWith('<Date>')) {
                    json[m.replace('<Date>', '')] = new Date(json[m]);
                    delete json[m];
                }
                else if (m.endsWith('<Function>')) {
                    json[m.replace('<Function>', '')] = eval('(' + json[m] + ')')
                    delete json[m];
                }
                else if (m.endsWith("<Regex>")) {
                    json[m.replace('<Regex>', '')] = new RegExp(json[m]);
                    delete json[m];
                }
                else if (Array.isArray(json[m])) {
                    this.parse(json[m])
                }
                else if (json[m] && typeof json[m] == 'object') {
                    this.parse(json[m])
                }
            }
        }
    },
    transform(json: any) {
        if (Array.isArray(json)) {
            json.forEach(j => this.transform(j))
        }
        else if (json === null || typeof json === 'undefined') {

        }
        else if (typeof json == 'object') {
            for (let m in json) {
                if (json[m] instanceof Date) {
                    json[m + "<Date>"] = json[m].getTime();
                    delete json[m];
                }
                else if (typeof json[m] == 'function') {
                    json[m + "<Function>"] = json[m].toString();
                    delete json[m];
                }
                else if (json[m] instanceof RegExp) {
                    json[m + "<Regex>"] = json[m].toString();
                    delete json[m];
                }
                else if (Array.isArray(json[m])) {
                    this.transform(json[m])
                }
                else if (json[m] && typeof json[m] == 'object') {
                    this.transform(json[m])
                }
            }
        }
    }
}
