import * as _ from 'underscore';
import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';

export class HlsUtils {

    static inputTimestampFormatter = (timestamp) => {
        if (timestamp === undefined) {
            return undefined;
        }
        return (Utils.isHexStrict(timestamp)) ? ((_.isString(timestamp)) ? timestamp.toLowerCase() : timestamp) : Utils.numberToHex(timestamp);
    }

    static outputReceiveTransactionFormatter = function(tx) {
        tx.remainingRefund = formatters.outputBigNumberFormatter(tx.remainingRefund);
        tx.value = formatters.outputBigNumberFormatter(tx.value);
        tx.gasUsed = formatters.outputBigNumberFormatter(tx.gasUsed);
        tx.isRefund = Boolean(parseInt(tx.isRefund));
        tx.isReceive = Boolean(parseInt(tx.isReceive));
        tx.from = Utils.toChecksumAddress(tx.from);
        if (tx.transactionIndex !== undefined) {
            tx.transactionIndex = Utils.hexToNumber(tx.transactionIndex);
        } else {
            tx.transactionIndex = null;
        }
        if (tx.blockHash === undefined) {
            tx.blockHash = null;
        }
        tx.gasPrice = formatters.outputBigNumberFormatter(tx.gasPrice);
        return tx;
    };

    static outputTransactionFormatter = function(tx) {
        const isReceive = Boolean( parseInt(tx.isReceive) );
        if (isReceive) {
            tx = this.outputReceiveTransactionFormatter(tx);
        } else {
            tx = this.outputSendTransactionFormatter(tx);
        }
        return tx;
    };

}
