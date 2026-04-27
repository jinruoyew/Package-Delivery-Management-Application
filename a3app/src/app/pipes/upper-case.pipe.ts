import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'upperCase',
  standalone: true
})
export class UpperCasePipe implements PipeTransform {

  transform(value: string): string {
    // Returns the uppercased input string
    return value ? value.toUpperCase() : value;
  }

}
