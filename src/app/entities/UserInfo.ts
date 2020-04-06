import { KeyStore } from './KeyStore';

export class UserInfo {

    constructor(success, keystores, sessionHash, twoFaEnabled) {
        this.success = success;
        this.keystores = keystores;
        this.sessionHash = sessionHash;
        this.twoFaEnabled = twoFaEnabled;
    }

    success: boolean;
    keystores: KeyStore[];
    sessionHash: string;
    twoFaEnabled: boolean;

}
