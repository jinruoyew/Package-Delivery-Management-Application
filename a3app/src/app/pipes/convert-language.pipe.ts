import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertLanguage',
  standalone: true
})
export class ConvertLanguagePipe implements PipeTransform {

  transform(value: string): string {
    // Returns the language name based on the language code
    return value === "zh-CN" ? "Chinese" : (value === "fr" ? "French" : "Japanese");
  }

}
