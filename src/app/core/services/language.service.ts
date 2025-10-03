import { Inject, Injectable, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'user-language';
  currentLang = signal<'ru' | 'en'>('ru');

  constructor(
    private translocoService: TranslocoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  initializeLanguage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = sessionStorage.getItem(this.LANGUAGE_KEY) as 'ru' | 'en' || 'ru';
      this.setLanguage(savedLang);
    } else {
      this.translocoService.setActiveLang('ru');
      this.currentLang.set('ru');
    }
  }

  setLanguage(lang: 'ru' | 'en'): void {
    this.translocoService.setActiveLang(lang);
    this.currentLang.set(lang);
    
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(this.LANGUAGE_KEY, lang);
    }
  }

  getCurrentLanguage(): string {
    return this.translocoService.getActiveLang();
  }

  getLocalizedValue<T extends { en: string; ru: string }>(value: T): string {
    return value[this.currentLang()];
  }

  getLocalizedArray<T extends { en: string; ru: string }>(items: T[]): string[] {
    return items.map(item => item[this.currentLang()]);
  }
}