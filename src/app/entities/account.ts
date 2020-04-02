import { Wallet } from './wallet';

export class Account {

    constructor(account, encrypt) {
        this.account = account;
        this.encrypt = encrypt;

    }

    account: Wallet;
    encrypt: any;
}
