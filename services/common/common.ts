import { query } from "rich/net/annotation";



class CommonService {
    @query('/amap/key_pair')
    amapKeyPair() {
        return {
            key: AMAP_KEY,
            pair: AMAP_PAIR
        }
    }
}