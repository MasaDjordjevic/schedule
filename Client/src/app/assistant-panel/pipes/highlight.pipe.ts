import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(value: string, query: string) {
    // Ako nista nije upisano kao query
    if (query === undefined || query === '' || query == null) {
      return value;
    }

    const s: string = '(' + query + ')';
    const regex = new RegExp(s, 'gi');

    return value.replace(regex, '<mark>$1</mark>');
  }

}
