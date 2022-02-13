import { query } from "rich/net/annotation";
import { config } from "../../src/common/config";



class CommonService {
    @query('/amap/key_pair')
    amapKeyPair() {
        return {
            key: AMAP_KEY,
            pair: AMAP_PAIR
        }
    }
    @query('/guid')
    getGuid(){
        return config.guid();
    }
}