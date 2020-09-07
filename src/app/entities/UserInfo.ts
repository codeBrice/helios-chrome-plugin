export class UserInfo {

    constructor(sessionHash, twoFaEnabled, userName, password ) {
        this.sessionHash = sessionHash;
        this.twoFaEnabled = twoFaEnabled;
        this.userName = userName;
        this.password = password;
    }

    sessionHash: string;
    twoFaEnabled: boolean;
    userName: string;
    password: string;
}
