import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as superagent from 'superagent';
import bcrypt from 'bcryptjs';
import { ErrorServer } from '../entities/errorServer';


@Injectable({
    providedIn: 'root'
})
export class HeliosServersideService {

    serverUrl: string;
    saltRounds: number;
    superagent: any;
    useLocalStorage: boolean;
    queryResponseTimeout: number;
    queryResponseDeadline: number;
    sessionHash: any;
    username: any;

 constructor() {
    this.serverUrl = 'https://heliosprotocol.io/wallet-serverside/';
    this.saltRounds = 11;
    this.superagent = superagent.agent();
    this.useLocalStorage = false;
    this.queryResponseTimeout = 4000; // Time till server responds
    this.queryResponseDeadline = 8000; // Allowed time for page to load
  }

    /**
     * Gets online wallets
     * @returns  Object or boolean
     */
    async getOnlineWallets(username, sessionHash) {
        console.log('Getting online wallets');
        const query = { action: 'get_wallets', username, session_hash: sessionHash };
        return await this.queryServer(query);
    }

    /**
     * Adds online wallet
     * @param keystore string
     * @param name string
     * @returns  Object
     */
    async addOnlineWallet(keystore, name, storageUser,importedWallet) {
        const query = {
            action: 'add_keystore',
            username: storageUser.userName,
            session_hash: storageUser.sessionHash,
            keystore: ( importedWallet ? keystore : JSON.stringify(keystore) ),
            wallet_name: name
        };
        return await this.queryServer(query);
    }

/**
 * Renames online wallet
 * @param walletId number
 * @param previousWalletName string
 * @param newWalletName string
 * @returns  Object or boolean
 */
async renameOnlineWallet(walletId, previousWalletName, newWalletName, username, sessionHash) {
    console.log('Renaming online wallet');
    const query = {action: 'rename_keystore',
            username,
            session_hash: sessionHash,
            wallet_id: walletId,
            previous_wallet_name: previousWalletName,
            new_wallet_name: newWalletName};
    return await this.queryServer(query);
}

/**
 * Deletes online wallet
 * @param id number
 * @param name string
 * @returns  Object or boolean
 */
async deleteOnlineWallet(id, name, username, sessionHash) {
    console.log('Deleting online wallet');
    const query = {action: 'delete_keystore',
        username: username,
        session_hash: sessionHash,
        wallet_id: id,
        wallet_name: name};
    return await this.queryServer(query);
}

/**
 * Gets contacts
 * @returns  Object or boolean
 */
async getContacts(username, sessionHash) {
    console.log('Getting contacts');
    const query = {action: 'get_contacts', username, session_hash: sessionHash};
    return await this.queryServer(query);
}

/**
 * Gets new2 fasecret
 * @returns  Object or boolean
 */
async getNew2FASecret(username, sessionHash) {
    console.log('Getting new 2FA secret');
    const query = {action: 'get_new_2fa_secret', 
    username,
    session_hash: sessionHash};
    return await this.queryServer(query);
}
/**
 * Is2s faenabled
 * @returns  Object or boolean
 */
async is2FAEnabled(username, sessionHash) {
      const query = {action: 'is_2fa_enabled',
      username,
      session_hash: sessionHash};
      return await this.queryServer(query);
}

/**
 * Delete2s fasecret
 * @returns  Object or boolean
 */
async delete2FASecret(username, sessionHash) {
    console.log('Deleting 2FA secret');
    const query = {action: 'delete_2fa_secret',
    username,
    session_hash: sessionHash};
    return await this.queryServer(query);
}

/**
 * Save2s fasecret
 * @param secret string
 * @param code number
 * @returns  Object or boolean
 */
async save2FASecret(secret, code, username, sessionHash) {
    console.log('Saving 2FA secret');
    const query = {action: 'save_new_2fa_secret',
    secret,
    code,
    username, 
    session_hash: sessionHash};
    return await this.queryServer(query);
}

/**
 * Adds contact
 * @param contactName string
 * @param contactAddress string
 * @returns  Object or boolean
 */
async addContact(contactName, contactAddress , username, sessionHash) {
    console.log('Adding contacts');
    const query = {action: 'add_contact',
            username,
            session_hash: sessionHash,
            contact_name: contactName,
            contact_address: contactAddress};
    return await this.queryServer(query);
}

/**
 * Deletes contact
 * @param id number
 * @returns  Object or boolean
 */
async deleteContact(id, username, sessionHash) {
    console.log('Deleting contact');
    const query = {action: 'delete_contact',
        username,
        session_hash: sessionHash,
        contact_id: id};
    return await this.queryServer(query);
}

    /**
     * Signs in
     * @param username string
     * @param password string
     * @param tfaCode string
     * @returns  Object
     */
    async signIn(username, password, tfaCode) {
        const query = { action: 'get_salt', username };
        const saltResponse = await this.queryServer(query);
        const passwordHashForVerification = bcrypt.hashSync(password, saltResponse.salt);

        const newSalt = bcrypt.genSaltSync(this.saltRounds);
        const newPasswordHash = bcrypt.hashSync(password, newSalt);

        const querySignIn = {
            action: 'sign_in',
            username,
            two_factor_code: tfaCode,
            password_hash_for_verification: passwordHashForVerification,
            new_password_hash: newPasswordHash,
            new_salt: newSalt
        };
        const response = await this.queryServer(querySignIn);
        /* if ('sessionHash' in response) {
            this.saveSession(response.sessionHash, username);
        } */
        return response;
    }

    /**
     * News user
     * @param username string
     * @param email string
     * @param password string
     * @param newWalletKeystore string
     * @returns  Object
     */
    async newUser(username, email, password, newWalletKeystore) {
        const salt = bcrypt.genSaltSync(this.saltRounds);
        const passwordHash = bcrypt.hashSync(password, salt);
        const query = {
            action: 'new_user',
            username,
            email,
            password_hash: passwordHash,
            salt,
            new_wallet_keystore: JSON.stringify(newWalletKeystore)
        };
        return await this.queryServer(query);
    }

    /**
     * Querys server
     * @param query string
     * @returns Object
     */
    async queryServer(query) {
        console.log(query);
        return await superagent.get(this.serverUrl)
            .timeout({
                response: this.queryResponseTimeout,
                deadline: this.queryResponseDeadline,
            })
            .query(query)
            .then(res => {
                let jsonResponse;
                try {
                    jsonResponse = JSON.parse(res.text);
                } catch (e) {
                    throw new Error(`Malformed JSON Response ${res.status}, ${res.text}`);
                }
                console.log('Successful response from server');
                console.log(jsonResponse);
                // check for invalid session
                if ('error' in jsonResponse) {
                    if (jsonResponse.error === 2020) {
                        throw new ErrorServer(jsonResponse.error, 'Your session has expired. Please log in again to continue.');
                    } else {
                        throw new ErrorServer(jsonResponse.error, jsonResponse.error_description);
                    }
                }
                return jsonResponse;

            })
            .catch(err => {
                if (err.error === undefined || err.errorDescription === undefined) {
                    throw new ErrorServer(err.errno, err.message);

                } else {
                    throw new ErrorServer(err.error, err.errorDescription);
                }
            });
    }
}
