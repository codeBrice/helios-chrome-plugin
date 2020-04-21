export class Wallet {

    constructor(address, privateKey, name, avatar) {
        this.address = address;
        this.privateKey = privateKey;
        this.name = name;
        this.avatar = avatar;
    }

    address: string;
    privateKey: string;
    name: string;
    avatar?: string;
}
