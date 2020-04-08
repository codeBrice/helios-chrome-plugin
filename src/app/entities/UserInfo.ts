import { KeyStore } from './KeyStore';

export class UserInfo {

    constructor(keystores, sessionHash, twoFaEnabled, userName) {
        this.keystores = keystores;
        this.sessionHash = sessionHash;
        this.twoFaEnabled = twoFaEnabled;
        this.userName = userName;
    }

    keystores: KeyStore[];
    sessionHash: string;
    twoFaEnabled: boolean;
    userName: string;

}
