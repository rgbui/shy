

var HEXCHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_+=!@#$%^&*(){}[]|?/<>,.;:".split("")

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
    },
    urlParam(name: string) {
        var search = window.location.search;
        // var age = getSearchString('age', search); //结果：18
        // var id = getSearchString('id', search); //结果：2
        //key(需要检索的键） url（传入的需要分割的url地址，例：?id=2&age=18）
        function getSearchString(key, Url) {
            var str = Url;
            str = str.substring(1, str.length); // 获取URL中?之后的字符（去掉第一位的问号）
            // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
            var arr = str.split("&");
            var obj = new Object();
            // 将每一个数组元素以=分隔并赋给obj对象
            for (var i = 0; i < arr.length; i++) {
                var tmp_arr = arr[i].split("=");
                obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
            }
            return obj[key];
        }
        return getSearchString(name, search);
    },
    firstToUpper(word: string) {
        const firstLetter = word.charAt(0);
        const capitalizedWord = firstLetter.toUpperCase() + word.slice(1);
        return capitalizedWord
    },
    arrayMove<T>(arr: T[], item: T, tindex) {
        var index = arr.indexOf(item);
        //如果当前元素在拖动目标位置的下方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置的地方新增一个和当前元素值一样的元素，
        //我们再把数组之前的那个拖动的元素删除掉，所以要len+1
        if (index > tindex) {
            arr.splice(tindex, 0, arr[index]);
            arr.splice(index + 1, 1)
        }
        else {
            //如果当前元素在拖动目标位置的上方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置+1的地方新增一个和当前元素值一样的元素，
            //这时，数组len不变，我们再把数组之前的那个拖动的元素删除掉，下标还是index
            arr.splice(tindex + 1, 0, arr[index]);
            arr.splice(index, 1)
        }
    },
    replaceAll(str:string, search:string, replacement:string) {
        return str.split(search).join(replacement);
    }
}