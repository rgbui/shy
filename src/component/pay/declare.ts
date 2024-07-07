

export type ShyOrderInfo={
    kind: 'fill' | 'meal-1' | 'meal-2',
    subject: string,
    body: string,
    price: number,
    count: number,
    amount: number,
    rate: number,
    free: number,
    platform: 'alipay' | 'weixin',
    sockId?:string,
    id?:string,
    orderId?:string
}