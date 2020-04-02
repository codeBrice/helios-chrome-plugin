export class Wallet {

    constructor(address, privateKey) {
        this.address = address;
        this.privateKey = privateKey;
    }

    address: string;
    privateKey: string;
}
