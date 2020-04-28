export class UserInfo {

    constructor(sessionHash, twoFaEnabled, userName) {
        this.sessionHash = sessionHash;
        this.twoFaEnabled = twoFaEnabled;
        this.userName = userName;
    }

    sessionHash: string;
    twoFaEnabled: boolean;
    userName: string;

}
