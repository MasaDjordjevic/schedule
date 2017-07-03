import {Injectable} from '@angular/core';

@Injectable()
export class ThemeService {
  private currentTheme: string;

  constructor() {
    this.currentTheme = 'ice';
  }

  getTheme() {
    return this.currentTheme;
  }

  setTheme(theme: string) {
    if (this.allThemes.filter(t => t === theme).length === 0) {
      this.currentTheme = this.allThemes[0];
    }
    this.currentTheme = theme;
  }

  get allThemes() {
    return ['material', 'ice', 'sunset', 'autumn', 'earth'];
  }

}
