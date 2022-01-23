import { ResourceArguments } from "rich/extensions/icon/declare";
import { BaseService } from "./base";
import { masterSock } from "../net/sock";

class WorkspaceMemberService extends BaseService {
    async isInvite(invite: string, userid: string) {
        return await masterSock.get<{ memeber?: boolean, icon?: ResourceArguments, text?: string, sn?: number, customizeSecondDomain?: string, id?: string }>('/ws/invite/me', { invite, userid });
    }
    async inviteJoin(wsId: string) {
        return await masterSock.post('/ws/invite/join', { wsId })
    }
    async deleteMember(wsId: string, userid: string) {
        return await masterSock.delete('/ws/delete/member/:userid', { wsId, userid })
    }
    async customDomainWorkspace(wsId: string, domain: string) {
        return await masterSock.post<{ notYetDue?: boolean }>('/ws/custom/domain', { wsId, domain });
    }
    async setMember(wsId: string, userid: string, props: Record<string, any>) {
        return await masterSock.post('/ws/set/member', { wsId, userid, props });
    }
}
export var memberWorkspaceService = new WorkspaceMemberService();