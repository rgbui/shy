import Big from 'big.js';

export const Price = {
    //加法
    add(arg1, arg2) {
        const num1 = (new Big(arg1)).plus(arg2)
        return parseFloat(num1.toString());
    },
    //减法
    sub(arg1, arg2) {
        const num1 = (new Big(arg1)).minus(arg2)
        return parseFloat(num1.toString());
    },
    /**
     * 乘法
     * @param arg1 
     * @param arg2 
     * @returns 
     */
    mul(arg1, arg2) {
        const num1 = (new Big(arg1)).times(arg2)
        return parseFloat(num1.toString());
    },
    /**
     * 除法
     * @param arg1 
     * @param arg2 
     * @returns 
     */
    div(arg1, arg2) {
        const num1 = (new Big(arg1)).div(arg2)
        return parseFloat(num1.toString());
    },
    toFixed(price:number,dig=2) {
        return new Big(dig).toFixed(dig);
    }
}
