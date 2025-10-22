import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../core/services/language.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { UserModel } from '../../core/models/user.model';
import { Store } from '@ngrx/store';
import * as UserSelectors from '../../core/store/user/user.selectors';
import * as UserActions from '../../core/store/user/user.actions';

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
  private store = inject(Store);
  private languageService = inject(LanguageService);
  private router = inject(Router);
  
  currentUser$: Observable<UserModel | null> = this.store.select(UserSelectors.selectCurrentUser);
  currentLang = signal(this.languageService.getCurrentLanguage());

  switchLanguage(lang: 'ru' | 'en'): void {
    this.languageService.setLanguage(lang);
    this.currentLang.set(lang);
  }

  onLogout(): void {
    this.store.dispatch(UserActions.logoutUser());
    this.router.navigate(['/']);
  }
}