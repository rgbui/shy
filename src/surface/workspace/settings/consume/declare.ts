import { WsConsumeType } from "rich/net/ai/cost";
export type WsCostRecord = {
    creater: string,
    createDate: Date,
    size: number,
    title?: string,
    description?: string,
    consumeType: WsConsumeType,
    wsId: string
}
export class WsCost {
   
    public id: string;
  
    public createDate: Date;
   
    public workspaceId: string;

    
    public consumeType: WsConsumeType;

   
    public cost: number


    
    public details: WsCostRecord[]

   
    public checkCost: boolean;

 
    public deleted: boolean;
   
    public deletedDate: Date;
   
    public deletedUser: string
}
