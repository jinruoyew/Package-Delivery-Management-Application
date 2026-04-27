import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertWeight',
  standalone: true
})
export class ConvertWeightPipe implements PipeTransform {

  transform(value: number): string {
    // Returns the weight(assume input in kg) in grams
    return (value * 1000) + "g";
  }

}
