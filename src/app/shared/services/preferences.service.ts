import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  font: string;
  fontSize: string;

  constructor() { 
    let font = localStorage.getItem('font');
    this.font = font ? font : "'Titillium Web', sans-serif";
    let fontSize = localStorage.getItem('font-size');
    this.fontSize = fontSize ? fontSize : '1em';
  }
}
