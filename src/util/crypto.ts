import CryptoJS from "crypto-js";
// AES加密 第一个参数为需要加密的内容，第二个参数为秘钥 
const secretKey = ['s', 'h', 'y', '.', 'l', 'i', 'v', 'e'].slice(2, 4).join("");
export var Aes = {
    encrypt(text: string) {
        return CryptoJS.AES.encrypt(text, secretKey).toString();
    },
    decrypt(text: string) {
        return CryptoJS.AES.decrypt(text, secretKey).toString(CryptoJS.enc.Utf8);
    }
}