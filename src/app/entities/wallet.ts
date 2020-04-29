export class Wallet {

    constructor(address, privateKey, name, avatar, id) {
        this.address = address;
        this.privateKey = privateKey;
        this.name = name;
        this.avatar = avatar;
        this.id = id
    }

    address: string;
    privateKey: string;
    name: string;
    avatar?: string;
    id?: string;
}
