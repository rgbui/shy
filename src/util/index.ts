

export var util = {

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
    }
}