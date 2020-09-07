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
        //console.log('secret setOnly' , secret );
        const valueJSON = this.encryptVal(value, secret);
        if ( this.isExtension() ) {
            //console.log('objeto encrypt set chrome', {[this.encrypt(key, secret)]: valueJSON});
            chrome.storage.local.set({[this.encrypt(key, secret)]: valueJSON}, function() {
                //
            });
        } else {
            sessionStorage.setItem( key, valueJSON);
        }
    }

    async getStorage( key: string, secret: string ) {
        try {
            // console.log('key que se va a buscar chrome', this.encrypt( key , secret ));
            let property;
            if ( this.isExtension() ) {
                property = await new Promise((resolve, reject) => {
                    chrome.storage.local.get(this.encrypt( key , secret ), function(result) {
                        // console.log('objeto del get', result);
                        resolve ( result ) ;
                    });
                });
            } else {
                property = sessionStorage.getItem( key );
            }
            if ( JSON.stringify(property) === '{}' || property === null ) {
                return null;
            } else {
                let getObject;
                if ( this.isExtension() ) {
                    const propertyValue = this.encrypt( key, secret );
                    getObject = this.decrypt( property[propertyValue] , secret );
                } else {
                    getObject = this.decrypt( property , secret );
                }
                return getObject;
            }
        } catch (error) {
            console.log(error);
            throw new Error('Failed to get storage!');
        }
    }

    clearStorage() {
        if( this.isExtension() ) {
            chrome.storage.local.clear( function() {
                let error = chrome.runtime.lastError;
                if (error) {
                    console.error(error);
                    throw new Error('Failed to clear storage!');
                }
            });
        } else {
            sessionStorage.clear();
        }
    }

    generateHash( password: any ) {
        const newSalt = bcrypt.genSaltSync(this.saltRounds);
        const newPasswordHash = bcrypt.hashSync(password, newSalt);
        return newPasswordHash;
    }

    async getSecret(){
        let displayInfo;
        if( this.isExtension() ) {
            displayInfo = await new Promise((resolve, reject) => {
                chrome.system.display.getInfo(function(display) {
                    resolve( display[0].id );
                });
            });
        } else {
            displayInfo = 'test';
        }
        const secret = cryptoJs.SHA256(JSON.stringify(displayInfo)).toString();
        return secret;
    }

    isExtension () {
        if ( chrome.system == undefined && chrome.storage == undefined ) {
            return false;
        } else {
            return true;
        }
    }
}