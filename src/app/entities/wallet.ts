export class Wallet {

    constructor(address, privateKey, name) {
        this.address = address;
        this.privateKey = privateKey;
        this.name = name;
    }

    address: string;
    privateKey: string;
    name: string;
}
