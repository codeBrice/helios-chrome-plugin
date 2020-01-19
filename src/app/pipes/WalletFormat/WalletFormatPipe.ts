import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'walletformat'})
export class WalletFormatPipe implements PipeTransform {
  transform (str: any ): any {
    if ( !str.includes( 'Coinbase' ) ) {
        str = str.substring( 0, 7 ) + '...' + str.slice( str.length - 5 );
    }
    return str;
  }
}