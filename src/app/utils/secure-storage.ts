import cryptoJs from 'crypto-js';
import { Storage } from '@ionic/storage';
import bcrypt from 'bcryptjs';

export class SecureStorage {
    saltRounds: number;
    memory: object;

    constructor ( private storage: Storage ) {
        this.saltRounds = 11;
    }

    encrypt( data: Object , secret: string ) {
        return cryptoJs.SHA256(JSON.stringify(data), secret).toString();
    }

    encryptVal(data: Object , secret: string) {
        return cryptoJs.AES.encrypt(JSON.stringify(data), secret).toString();
    }

    decrypt(data: string, secret: string) {
        let bytes = cryptoJs.AES.decrypt(data, secret);
        if ( bytes ) {
            return JSON.parse(bytes.toString(cryptoJs.enc.Utf8));
        } else {
            return null;
        }
    }

    async setStorage( key: string , value: Object, secret: string) {
        console.log('secret setOnly' , secret );
        const valueJSON = this.encryptVal(value, secret);
        if ( chrome.storage !== undefined ) {
            console.log('objeto encrypt set chrome', {[this.encrypt(key, secret)]: valueJSON});
            chrome.storage.local.set({[this.encrypt(key, secret)]: valueJSON}, function() {
                //
            });
        } else {
            this.storage.set( this.encrypt(key, secret), this.encryptVal(valueJSON, secret) );
        }
    }

    async getStorage( key: string, secret: string ) {
        try {
            if ( chrome.storage !== undefined ) {
                //console.log('key que se va a buscar chrome', this.encrypt( key , secret ));
                const property = await new Promise((resolve, reject) => {
                    chrome.storage.local.get(this.encrypt( key , secret ), function(result) {
                        //console.log('objeto del get', result);
                        resolve ( result ) ;
                    });
                });
                const propertyValue = this.encrypt( key, secret );
                const getObject = this.decrypt( property[propertyValue] , secret );
                return getObject;
            } else {
                const storage = await this.storage.get( this.encrypt( key , secret ) );
                //console.log( 'obteniendo storage',storage );
                return storage;
            }
        } catch (error) {
            console.log(error);
            throw new Error('Failed to get storage!');
        }
    }

    generateHash( password: any ) {
        const newSalt = bcrypt.genSaltSync(this.saltRounds);
        const newPasswordHash = bcrypt.hashSync(password, newSalt);
        return newPasswordHash;
    }

    async getDisplayInfo(){
        return await new Promise((resolve, reject) => {
            chrome.system.display.getInfo(function(display) {
                //console.log( 'memory en funcion que retorna', cpu);
                resolve( display[0].id );
            });
        });
    }
}