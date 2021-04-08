

export enum UserStatus {
    busy,
    online,
    offline
}

export class User {
    id: string;
    profile_photo: string;
    account: string;
    status: UserStatus
}