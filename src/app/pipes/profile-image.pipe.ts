import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'profileImage',
  standalone: true
})
export class ProfileImagePipe implements PipeTransform {

  transform(url: string, name: string): string {      
    const uiAvatarsApi = `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff&`;
    if (!url) {
      return uiAvatarsApi;
    }
    return url;
  }

}
