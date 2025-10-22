import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../core/services/language.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    TranslocoPipe
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  private userService = inject(UserService);
  private languageService = inject(LanguageService);
  private router = inject(Router);
  
  currentUser = this.userService.currentUser;
  currentLang = signal(this.languageService.getCurrentLanguage());

  switchLanguage(lang: 'ru' | 'en'): void {
    this.languageService.setLanguage(lang);
    this.currentLang.set(lang);
  }

  onLogout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}