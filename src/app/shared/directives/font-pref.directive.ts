import { Directive, ElementRef } from '@angular/core';
import { PreferencesService } from '../services/preferences.service';

@Directive({
  selector: '[appFontPref]',
})
export class FontPrefDirective {
  constructor(el: ElementRef, private preferences: PreferencesService) {
    const native = el.nativeElement as HTMLElement;
    native.style.fontFamily = preferences.font;
    native.style.fontSize = preferences.fontSize;
  }
}
