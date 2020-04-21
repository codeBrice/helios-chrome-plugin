import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'avatarformat'})
export class AvatarPipe implements PipeTransform {
  transform (str: any ): any {
    str = 'http://secure.gravatar.com/avatar/'+str+'?s=90&d=retro&r=g'
    return str;
  }
}