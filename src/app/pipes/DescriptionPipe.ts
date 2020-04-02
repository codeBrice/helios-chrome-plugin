import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'description'})
export class DescriptionPipe implements PipeTransform {
  transform(str: string): string {
    if ( str.includes('Send transaction') ) {
        str = 'Sent';
    }
    if ( str.includes('Receive transaction') ) {
        str = 'Receive';
    }
    if ( str.includes('Reward type 2') ) {
        str = 'Reward';
    }
    return str;
  }
}